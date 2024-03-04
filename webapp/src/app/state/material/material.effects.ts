import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, take, withLatestFrom, tap } from 'rxjs/operators';
import { fromArray, fromArray2 } from 'src/app/models';
import { FileState, FileUploadedSM, fromJsonToUploadedFileSM } from 'src/app/models/file-uploaded.model';
import { fromJsonToUserSM } from 'src/app/models/user.model';
import { MaterialApiService } from 'src/app/services/api/material.api.service';
import { FileUploadedActions } from '../file-uploaded/file-uploaded.actions';
import { LoginSelectors } from '../login/login.selector';
import { UserActions } from '../user/user.actions';
import { MaterialActions } from './material.actions';
import { MaterialSelectors } from './material.selector';
import { MaterialJson } from 'src/app/models/material.model';

function getFilesFromMaterials({ input: { courseId }, data }: { input: { courseId: number }, data: MaterialJson[] }) {
  const materialsWithFiles = data.filter(material => material?.files?.length > 0)

  const files = materialsWithFiles
    .map(material => {
      return material.files.map(file => {
        return {
          ...file,
          status: { progress: 0, currently: FileState.NotPresentLocally }
        } as FileUploadedSM;
      })
    })

  return files.reduce((a, b) => a.concat(b), []);
}

@Injectable()
export class MaterialEffects {

  load$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.fetchAll.request),
    concatMap(({ input }) => this.materialApiService.getMaterials(input.courseId).pipe(
      map(materials => MaterialActions.fetchAll.success({ input, data: materials })),
      catchError((error: any) => of(MaterialActions.fetchAll.error({ input, error })))
    ))
  ));

  loadOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.fetchAll.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => MaterialActions.fetchAll.offlineError({ input, error, info: { } }))
  ));

  saveLoadedFiles$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.fetchAll.success),
    map(getFilesFromMaterials),
    map((data) => FileUploadedActions.basic.add.many({ data }))
  ));

  upsertUsersFromLoadAllSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.fetchAll.success),
    filter(({ data }) => data.length > 0),
    map(({ data }) => [...new Set(data.map(material => material.createdBy))]),
    map(fromArray2(fromJsonToUserSM)),
    map(users => UserActions.basic.upsert.many({ data: users }))
  ));


  loadFromFolder$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.fetchFolderMaterials.request),
    concatMap(({ input }) => this.materialApiService.getFolderMaterials(input.courseId, input.folderId).pipe(
      map(materials => MaterialActions.fetchFolderMaterials.success({ input, data: materials })),
      catchError((error: any) => of(MaterialActions.fetchFolderMaterials.error({ input, error })))
    ))
  ));

  saveLoadedFilesFromFolder$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.fetchFolderMaterials.success),
    map(getFilesFromMaterials),
    map((data) => FileUploadedActions.basic.add.many({ data }))
  ));

  upsertUsersFromLoadAllFromFolderSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.fetchFolderMaterials.success),
    filter(({ data }) => data.length > 0),
    map(({ data }) => [...new Set(data.map(material => material.createdBy))]),
    map(fromArray2(fromJsonToUserSM)),
    map(users => UserActions.basic.upsert.many({ data: users }))
  ));


  createLink$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.create.link.request),
    concatMap(({ input }) => this.materialApiService.create(input).pipe(
      map(data => MaterialActions.create.link.success({ input, data })),
      catchError((error: any) => of(MaterialActions.create.link.error({ input, error })))
    ))
  ));

  moveRecentlyCreatedLinkToFolder = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.create.link.success),
    filter(({ input }) => input.folderId != -1),
    map(({ input, data }) => MaterialActions.changeMaterialFolder.request({
      input: {
        courseId: input.courseId,
        materialId: data.id,
        folderId: input.folderId
      }
    }))
  ));

  createLinkOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.create.link.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      const date = new Date();
      const info = { id: date.getTime(), date: date.toISOString(), me };

      return MaterialActions.create.link.offlineError({ input, error, info })
    })
  ));

  editLink$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.editLink.request),
    concatMap(({ input }) => this.materialApiService.editMaterialLink(input).pipe(
      map(data => MaterialActions.editLink.success({ input, data })),
      catchError((error: any) => of(MaterialActions.editLink.error({ input, error })))
    ))
  ));

  editLinkOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.editLink.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => // No need for info cause link already exists (just updating)
      MaterialActions.editLink.offlineError({ input, error, info: {} })
    )
  ));

  createFiles$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.create.files.request),
    concatMap(({ input }) => this.materialApiService.createFiles(input).pipe(
      map(data => MaterialActions.create.files.success({ input, data })),
      catchError((error: any) => of(MaterialActions.create.files.error({ input, error })))
    ))
  ));

  moveRecentlyCreatedFilesToFolder = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.create.files.success),
    filter(({ input }) => input.folderId != -1),
    concatMap(({ input, data }) => of(...data).pipe(
      map(file => MaterialActions.changeMaterialFolder.request({
        input: {
          courseId: input.courseId,
          materialId: file.id,
          folderId: input.folderId
        }
      })),
    )),
  ));

  updateFileUploaded$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.create.files.success),
    map(({ data, input }) => {
      const filesJson = data.map(item => item.files.map(file => {
        return {
          ...file,
          downloadUri: `courses/${input.courseId}/materials/${item.id}/files/${encodeURIComponent(file.fileName)}`,
        }
      })).reduce((a, b) => a.concat(b), []);

      return FileUploadedActions.basic.add.many({ data: fromArray(fromJsonToUploadedFileSM, filesJson) })
    })
  ))

  createFilesOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.create.files.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      const date = new Date();
      const info = { id: date.getTime(), date: date.toISOString(), me };

      return MaterialActions.create.files.offlineError({ input, error, info })
    })
  ));

  delete$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.delete.request),
    concatMap(({ input }) => this.store.select(MaterialSelectors.byId(input.materialId)).pipe(
      take(1),
      map(material => {
        return { input, material }
      })
    )),
    concatMap(({ input, material }) => {
      if (material.id > 1600000000000) { // material created offline and not yet sent to api
        return of([
          MaterialActions.basic.remove.one({ data: input.materialId }),
          MaterialActions.offline.created.remove.one({ data: input.materialId }),
          (material.files?.length > 0) ?
            FileUploadedActions.local.database.remove.request({ input: { id: material.files?.[0], deleteAll: true } }) : null
        ].filter(Boolean)) // only send action to remove file from database if it has files.
      }
      else { // material already present in the server database
        return this.materialApiService.deleteMaterial(input).pipe(
          map(data => [
            MaterialActions.delete.success({ input, data }),
            (material.files?.length > 0) ?
              FileUploadedActions.local.database.remove.request({ input: { id: material.files[0], deleteAll: true } }) : null
          ].filter(Boolean)), // only send action to remove file from database if it has files.

          catchError((error: any) => of([MaterialActions.delete.error({ input, error })]))
        )
      }
    }),
    concatMap(actions => of(...actions))
  ));

  deleteOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.delete.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => {
      const date = new Date();
      const info = { date: date.toISOString() };

      return MaterialActions.delete.offlineError({ input, error, info })
    })
  ));

  changeMaterialFolder$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.changeMaterialFolder.request),
    concatMap(({ input }) => this.materialApiService.changeMaterialFolder(input).pipe(
      map(data => MaterialActions.changeMaterialFolder.success({ input, data })),
      catchError((error: any) => of(MaterialActions.changeMaterialFolder.error({ input, error })))
    ))
  ));

  changeMaterialFolderOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.changeMaterialFolder.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) =>
      MaterialActions.changeMaterialFolder.offlineError({ input, error, info: {} })
    )
  ));

  constructor(private actions$: Actions, private materialApiService: MaterialApiService, private store: Store) { }
}
