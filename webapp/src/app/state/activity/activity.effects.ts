import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { fromActivityFormToJson, patchActivityFiles } from 'src/app/models/activity.model';
import { FileState, FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { ActivitiesApiService } from 'src/app/services/api/activities.api.service';
import { CourseSelectors } from '../course/course.selector';
import { FileUploadedActions } from '../file-uploaded/file-uploaded.actions';
import { LoginSelectors } from '../login/login.selector';
import { ActivityActions } from './activity.actions';
import { ActivitySelectors } from './activity.selector';
import { fromArray2 } from 'src/app/models';
import { fromJsonToUserSM } from 'src/app/models/user.model';
import { UserActions } from '../user/user.actions';
import { WallPostActions } from '../wall-post/wall-post.actions';
import { WallService } from 'src/app/modules/wall/wall.service';
import { convertFromNgb } from '../../models/activity.model';
import { WallPostForm } from 'src/app/models/wall-post.model';


@Injectable()
export class ActivityEffects {

  create$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.create.request),
    concatMap(({ input }) => this.activitiesApiService.createActivity(fromActivityFormToJson(input.form), input.courseId).pipe(
      map(activity => ActivityActions.create.success({ input, data: activity })),
      catchError((error: any) => of(ActivityActions.create.error({ input, error })))
    )),
  ));
  
  // When it is offline and the creation activity failed
  createActivityOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.create.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      console.log("ActivityActions.create.error catched")
      const date = new Date();
      // generate a id to offline activity based on the date
      const info = { id: date.getTime(), date: date.toISOString(), me };
      
      return ActivityActions.create.offlineError({ input, error, info })
    })
  ));

  createSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.create.success),
    filter(({ input, data }) => input.form.files.toUpload.length > 0),
    tap(({ data }) => console.log(data)),
    map(({ input, data }) => ActivityActions.filesSync.request({ input: { form: input.form.files, courseId: input.courseId, id: data.id } }))
  ));

  upsertUsersFromLoadAllSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.fetchAll.success),
    filter(({ data }) => data.length > 0),
    map(({ data }) => [...new Set(data.map(activity => activity.createdBy))]),
    map(fromArray2(fromJsonToUserSM)),
    map(users => UserActions.basic.upsert.many({ data: users }))
  ));


  edit$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.edit.request),
    concatMap(({ input }) => this.activitiesApiService.editActivity(fromActivityFormToJson(input.form), input.courseId, input.id).pipe(
      map(activity => ActivityActions.edit.success({ input, data: activity })),
      catchError((error: any) => of(ActivityActions.edit.error({ input, error })))
    )),
  ));

  editSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.edit.success),
    map(({ input, data }) => {
      return ActivityActions.filesSync.request({ input: { form: input.form.files, courseId: input.courseId, id: data.id } })
    })
  ));

  editActivityError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.edit.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      const date = new Date();
      const info = { date: date.toISOString() };

      return ActivityActions.edit.offlineError({ input, error, info })
    })
  ))

  syncFiles$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.filesSync.request),
    mergeMap(({ input: { courseId, id, form } }) => of(true).pipe(
      map(_ => ({
        input: {
          url: `courses/${courseId}/activities/${id}/files`,
          files: form
        }
      })),
      tap(({ input }) => {
        this.store.dispatch(FileUploadedActions.api.syncFiles.request({ input }));
      }),

      concatMap(({ input }) => this.actions$.pipe(
        ofType(FileUploadedActions.api._idsRef.success),
        filter((action) => deepEqual(action.input, input)),
        take(1),
        withLatestFrom(this.store.select(ActivitySelectors.byId(id)).pipe(
          map(activity => activity?.files ?? []),
        )),
        tap(([{ data }, oldFiles]) => {
          console.warn('[ Activity / API ] Sync files for activity id=', id, 'with ids=', data);

          this.store.dispatch(ActivityActions.basic.update.one({ data: { id, changes: { files: [...data, ...oldFiles] } } }))
        }),
        map(_ => ({ input }))
      )),
      concatMap(({ input }) => this.actions$.pipe(
        ofType(FileUploadedActions.api.syncFiles.success),
        filter((action) => deepEqual(action.input, input)),
        take(1),
        map(({ data }) => ActivityActions.listFiles.success({ input: { courseId, id }, data }))
      ))
    )),
  ));

  load$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.fetchAll.request),
    concatMap(({ input }) => this.activitiesApiService.getActivities(input.courseId).pipe(
      map(activities => ActivityActions.fetchAll.success({ input, data: activities })),
      catchError((error: any) => of(ActivityActions.fetchAll.error({ input, error })))
    ))
  ));

  loadError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.fetchAll.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => ActivityActions.fetchAll.offlineError({ input, error, info: {} }))
  ));

  loadAllFromCurrentCourse$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.fromCurrentCourse.fetchAll.request),
    withLatestFrom(this.store.select(CourseSelectors.currentId)),
    map(([_, courseId]) => Number(courseId)),
    map((courseId) => ActivityActions.fetchAll.request({ input: { courseId } }))
  ));


  loadOneFromCurrentCourse$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.fromCurrentCourse.fetchOne.request),
    map(({ input }) => input.id),
    withLatestFrom(this.store.select(CourseSelectors.currentId)),
    map(([id, courseId]) => { return { id, courseId: Number(courseId) } }),
    map((input) => ActivityActions.fetchOne.request({ input }))
  ));

  loadOne$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.fetchOne.request),
    concatMap(({ input }) => this.activitiesApiService.getActivity({ activityId: input.id, courseId: input.courseId }).pipe(
      map(activity => ActivityActions.fetchOne.success({ input, data: patchActivityFiles(activity, input.courseId) })),
      catchError((error: any) => of(ActivityActions.fetchOne.error({ input, error })))
    ))
  ));

  loadOneError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.fetchOne.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => ActivityActions.fetchOne.offlineError({ input, error, info: {} }))
  ));

  delete$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.delete.request),
    concatMap(({ input }) => this.activitiesApiService.deleteActivity({ activityId: input.id, courseId: input.courseId }).pipe(
      map(_ => ActivityActions.delete.success({ input, data: null })),
      catchError((error: any) => of(ActivityActions.delete.error({ input, error })))
    ))
  ));

  deleteError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.delete.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => ActivityActions.delete.offlineError({ input, error, info: {} }))
  ));

  loadFiles$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.listFiles.request),
    concatMap(({ input }) => this.activitiesApiService.getActivityFiles({ activityId: input.id, courseId: input.courseId }).pipe(
      map(files => ActivityActions.listFiles.success({ input, data: files })),
      catchError((error: any) => of(ActivityActions.listFiles.error({ input, error })))
    ))
  ));

  loadFilesError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.listFiles.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => ActivityActions.listFiles.offlineError({ input, error, info: {} }))
  ));

  saveLoadedFiles$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.listFiles.success),
    withLatestFrom(this.store.select(LoginSelectors.apiUrl)),
    map(([{ input, data }, apiUrl]) => {
      if (!data?.length) {
        return [];
      }

      const files = data.map(file => {
        return {
          ...file,
          downloadUri: `courses/${input.courseId}/activities/${input.id}/files/${encodeURIComponent(file.fileName)}`,
          status: { progress: 0, currently: FileState.NotPresentLocally }
        } as FileUploadedSM;
      })

      return files.reduce((a, b) => a.concat(b), []);
    }),
    map((data) => FileUploadedActions.basic.add.many({ data }))
  ));

  releaseGrades$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.releaseGrades.request),
    concatMap(({ input }) => this.activitiesApiService.releaseGrades(input.courseId, input.id).pipe(
      map(activity => ActivityActions.releaseGrades.success({ input, data: activity })),
      catchError((error: any) => of(ActivityActions.releaseGrades.error({ input, error })))
    ))
  ));

  updateActivityAfterRelease = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.releaseGrades.success),
    map(ActivityActions.basic.upsert.one)
  ));

  releaseGradeError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.releaseGrades.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => ActivityActions.releaseGrades.offlineError({ input, error, info: {} }))
  ));

  constructor(private actions$: Actions, private activitiesApiService: ActivitiesApiService, private store: Store) { }
}
