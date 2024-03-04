import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, interval, of, timer, zip } from 'rxjs';
import { catchError, concatMap, delay, filter, map, mergeMap, skip, skipWhile, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { FileState, FileUploaded, FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { FileApiService } from 'src/app/services/api/file.api.service';
import { ActivityAdvancedSelectors } from '../activity/activity.advanced.selector';
import { ActivitySelectors } from '../activity/activity.selector';
import { CourseSelectors } from '../course/course.selector';
import { LoginSelectors } from '../login/login.selector';
import { MaterialAdvancedSelectors } from '../material/material.advanced.selector';
import { MaterialSelectors } from '../material/material.selector';
import { FileUploadedActions } from './file-uploaded.actions';
import { FileUploadedAdvancedSelectors } from './file-uploaded.advanced.selector';
import { FileUploadedSelectors } from './file-uploaded.selector';
import { getFileId, trimFileId } from './file-uploaded.state';

@Injectable()
export class FileUploadedEffects {

  addFilesToSync$ = createEffect(() => combineLatest([
    this.store.select(CourseSelectors.sync.enabledList),
    interval(1000).pipe(
      skip(4)
    )
  ]).pipe(
    concatMap(([courses, _]) => of(...courses.map(c => c.id))),
    concatMap((id) => of(id).pipe(
      withLatestFrom(
        this.store.select(MaterialAdvancedSelectors.sel.many(MaterialSelectors.byCourse.id.all(id))).pipe(
          map(materials => materials.map(item => item?.files ?? [])
            .reduce((a, b) => a.concat(b), []) as FileUploaded[])
        ),
        this.store.select(ActivityAdvancedSelectors.sel.many(ActivitySelectors.byCourse.id.all(id))).pipe(
          map(activities => activities.map(item => item?.files ?? []).reduce((a, b) => a.concat(b), []) as FileUploaded[])
        ),
        this.store.select(FileUploadedSelectors.currently.state).pipe(
          map(({ onQueue, synchronizing, manualRetry }) => [...onQueue, ...synchronizing, manualRetry])
        )
      ),
      map(([courseId, materialFiles, activityFiles, queue]) => {

        const allFiles = [...materialFiles, ...activityFiles];

        const filesToSync = allFiles
          .filter(file => [FileState.NotPresentLocally].includes(file?.status?.currently))
          .filter(file => !queue.includes(getFileId(file)))
          .map(file => getFileId(file))

        return { filesToSync, courseId }
      }),
      map(({ filesToSync, courseId }) => {
        if (!filesToSync?.length) {
          return []
        }

        return [
          FileUploadedActions.local.onQueue.addMany({
            ids: filesToSync
          })
        ];
      }),
    )),
    concatMap(actions => of(...actions))
  ));

  detectFailedSync$ = createEffect(() => this.store.select(
    FileUploadedAdvancedSelectors.selectManyStrings(
      FileUploadedSelectors.currently.synchronizing
    )
  ).pipe(
    switchMap(files => of(files).pipe(
      delay(10_000),
    )),
    filter(files => !files?.length),
    mergeMap(files => of(...files.map(file =>
      FileUploadedActions.local.sync.errorDetected({ file })
    ))),
  ));


  // // TODO: Before adding this, make shure to add something to prevent from infinite loop trying to sync
  // autoRetrySyncFailed$ = createEffect(() => this.store.select(FileUploadedAdvancedSelectors.selectManyStrings(
  //   FileUploadedSelectors.basic.ids
  // )).pipe(
  //   map(files => files.filter(file => [FileState.DeleteError, FileState.DownloadError, FileState.UploadError].includes(file.status.currently))),
  //   filter(files => !!files?.length),
  //   withLatestFrom(this.store.select(FileUploadedSelectors.currently.state)),
  //   map(([files, { manualRetry, onQueue, synchronizing }]) => files.filter(file =>
  //     ![...manualRetry, ...onQueue, ...synchronizing].includes(getFileId(file))
  //   )),
  //   filter(files => !!files?.length),
  //   map(files => FileUploadedActions.local.onQueue.addMany({
  //     ids: files.map(file => getFileId(file))
  //   })),
  // ));

  syncNext$ = createEffect(() => combineLatest([
    this.store.select(FileUploadedSelectors.currently.next),
    this.store.select(LoginSelectors.isOffline)
  ]).pipe(
    filter(([id, isOffline]) => !isOffline && !!id),
    map(([id, isOffline]) => FileUploadedActions.local.sync.start({ id }))
  ))

  download$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.local.sync.start),
    mergeMap(({ id }) => this.store.select(FileUploadedSelectors.byId(id)).pipe(
      take(1),
      filter(file => !!file?.byteSize &&
        [FileState.IsDownloading, FileState.NeedsToBeDownloaded, FileState.DownloadError]
          .includes(file.status.currently)
        && file.downloadUri?.length > 1
      ),
      withLatestFrom(this.store.select(LoginSelectors.state)),
      map(([file, state]) => {
        return {
          url: `${state.apiUrl}${file?.downloadUri}?access_token=${state?.token?.value}`,
          id: getFileId(file)
        }
      })
    )),
    mergeMap(({ url, id }) => this.fileApi.downloadFile({ url, id }).pipe(
      takeUntil(this.actions$.pipe(
        ofType(FileUploadedActions.local.sync.cancel),
        filter(action => action.id === id)
      )),
      map(({ response, status }) => {
        const actions: Action[] = [];

        if (!!status) {
          actions.push(FileUploadedActions.local.sync.updateStatus({ id, status }))

          if (response instanceof HttpResponse && response.status === 200) {
            actions.push(FileUploadedActions.local.database.add.request({
              input: {
                id,
                blob: (response).body
              }
            }))
          }
        }

        return actions;
      }),
      catchError(() => of([
        FileUploadedActions.local.onQueue.remove({ id }),
        FileUploadedActions.local.sync.updateStatus({
          id, status: {
            currently: FileState.DownloadError,
            lastModified: (new Date()).toISOString(),
            progress: 0,
          }
        })
      ]))
    )),
    mergeMap(actions => of(...actions))
  ))

  delete$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.local.sync.start),
    mergeMap(({ id }) => this.store.select(FileUploadedSelectors.byId(id)).pipe(
      take(1),
      filter(file => !!file?.byteSize &&
        [FileState.NeedsToBeDeleted, FileState.DeleteError]
          .includes(file.status.currently)
        && file.downloadUri?.length > 1
      ),
      map((file) => {
        return {
          file,
          url: file?.downloadUri,
        }
      }),
    )),
    mergeMap(({ url, file }) => this.fileApi.deleteFile(url).pipe(
      map(_ => [
        FileUploadedActions.local.onQueue.remove({ id: getFileId(file) }),
        FileUploadedActions.basic.remove.one({ data: getFileId(file) })
      ]),
      catchError(() => of([
        FileUploadedActions.local.onQueue.remove({ id: getFileId(file) }),
        FileUploadedActions.local.sync.updateStatus({
          id: getFileId(file), status: {
            currently: FileState.DeleteError,
            lastModified: (new Date()).toISOString(),
            progress: 0,
          }
        })
      ]))
    )),
    concatMap(actions => of(...actions)),
  ));

  syncFiles$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.api.syncFiles.request),
    mergeMap(({ input }) => { // Save upload files to local database first
      const baseNumber = Date.now().valueOf();

      return !input.files.toUpload?.length
        ? of(({ input, idsToUpload: [] }))
        : zip(...input.files.toUpload.map((file, index) => {
          const sha3Hex = `local_upload_${baseNumber}-${index}`;
          const fileSM = {
            sha3Hex,
            fileName: file.name,
            mimeType: file.type,
            byteSize: file.size ?? "application/octet-stream",
            downloadUri: input.url,
            status: {
              currently: FileState.NeedsToBeUploaded,
              lastModified: (new Date()).toISOString(),
              progress: 0,
            }
          } as FileUploadedSM;

          const newFileId = getFileId(fileSM);

          return this.fileApi.setFile(newFileId, file).pipe(
            map(_ => fileSM),
            catchError(error => {
              console.log({ message: `Error while adding file id=${newFileId} to database`, error })
              return of(null as FileUploadedSM);
            })
          )
        })).pipe(
          tap(data => this.store.dispatch(FileUploadedActions.basic.add.many({ data }))),
          map(data => ({ idsToUpload: data.map(file => getFileId(file)), input }))
        )
    }),
    // Update Files to be deleted
    tap(({ input, idsToUpload }) => {

      const filesToBeDeletedLocally = input.files.toDelete.filter(file => file.status.currently === FileState.Downloaded);

      filesToBeDeletedLocally.forEach(file => {
        this.store.dispatch(
          FileUploadedActions.local.database.remove.request({
            input: {
              id: getFileId(file)
            }
          }))
      });

      this.store.dispatch(FileUploadedActions.basic.update.many({
        data: input.files.toDelete.map(file => ({
          id: getFileId(file),
          changes: {
            status: {
              ...file.status,
              currently: FileState.NeedsToBeDeleted
            }
          }
        }))
      }))
    }),
    map(({ input, idsToUpload }) => ({
      input,
      idsToSync: idsToUpload.concat(input.files.toDelete.map(file => getFileId(file)))
    })),
    // Notify components the ids of files that are being uploaded/deleted
    tap(({ input, idsToSync }) => this.store.dispatch(FileUploadedActions.api._idsRef.success({ data: idsToSync, input }))),
    // Mark files to be uploaded/deleted
    tap(({ input, idsToSync }) => this.store.dispatch(
      FileUploadedActions.local.onQueue.addMany({
        ids: idsToSync
      }))),
    mergeMap(({ input, idsToSync }) => timer(1000).pipe(
      withLatestFrom(this.store.select(FileUploadedSelectors.currently.state)),
      // Wait for all files to be uploaded/deleted
      skipWhile(([_, state]) => idsToSync.some(id =>
        [...state.onQueue, ...state.synchronizing]
          .includes(id)
      )),
      take(1),
      // Re-fetch all files (for debugging)
      mergeMap(_ => this.fileApi.listFiles(input.url).pipe(
        map(data => FileUploadedActions.api.syncFiles.success({ input, data })),
        catchError(error => {
          console.log({
            error,
            message: `Error while listing files after upload/delete for url=${input.url}. Maybe this endpoint does not work for listing files.`
          })
          return of(FileUploadedActions.api.syncFiles.success({ input, data: null }))
        })
      ))
    ))
  ));

  upload$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.local.sync.start),
    mergeMap(({ id }) => this.store.select(FileUploadedSelectors.byId(id)).pipe(
      take(1),
      filter(file => !!file?.byteSize &&
        [FileState.IsUploading, FileState.NeedsToBeUploaded, FileState.UploadError]
          .includes(file.status.currently)
        && file.downloadUri?.length > 1
      ),
      tap(file => console.log({ message: `Uploading file id=${getFileId(file)}`, file })),
      mergeMap(file => this.fileApi.getFile<File>(id).pipe(
        take(1),
        tap(_ => console.log({ message: `File id=${id} chegou aqui`, file })),
        map(blob => new File([blob], file.fileName, { lastModified: Date.now() })),
        map(blob => ({ file, blob }))
      )),
      map(({ file, blob }) => {
        console.log({ message: `Uploading item ${getFileId(file)}`, file, blob })

        return {
          url: file?.downloadUri,
          blob: blob,
          id: getFileId(file),
          fileName: file.fileName,
        }
      }),
      tap(data => console.log({ data })),
    )),
    mergeMap(({ url, blob, id, fileName }) => this.fileApi.uploadFile({ url, blob, fileName }).pipe(
      tap(message => console.log({ message, id, url })),
      takeUntil(this.actions$.pipe(
        ofType(FileUploadedActions.local.sync.cancel),
        filter(action => action.id === id)
      )),
      map(({ response, status, result }) => {
        if (!!result) {
          return FileUploadedActions.local.uploadDone({ id, newFile: result[0] });
        }

        return FileUploadedActions.local.sync.updateStatus({ id, status })
      }),
      catchError(() => of(...[
        FileUploadedActions.local.onQueue.remove({ id }),
        FileUploadedActions.local.sync.updateStatus({
          id, status: {
            currently: FileState.UploadError,
            lastModified: (new Date()).toISOString(),
            progress: 0,
          }
        })
      ]))
    ))
  ));

  uploadDone$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.local.sync.updateStatus),
    filter(({ status, id }) => status.currently === FileState.Uploaded),
    map(({ id }) => ([
      FileUploadedActions.local.onQueue.remove({ id }),
      FileUploadedActions.local.database.remove.request({ input: { id } })
    ])),
    mergeMap(actions => of(...actions))
  ));


  downloadCancelled$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.local.sync.cancel),
    mergeMap(({ id }) => this.store.select(FileUploadedSelectors.byId(id)).pipe(
      filter(file => file?.status?.currently === FileState.IsDownloading),
      map(file => FileUploadedActions.local.sync.updateStatus({
        id: id,
        status: {
          currently: FileState.DownloadError,
          lastModified: (new Date()).getTime().toString(),
          progress: 0
        }
      }))
    ))
  ))

  uploadCancelled$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.local.sync.cancel),
    mergeMap(({ id }) => this.store.select(FileUploadedSelectors.byId(id)).pipe(
      filter(file => file?.status?.currently === FileState.IsUploading),
      map(file => FileUploadedActions.local.sync.updateStatus({
        id: id,
        status: {
          currently: FileState.UploadError,
          lastModified: (new Date()).getTime().toString(),
          progress: 0
        }
      }))
    ))
  ))

  addToDatabase$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.local.database.add.request),
    mergeMap(({ input }) => this.fileApi.setFile(trimFileId(input.id), input.blob).pipe(
      map(_ => [
        FileUploadedActions.local.database.add.success({ input, data: null })
      ]),
      catchError(error => {
        console.log({ message: `Error while adding ${input.id} to database`, error })
        return of([]);
      })
    )),
    mergeMap(actions => of(...actions)),
  ))

  removeFromDatabase$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.local.database.remove.request),
    mergeMap(({ input }) => this.fileApi.removeFile(input.id).pipe(
      map(_ => [
        FileUploadedActions.local.database.remove.success({ input, data: null })
      ]),
      catchError(error => {
        console.log({ message: `Error while removing ${input.id} from database`, error })
        return of([]);
      })
    )),
    mergeMap(actions => of(...actions)),
  ))


  constructor(private actions$: Actions, private fileApi: FileApiService, private store: Store) { }
}
