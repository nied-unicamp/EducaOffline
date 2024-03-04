import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store, createAction } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, take, withLatestFrom } from 'rxjs/operators';
import { ActivitySubmissionSelectors } from 'src/app/state/activity-submission/activity-submission.selector';
import { LoginSelectors } from '../../login/login.selector';
import { OfflineRequestType } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';
import { AppState } from '../../state';
import { ActivitySubmissionActions } from '../activity-submission.actions';
import { ActivitySubmissionOfflineSelectors } from './activity-submission.offline.selector';
import { ActivitySubmissionOfflineActions } from './activity-submission.offline.actions';
import { FileState, FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { SubmissionFile, fromFormToActivitySubmissionSM, fromSMtoActivitySubmissionForm } from 'src/app/models/activity-submission.model';
import { ActivityItemActions } from '../../activity-item/activity-item.actions';
import { ActivityItemSM } from 'src/app/models/activity-item.model';
import { FileUploadedSelectors } from '../../file-uploaded/file-uploaded.selector';
import { ActivitySelectors } from '../../activity/activity.selector';
import { FileUploadedActions } from '../../file-uploaded/file-uploaded.actions';
import { getFileId } from '../../file-uploaded/file-uploaded.state';
import { CourseSelectors } from '../../course/course.selector';
import { UserSelectors } from '../../user/user.selector';
import { ActivityItemSelectors } from '../../activity-item/activity-item.selector';

@Injectable()
export class ActivitySubmissionOfflineEffects {
  

  createSubmissionOffline = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.create.offlineError),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([{ input, info }, userId]) => {

      const courseId = input.courseId
      const form = input.form
      const submissionId = info.id
      const creationDate = info.date
      const activityId = input.activityId

      const filesToConvert: File[] = input.form?.files.toUpload
      const fileHex = 'local_upload_' + submissionId.toString();

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
          downloadUri: `courses/${input.courseId}/activities/${activityId}/submission/files/${encodeURIComponent(file.name)}`,
          sha3Hex: fileHex
        } as FileUploadedSM

        this.store.dispatch(ActivitySubmissionOfflineActions.meta.addFileOfflineSubmission({file, fileSM}))

        return fileSM
      })

      const convertedFilesIds = convertedFiles.map(file => getFileId(file));
      const submissionSM = fromFormToActivitySubmissionSM(form, userId, submissionId, creationDate, convertedFilesIds);

      this.store.dispatch(ActivityItemActions.indirectlyUpsert({
        items: [
          {
            activityId: activityId,
            submissionId: submissionId,
            userId: userId,
            evaluationId: undefined
          } as ActivityItemSM
        ]
      }))
      return ActivitySubmissionOfflineActions.meta.addOfflineSubmission({
        idAndGroup: {
          id: submissionId,
          groupId: courseId
        },  
        submission: submissionSM
      })
    })
  ))
  
  markSubmissionAsCreatedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.offline.meta.addOfflineSubmission),
    map(({ idAndGroup }) => ActivitySubmissionOfflineActions.created.add.one({ data: idAndGroup }))
  ));

  editSubmissionOffline = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.edit.offlineError),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([{ input, info }, userId]) => {

      const courseId = input.courseId
      const form = input.form
      const submissionId = input.submissionId
      const creationDate = info.date
      const activityId = input.activityId

      const filesToConvert: File[] = input.form?.files.toUpload
      const fileHex = 'local_upload_' + submissionId.toString();

      let filesEverUploaded: string[];
      this.store.select(ActivitySubmissionSelectors.byId(input.submissionId)).subscribe((submission) => {
        console.log(input)
        filesEverUploaded = submission.files
      })

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
          downloadUri: `courses/${input.courseId}/activities/${activityId}/submission/files/${encodeURIComponent(file.name)}`,
          sha3Hex: fileHex
        } as FileUploadedSM

        this.store.dispatch(ActivitySubmissionOfflineActions.meta.addFileOfflineSubmission({file, fileSM}))

        return fileSM
      })
      const convertedFilesIds = convertedFiles.map(file => getFileId(file));
      const allFiles: string[] = filesEverUploaded.concat(convertedFilesIds);

      const submissionSM = fromFormToActivitySubmissionSM(form, userId, submissionId, creationDate, allFiles);

      this.store.dispatch(ActivityItemActions.indirectlyUpsert({
        items: [
          {
            activityId: activityId,
            submissionId: submissionId,
            userId: userId,
            evaluationId: undefined
          } as ActivityItemSM
        ]
      }))
      return ActivitySubmissionOfflineActions.meta.editOfflineSubmission({
        idAndGroup: {
          id: submissionId,
          groupId: courseId
        },  
        submission: submissionSM
      })
    })
  ))

  markSubmissionAsUpdatedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.offline.meta.editOfflineSubmission),
    map(({ idAndGroup }) => ActivitySubmissionOfflineActions.updated.add.one({ data: idAndGroup }))
  ));


  markSubmissionFileAsDeletedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.offline.meta.saveSubmissionFilesIdsToDeleteOffline),
    map(({ idAndGroup }) => ActivitySubmissionActions.offline.updated.add.one({ data: idAndGroup }))
  ));

  getMineOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.getMine.offlineError),
    map(({ input }) => ActivitySubmissionActions.offline.requested.groupIds.add.one({ data: input.activityId }))
  ));

  getAllOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.getAll.offlineError),
    map(({ input }) => ActivitySubmissionActions.offline.requested.groupIds.add.one({ data: input.activityId }))
  ));

  loadFilesOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.listFiles.offlineError),
    map(({ input }) => ActivitySubmissionActions.offline.requested.groupIds.add.one({ data: input.activityId }))
  ));

  // ------------------------------------------------
  // SYNC
  // ------------------------------------------------

  // Todo: Coordinate this with other entities
  autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
    filter(isOffline => !isOffline),
    withLatestFrom(this.store.select(ActivitySubmissionOfflineSelectors.nextAction)),
    filter(([_, type]) => type !== OfflineRequestType.None),
    map(_ => ActivitySubmissionActions.offline.sync.syncAll())
  ))


  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.offline.sync.syncAll),
    concatMap(_ => of(
      ActivitySubmissionActions.offline.sync.created.syncAll(),
      ActivitySubmissionActions.offline.sync.requested.syncAll(),
      ActivitySubmissionActions.offline.sync.updated.syncAll(),
      ActivitySubmissionActions.offline.sync.deleted.syncAll(),
    ))
  ));

  // --------------------------------------------------------------
  //  Created

  syncCreatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.offline.sync.created.syncAll),
    concatMap(_ => this.store.select(ActivitySubmissionOfflineSelectors.created.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => ActivitySubmissionActions.offline.sync.created.byId({ input: id }))
      )),
    ))
  ));

  syncCreatedById$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.offline.sync.created.byId),
    concatMap(({ input: { id, groupId } }) => this.store.select(ActivitySubmissionSelectors.byId(id)).pipe(
      take(1),
      map((submission) => {

        let files;
        let activityId: number;
        let userId: number;
        
        this.store.select(ActivitySelectors.current.id).subscribe((id) => activityId = id);
        this.store.select(LoginSelectors.loggedUserId).subscribe((id) => userId = id);

        files = submission?.files.map((file, index) => {
          let fileUploadedSM: FileUploadedSM;
          this.store.select(FileUploadedSelectors.byId(submission.files[index])).subscribe((file) => fileUploadedSM = file)
          return {
            size: fileUploadedSM.byteSize,
            type: fileUploadedSM.mimeType,
            name: fileUploadedSM.fileName
          } as File
        })
        
        // TODO for Uploaded and toDelete
        /*
        let fileuploadedSM: FileUploadedSM[]

        this.store.select(FileUploadedAdvancedSelectors.convert.one(havefilesSM)).pipe(
          map(files => fileuploadedSM = files)
        )
        const uploaded: FileUploadedSM[] = fileuploadedSM.filter(file => file.status.currently == FileState.Uploaded)
        const toDelete: FileUploadedSM[] = fileuploadedSM.filter(file => file.status.currently == FileState.NeedsToBeDeleted)
        */

        let createRequest: Action = ActivitySubmissionActions.create.request({
          input: {
            courseId: groupId,
            form: fromSMtoActivitySubmissionForm(submission, files, [], []),
            activityId: activityId,
            userId: userId
          }
        })

        return [
          ActivitySubmissionActions.basic.remove.one({ data: id }),
          ActivitySubmissionActions.offline.created.remove.one({ data: id }),
          createRequest
        ];
      }),
      concatMap(actions => of(...actions))
    ))
  ));

  syncUpdatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.offline.sync.updated.syncAll),
    concatMap(_ => this.store.select(ActivitySubmissionOfflineSelectors.updated.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => ActivitySubmissionActions.offline.sync.updated.byId({ input: id }))
      )),
    ))
  ));
  
  syncUpdatedById$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.offline.sync.updated.byId),
    concatMap(({ input }) => this.store.select(ActivitySubmissionSelectors.byId(input.id)).pipe(
      take(1),
      map((submission) => {

        console.log(submission)

        let courseId: number;
        this.store.select(CourseSelectors.currentId).subscribe(id => courseId = id);
        
        let userId: number;
        this.store.select(UserSelectors.current).subscribe(user => userId = user.id);

        let activityId: number;
        this.store.select(ActivitySelectors.current.id).subscribe(id => activityId = id);

        let filesToUpload: File[] = submission?.files.filter(file => file.includes('local_upload')).map((file, index) => {
          console.log(file);
          let fileUploadedSM: FileUploadedSM;
          this.store.select(FileUploadedSelectors.byId(file)).subscribe((file) => fileUploadedSM = file)
          console.log(fileUploadedSM)
          return {
            size: fileUploadedSM.byteSize,
            type: fileUploadedSM.mimeType,
            name: fileUploadedSM.fileName
          } as File
        })

        console.log(filesToUpload)

        let submissionFilesToDelete: SubmissionFile[];
        this.store.select(ActivitySubmissionOfflineSelectors.filesChanged.toDelete.all).subscribe(subFiles => submissionFilesToDelete = subFiles)

        let filesToDelete: string[] = submissionFilesToDelete.map(subFile => subFile.file);

        console.log(filesToDelete)

        filesToDelete.forEach((fileName) => {
          this.store.dispatch(ActivitySubmissionActions.deleteFile.request({
            input: {
              fileName: fileName,
              courseId: courseId,
              activityId: activityId,
              submissionId: submission.id,
              fileId: '' // o fileId seria necessário apenas no caso em que foi deletado um arquivo já anexado offline
            }
          }))
        })

        this.store.dispatch(ActivitySubmissionActions.edit.request({
          input: {
            courseId: courseId,
            userId: userId,
            activityId: activityId,
            submissionId: submission.id,
            form: fromSMtoActivitySubmissionForm(submission, filesToUpload, [], [])
          }
        }))

        this.actions$.pipe(
          ofType(ActivitySubmissionActions.edit.success),
          map(({ input }) => ActivitySubmissionActions.listFiles.request({
            input: {
              submissionId: submission.id,
              courseId: courseId,
              activityId: activityId,
              userId: userId
            }
          }))
        ).subscribe()

        return ActivitySubmissionActions.offline.updated.remove.one({ data: submission.id })
          
      })
    )),
  ));

  syncRequestedSyncAll$ = createEffect(() => this.actions$.pipe(
      ofType(ActivitySubmissionActions.offline.sync.requested.syncAll),
      concatMap((_) => this.store.select(ActivitySubmissionOfflineSelectors.requested.groups).pipe(
          take(1),
          concatMap(groups => of(...groups).pipe(
          map(groupId => ActivitySubmissionActions.offline.sync.requested.groupById({ input: { groupId } }))),
          ),
      ))
  ));

  syncRequestedGroupById$ = createEffect(() => this.actions$.pipe(
      ofType(ActivitySubmissionActions.offline.sync.requested.groupById),
      concatMap(({ input }) => this.store.select(LoginSelectors.loggedUserId).pipe(
        take(1),
        map((userId) => {

          let courseId: number;
          this.store.select(CourseSelectors.currentId).subscribe(id => courseId = id);

          let submissionId: number;
          this.store.select(ActivityItemSelectors.byActivityIdAndUserId({ activityId: input.groupId, userId: userId })).subscribe(item => submissionId = item.submissionId)

          if (submissionId) {
            this.store.dispatch(ActivitySubmissionActions.listFiles.request({
              input: {
                  submissionId: submissionId,
                  courseId: courseId,
                  activityId: input.groupId,
                  userId: userId
              }
            }))
          }
          
          return [
              ActivitySubmissionActions.offline.requested.groupIds.remove.one({ data: input.groupId }),
              ActivitySubmissionActions.getAll.request({
              input: {
                  courseId: courseId,
                  activityId: input.groupId
              }
              })
          ]
      }),
      concatMap(actions => of(...actions))
      ))  
  ));

  constructor(private actions$: Actions, private store: Store<AppState>) { }
}
