import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { concatMap, filter, map, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { FileState, FileUploaded, FileUploadedSM, HaveFilesSM } from 'src/app/models/file-uploaded.model';
import { FileApiService } from 'src/app/services/api/file.api.service';
import { MaterialSelectors } from 'src/app/state/material/material.selector';
import { FileUploadedActions } from '../../file-uploaded/file-uploaded.actions';
import { FileUploadedSelectors } from '../../file-uploaded/file-uploaded.selector';
import { getFileId } from '../../file-uploaded/file-uploaded.state';
import { LoginSelectors } from '../../login/login.selector';
import { OfflineRequestType } from '../../shared/offline/offline.state';
import { AppState } from '../../state';
import { ActivityActions } from '../activity.actions';
import { ActivityOfflineActions } from './activity.offline.actions';
import { ActivityOfflineSelectors } from './activity.offline.selector';
import { ActivityForm, ActivitySM, convertFromNgb, fromActivityFormtoActivitySM, fromActivitySMtoActivityForm } from 'src/app/models/activity.model';
import { ActivitySelectors } from '../activity.selector';
import { selectRouteParam } from '../../router/router.selector';
import { ActivitiesComponent } from 'src/app/modules/activities/activities/activities.component';
import { FileUploadedAdvancedSelectors } from '../../file-uploaded/file-uploaded.advanced.selector';
import { Router } from '@angular/router';
import { CourseSelectors } from '../../course/course.selector';
import { activityItemOfflineActions } from '../../activity-item/offline/activity-item.offline.actions';
import { ActivityItemActions } from '../../activity-item/activity-item.actions';

@Injectable()
export class ActivityOfflineEffects {

  // Handles the action create.offlineError dispatched by activity.effects
  createActivityOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.create.offlineError),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([{ input, info }, userId]) => {

      const courseId: number = input.courseId
      const activityId: number = info.id
      const form = input.form

      
      const filesToConvert: File[] = input.form?.files.toUpload
      const creationDate: string = info.date
      const fileHex = 'local_upload_' + activityId.toString();

      // convert File's array into FileUploadedSM's array
      const convertedFiles: FileUploadedSM[] = filesToConvert.map((file) => {
        let fileSM = {
          byteSize: file.size,
          mimeType: file.type,
          fileName: file.name,
          status: {
            currently: FileState.NeedsToBeUploaded,
            lastModified: creationDate.toString(),
            progress: 0
          },
          downloadUri: `courses/${courseId}/activities/${activityId}/files/${encodeURIComponent(file.name)}`,
          sha3Hex: fileHex
        } as FileUploadedSM

        // Dispatch action to add file on adapter (entity)
        this.store.dispatch(ActivityOfflineActions.meta.addFileOfflineActivity({file, fileSM}))

        return fileSM
      })

      // convert ActivityForm to ActivitySM
      const activitySM = fromActivityFormtoActivitySM(form, userId, activityId, creationDate, convertedFiles)
      
      return ActivityOfflineActions.meta.addOfflineActivity({
        idAndGroup: {
          id: activityId,
          groupId: courseId
        },  
        activity: activitySM
      })
    }),
  ));

  markActivityAsCreatedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.meta.addOfflineActivity),
    map(({ idAndGroup }) => ActivityOfflineActions.created.add.one({ data: idAndGroup }))
  ));

  editActivityOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.edit.offlineError),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([{ input, info }, userId]) => {

      const courseId: number = input.courseId
      const activityId: number = input.id
      const form = input.form
      const creationDate: string = info.date

      const filesToDeleteIds = input.form.files.toDelete.map(file => getFileId(file))

      const filesToDeleteLocally = filesToDeleteIds.filter(file => file.includes('local_upload_'));
      const filesToDeleteFromDB = filesToDeleteIds.filter(file => !file.includes('local_upload_'));

      console.log(filesToDeleteLocally)
      console.log(filesToDeleteFromDB);

      filesToDeleteLocally.forEach((fileId) => {
        this.store.dispatch(FileUploadedActions.basic.remove.one({ data: fileId }))
      })

      if (filesToDeleteFromDB?.length > 0) {
        this.store.dispatch(ActivityActions.offline.filesToDelete.upsert.one({
          data: {
            activityId: activityId,
            files: filesToDeleteFromDB
          }
        }))
      }

      const filesToConvert: File[] = input.form?.files.toUpload
      const fileHex = 'local_upload_' + activityId.toString();

      // convert files to upload
      const convertedFiles: FileUploadedSM[] = filesToConvert.map((file) => {
        let fileSM = {
          byteSize: file.size,
          mimeType: file.type,
          fileName: file.name,
          status: {
            currently: FileState.NeedsToBeUploaded,
            lastModified: creationDate.toString(),
            progress: 0
          },
          downloadUri: `courses/${courseId}/activities/${activityId}/files/${encodeURIComponent(file.name)}`,
          sha3Hex: fileHex
        } as FileUploadedSM

        // Dispatch action to add file on adapter (entity)
        this.store.dispatch(ActivityOfflineActions.meta.addFileOfflineActivity({file, fileSM}))

        return fileSM
      })

      const finalFiles: FileUploadedSM[] = convertedFiles.concat(input.form.files.uploaded);

      // convert ActivityForm to ActivitySM
      const activitySM = fromActivityFormtoActivitySM(form, userId, activityId, creationDate, finalFiles);
      return ActivityOfflineActions.meta.editOfflineActivity({
        idAndGroup: {
          id: activityId,
          groupId: courseId
        },  
        activity: activitySM
      })
    })
  ))

  markActivityAsEditedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityOfflineActions.meta.editOfflineActivity),
    map(({ idAndGroup }) => ActivityOfflineActions.updated.add.one({ data: idAndGroup }))
  ))

  fetchActivitiesOrFilesOffline$ = createEffect(() => this.actions$.pipe(
    ofType(
      ActivityActions.fetchOne.offlineError,
      ActivityActions.fetchAll.offlineError,
      ActivityActions.listFiles.offlineError
    ),
    concatMap(({ input }) => this.store.select(ActivitySelectors.current.id).pipe(
      take(1),
      map((activityId) => ActivityActions.offline.requested.groupIds.add.one({ data: activityId }))
    ))
  ));

  deleteActivityOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.delete.offlineError),
    map(({ input }) => {
      if (input.id > 1600000000000) {
        this.store.dispatch(ActivityOfflineActions.created.remove.one({ data: input.id }));
        this.store.dispatch(ActivityActions.basic.remove.one({ data: input.id }))
      }
      return [
        ActivityItemActions.offline.requested.groupIds.remove.one({ data: input.id }),
        ActivityOfflineActions.requested.groupIds.remove.one({ data: input.id }),
        ActivityOfflineActions.deleted.add({
          data: {
            id: input.id,
            groupId: input.courseId
          }
        })
      ]
    }),
    concatMap(actions => of(...actions))
  ));

  markActivityAsGradesReleased$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.releaseGrades.offlineError),
    map(({ input }) => ActivityActions.offline.gradesReleased.add.one({
      data: {
        id: input.id,
        groupId: input.courseId
      }
    }))
  ))

  // ------------------------------------------------
  // ------------------------------------------------
  // SYNC
  // ------------------------------------------------
  // ------------------------------------------------

  // Sync (CRUD) when changes to online
  autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
    filter(isOffline => !isOffline),
    withLatestFrom(this.store.select(ActivityOfflineSelectors.nextAction)),
    filter(([_, type]) => type !== OfflineRequestType.None),
    map(_ => ActivityActions.offline.sync.syncAll())
  ))

  // Sync all basic operations (CRUD)
  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.syncAll),
    concatMap(_ => of(
      ActivityActions.offline.sync.created.syncAll(),
      ActivityActions.offline.sync.requested.syncAll(),
      ActivityActions.offline.sync.updated.syncAll(),
      ActivityActions.offline.sync.deleted.syncAll(),
      ActivityActions.offline.sync.gradesReleased.syncAll()
    ))
  ));

  // --------------------------------------------------------------
  //  Created

  syncCreatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.created.syncAll),
    concatMap(_ => this.store.select(ActivityOfflineSelectors.created.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => ActivityActions.offline.sync.created.byId({ input: id }))
      )),
    ))
  ));

  syncCreatedById$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.created.byId),
    concatMap(({ input: { id, groupId } }) => this.store.select(ActivitySelectors.byId(id)).pipe(
      take(1),
      map((activity) => {
        let files;
        files = activity?.files.map((file, index) => {
          let fileUploadedSM: FileUploadedSM;
          this.store.select(FileUploadedSelectors.byId(activity.files[index])).subscribe((file) => fileUploadedSM = file)
          return {
            size: fileUploadedSM.byteSize,
            type: fileUploadedSM.mimeType,
            name: fileUploadedSM.fileName
          } as File
        })

        let createAction: Action = ActivityActions.create.request({
          input: {
            courseId: groupId,
            form: fromActivitySMtoActivityForm(activity, files, [], [])
          }
        })
        

        return [
          ActivityActions.basic.remove.one({ data: id }),
          ActivityActions.offline.created.remove.one({ data: id }),
          createAction
        ];
      }),
      concatMap(actions => of(...actions))
    ))
  ));
  // --------------------------------------------------------------
  //  Requested

  syncRequestedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.requested.syncAll),
    concatMap((_) => this.store.select(ActivityOfflineSelectors.requested.groups).pipe(
      take(1),
      concatMap(groups => of(...groups).pipe(
        map(groupId => ActivityActions.offline.sync.requested.groupById({ input: { groupId } }))),
      ),
    ))
  ));

  syncRequestedGroupById$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.requested.groupById),
    map(({ input: { groupId } }) => {

      let courseId: number;
      this.store.select(CourseSelectors.currentId).subscribe(id => courseId = id);

      let activityId: number = groupId;

      return [
        ActivityActions.offline.requested.groupIds.remove.one({ data: groupId }),
        ActivityActions.fetchAll.request({
          input: {
            courseId: courseId
          }
        }),
        ActivityActions.listFiles.request({
          input: {
            id: activityId,
            courseId
          }
        })
      ]
    }),
    concatMap(actions => of(...actions))
  ));

  // --------------------------------------------------------------
  //  Updated

  syncUpdatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.updated.syncAll),
    concatMap((_) => this.store.select(ActivityOfflineSelectors.updated.ids).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        map(id => ActivityActions.offline.sync.updated.byId({ input: id }))),
      ),
    ))
  ));

  syncUpdatedById$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.updated.byId),
    concatMap(({ input }) => this.store.select(ActivitySelectors.byId(input.id)).pipe(
      take(1),
      map(activity => {
        let filesToUpload = activity.files.filter(file => file.includes('local_upload_'));
        let filesUploaded = activity.files.filter(file => !file.includes('local_upload_'));

        let filesToUploadConverted = filesToUpload.map((file, index) => {
          let fileUploadedSM: FileUploadedSM;
          this.store.select(FileUploadedSelectors.byId(file)).subscribe((file) => fileUploadedSM = file)
          this.store.dispatch(FileUploadedActions.basic.remove.one({ data: file }))
          return {
            size: fileUploadedSM.byteSize,
            type: fileUploadedSM.mimeType,
            name: fileUploadedSM.fileName
          } as File
        });

        let filesUploadedConverted: FileUploaded[] = filesUploaded.map(file => {
          let fileUploadedSM: FileUploadedSM;
          this.store.select(FileUploadedSelectors.byId(file)).subscribe((file) => fileUploadedSM = file)
          return fileUploadedSM;
        })

        let filesToDeleteIds: string[];
        this.store.select(ActivityOfflineSelectors.filesToDelete.byActivityId(activity.id)).subscribe(filesToDelete => filesToDeleteIds = filesToDelete.files);

        let filesToDeleteConverted: FileUploaded[] = filesToDeleteIds.map(file => {
          let fileUploadedSM: FileUploadedSM;
          this.store.select(FileUploadedSelectors.byId(file)).subscribe((file) => fileUploadedSM = file)
          return fileUploadedSM;
        })

        let editRequest: Action = ActivityActions.edit.request({
          input: {
            id: activity.id,
            courseId: input.groupId,
            form: fromActivitySMtoActivityForm(activity, filesToUploadConverted, filesUploadedConverted, filesToDeleteConverted)
          }
        })

        return [
          ActivityActions.basic.remove.one({ data: input.id }),
          ActivityActions.offline.updated.remove.one({ data: input.id }),
          editRequest
        ];
      })
    )),
    concatMap(actions => of(...actions))
  ));

  // --------------------------------------------------------------
  //  Deleted

  syncDeletedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.deleted.syncAll),
    concatMap((_) => this.store.select(ActivityOfflineSelectors.deleted.idsAndGroupIds).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        map(id => ActivityActions.offline.sync.deleted.byId({ input: id }))),
      ),
    ))
  ));

  syncDeleteById$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.deleted.byId),
    tap(({ input }) => console.log(input)),
    map(({ input }) => {  
      return [
        ActivityActions.delete.request({
          input: {
            id: input.id,
            courseId: input.groupId
          }
        }),
        ActivityOfflineActions.deleted.remove({ data: input })
      ]
    }),
    concatMap(actions => of(...actions))
  ))

  // --------------------------------------------------------------
  //  Grades released
    
  syncGradesReleasedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.gradesReleased.syncAll),
    concatMap(_ => this.store.select(ActivityOfflineSelectors.gradeReleased.idsAndGroupIds).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        tap((id) => console.log(id)),
        map((id) => ActivityActions.offline.sync.gradesReleased.byId({ input: id }))
      )),
    ))
  ));

  syncGradeReleasedById$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityActions.offline.sync.gradesReleased.byId),
    tap(({ input }) => console.log(input)),
    map(({ input }) => {
      console.log('BOLA QUADRADA')
      return [
        ActivityActions.releaseGrades.request({
          input: {
            id: input.id,
            courseId: input.groupId
          }
        }),
        ActivityOfflineActions.gradesReleased.remove.one({ data: input.id })
      ]
    }),
    concatMap(actions => of(...actions))
  ))

  constructor(private actions$: Actions, private store: Store<AppState>, private fileApi: FileApiService) {}
}