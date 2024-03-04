import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, createAction } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { ActivityItemSM } from 'src/app/models/activity-item.model';
import { ActivitiesApiService } from 'src/app/services/api/activities.api.service';
import { ActivityItemActions } from '../activity-item/activity-item.actions';
import { ActivitySubmissionActions } from './activity-submission.actions';
import { ActivitySubmissionSelectors } from './activity-submission.selector';
import { FileUploadedActions } from '../file-uploaded/file-uploaded.actions';
import deepEqual from 'deep-equal';
import { LoginSelectors } from '../login/login.selector';
import { FileState, FileUploadedJson, FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { ActivitySubmissionSM, SubmissionFile, updateDateAndCreator } from 'src/app/models/activity-submission.model';
import { getFileId } from '../file-uploaded/file-uploaded.state';
import { ActivityItemSelectors } from '../activity-item/activity-item.selector';
import { Update } from '@ngrx/entity';
import { ActivitySubmissionOfflineActions } from './offline/activity-submission.offline.actions';

@Injectable()
export class ActivitySubmissionEffects {

  getMine$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.getMine.request),
    concatMap(({ input }) => this.activitiesApiService.getMySubmission(input).pipe(
      map(submission => [
        ActivitySubmissionActions.getMine.success({ input, data: updateDateAndCreator(submission) }),
        ActivityItemActions.indirectlyUpsert({
          items: [
            {
              activityId: input.activityId,
              submissionId: submission.id,
              userId: submission.lastModifiedBy.id,
              evaluationId: undefined
            } as ActivityItemSM
          ]
        })
      ]),
      catchError((error: any) => of([
        ActivitySubmissionActions.getMine.error({ input, error })
      ]))
    )),
    concatMap(actions => of(...actions))
  ));

  getMineError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.getMine.error),
    withLatestFrom(this.store$.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store$.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => ActivitySubmissionActions.getMine.offlineError({ input, error, info: {} }))
  ))

  loadFiles$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.listFiles.request),
    concatMap(({ input }) => this.activitiesApiService.getSubmissionFilesFromAnotherUser(input.courseId, input.activityId, input.userId).pipe(
      tap((files) => console.log(files)),
      map(files => ActivitySubmissionActions.listFiles.success({ input, data: files })),
      catchError((error: any) => of(ActivitySubmissionActions.listFiles.error({ input, error })))
    ))
  ));

  loadFileError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.listFiles.error),
    withLatestFrom(this.store$.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store$.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => ActivitySubmissionActions.listFiles.offlineError({ input, error, info: {} }))
  ))

  getAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.getAll.request),
    concatMap(({ input }) => this.activitiesApiService.getSubmissions(input).pipe(
      map(submissions => ActivitySubmissionActions.getAll.success({ input, data: submissions })),
      catchError((error: any) => of(ActivitySubmissionActions.getAll.error({ input, error })))
    ))
  ));

  getAllError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.getAll.error),
    withLatestFrom(this.store$.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store$.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => ActivitySubmissionActions.getAll.offlineError({ input, error, info: {} }))
  ))

  create$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.create.request),
    concatMap(({ input }) => this.activitiesApiService.createSubmission(input).pipe(
      map(submission => ActivitySubmissionActions.create.success({ input, data: updateDateAndCreator(submission) })),
      catchError((error: any) => of(ActivitySubmissionActions.create.error({ input, error })))
    ))
  ));

  createSubmissionOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.create.error),
    withLatestFrom(this.store$.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store$.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      console.log("ActivitySubmissionActions.create.error catched")
      const date = new Date();
      // generate a id to offline activity based on the date
      const info = { id: date.getTime(), date: date.toISOString(), isEditing: false, me };
      
      return ActivitySubmissionActions.create.offlineError({ input, error, info })
    })
  ));

  createSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.create.success),
    filter(({ input, data }) => input.form.files.toUpload.length > 0),
    map(({ input, data }) => ActivitySubmissionActions.filesSync.request({ input: { form: input.form.files, courseId: input.courseId, submissionId: data.id, activityId: input.activityId } }))
  ));

  syncFiles$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.filesSync.request),
    mergeMap(({ input: { courseId, submissionId, form, activityId } }) => of(true).pipe(
      map(_ => ({
        input: {
          url: `courses/${courseId}/activities/${activityId}/submission/files`,
          files: form
        }
      })),
      tap(({ input }) => {
        this.store$.dispatch(FileUploadedActions.api.syncFiles.request({ input }));
      }),

      concatMap(({ input }) => this.actions$.pipe(
        ofType(FileUploadedActions.api._idsRef.success),
        filter((action) => deepEqual(action.input, input)),
        take(1),
        withLatestFrom(this.store$.select(ActivitySubmissionSelectors.byId(submissionId)).pipe(
          map(activity => activity?.files ?? []),
        )),
        tap(([{ data }, oldFiles]) => {
          console.warn('[ ActivitySubmission / API ] Sync files for submission id=', submissionId, 'with ids=', data);

          this.store$.dispatch(ActivitySubmissionActions.basic.update.one({ data: { id: submissionId, changes: { files: [...data, ...oldFiles] } } }))
        }),
        map(_ => ({ input }))
      )),
      concatMap(({ input }) => this.actions$.pipe(
        ofType(FileUploadedActions.api.syncFiles.success),
        filter((action) => deepEqual(action.input, input)),
        take(1),
        concatMap(({ data }) => this.store$.select(LoginSelectors.loggedUserId).pipe(
          take(1),
          map((userId) => ActivitySubmissionActions.listFiles.success({ input: { courseId, submissionId, activityId, userId }, data }))
        ))
        
      ))
    )),
  ));

  saveLoadedFiles$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.listFiles.success),
    map(({ input, data }) => {
      if (!data?.length) {
        return [];
      }

      const filesUploadedSM = data.map(file => {
        return {
          ...file,
          downloadUri: `courses/${input.courseId}/activities/${input.activityId}/submission/files/${encodeURIComponent(file.fileName)}`,
          status: { progress: 0, currently: FileState.NotPresentLocally }
        } as FileUploadedSM;
      })

      const filesWithCorrectUri = data.map(file => {
        return {
          ...file,
          downloadUri: `courses/${input.courseId}/activities/${input.activityId}/submission/files/${encodeURIComponent(file.fileName)}`
        }
      })

      const filesIds = filesWithCorrectUri.map(file => getFileId(file));
      console.log(filesIds);

      return [
        FileUploadedActions.basic.upsert.many({ data: filesUploadedSM }),
        ActivitySubmissionActions.basic.update.one({
          data: {
            id: input.submissionId,
            changes: { files: [...filesIds] }
          }
        })
      ];
    }),
    concatMap(actions => of(...actions))
  ));

  edit$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.edit.request),
    concatMap(({ input }) => this.activitiesApiService.editSubmission(input).pipe(
      map(submission => ActivitySubmissionActions.edit.success({ input, data: updateDateAndCreator(submission) })),
      catchError((error: any) => of(ActivitySubmissionActions.edit.error({ input, error })))
    ))
  ));

  editSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.edit.success),
    filter(({ input, data }) => input.form.files.toUpload.length > 0),
    map(({ input, data }) => ActivitySubmissionActions.filesSync.request({ input: { form: input.form.files, courseId: input.courseId, submissionId: data.id, activityId: input.activityId } })
    ),
  ));

  editSubmissionError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.edit.error),
    withLatestFrom(this.store$.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store$.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      const date = new Date();
      const info = { id: date.getTime(), date: date.toISOString(), me };

      return ActivitySubmissionActions.edit.offlineError({ input, error, info })
    })
  ))


  editErrorFilesToUpload$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.edit.error),
    filter(({ input }) => input.form.files.toUpload.length > 0),
    map(({ input }) => {

      const filesToUpdate: SubmissionFile[] = input.form.files.toUpload.map((file) => {
        const submissionFile: SubmissionFile = {
          id: input.submissionId,
          
          file: file.name
        }
        return submissionFile;
      })
      return ActivitySubmissionOfflineActions.filesChanged.toUpdate.add.many({ data: filesToUpdate });
    })
  ));

  deleteFile$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.deleteFile.request),
    concatMap(({ input }) => this.activitiesApiService.deleteSubmissionFile(input).pipe(
      map(_ => ActivitySubmissionActions.deleteFile.success({ input, data: null })),
      catchError((error: any) => of(ActivitySubmissionActions.deleteFile.error({ input, error })))
    ))
  ));

  deleteFileError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.deleteFile.error),
    withLatestFrom(this.store$.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store$.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {

      const submissionFile: SubmissionFile = {
        id: input.submissionId,
        file: input.fileName
      }
      if (input.fileId.includes('local_upload_')) {
        return FileUploadedActions.basic.remove.one({ data: input.fileId });
      }

      return ActivitySubmissionOfflineActions.filesChanged.toDelete.add.one({
        data: submissionFile
      })
    })
  ))


  delete$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.delete.request),
    concatMap(({ input }) => this.activitiesApiService.deleteSubmission(input).pipe(
      map(_ => ActivitySubmissionActions.delete.success({ input, data: null })),
      catchError((error: any) => of(ActivitySubmissionActions.delete.error({ input, error })))
    ))
  ));


  constructor(private actions$: Actions, private activitiesApiService: ActivitiesApiService, private store$: Store) { }
}
