import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, take, withLatestFrom } from 'rxjs/operators';
import { FileApiService } from 'src/app/services/api/file.api.service';
import { LoginSelectors } from '../../login/login.selector';
import { MaterialOfflineActions } from '../../material/offline/material.offline.actions';
import { OfflineRequestType } from '../../shared/offline/offline.state';
import { FileUploadedActions } from '../file-uploaded.actions';
import { getFileId } from '../file-uploaded.state';
import { FileUploadedOfflineSelectors } from './file-uploaded.offline.selector';
import { ActivityOfflineActions } from '../../activity/offline/activity.offline.actions';
import { ActivitySubmissionActions } from '../../activity-submission/activity-submission.actions';
import { ActivitySubmissionOfflineActions } from '../../activity-submission/offline/activity-submission.offline.actions';

@Injectable()
export class FileUploadedOfflineEffects {




  //IDK
  // createOffline$ = createEffect(() => this.actions$.pipe(
  //   ofType(FileUploadedActions.api.download.offlineError),
  //   map(({ input, info }) => FileUploadedActions.offline.created.add.one({
  //     data: {
  //       groupId: input.courseId,
  //       id: info.id
  //     }
  //   }))
  // ));

  // deleteOffline$ = createEffect(() => this.actions$.pipe(
  //   ofType(FileUploadedActions.api.delete.offlineError),
  //   map(({ input, info }) => FileUploadedActions.offline.deleted.add({
  //     data: {
  //       groupId: input.courseId,
  //       id: input.id
  //     }
  //   }))
  // ));



  saveToUploadLater$ = createEffect(() => this.actions$.pipe(
    ofType(
      MaterialOfflineActions.meta.addOfflineMaterial,
      ActivityOfflineActions.meta.addFileOfflineActivity,
      ActivitySubmissionOfflineActions.meta.addFileOfflineSubmission
    ),
    concatMap(({ file, fileSM }) => this.fileApi.setFile(getFileId(fileSM), file))
  ), { dispatch: false });


  // ------------------------------------------------
  // SYNC
  // ------------------------------------------------

  // Todo: Coordinate this with other entities
  autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
    filter(isOffline => !isOffline),
    withLatestFrom(this.store.select(FileUploadedOfflineSelectors.nextAction)),
    filter(([_, type]) => type !== OfflineRequestType.None),
    map(_ => FileUploadedActions.offline.sync.syncAll())
  ))


  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.offline.sync.syncAll),
    concatMap(_ => of(
      FileUploadedActions.offline.sync.created.syncAll(),
      FileUploadedActions.offline.sync.requested.syncAll(),
      FileUploadedActions.offline.sync.updated.syncAll(),
      FileUploadedActions.offline.sync.deleted.syncAll(),
    ))
  ));

  // --------------------------------------------------------------
  //  Created

  syncCreatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.offline.sync.created.syncAll),
    concatMap(_ => this.store.select(FileUploadedOfflineSelectors.created.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => FileUploadedActions.offline.sync.created.byId({ input: id }))
      )),
    ))
  ));

  // syncCreatedById$ = createEffect(() => this.actions$.pipe(
  //   ofType(FileUploadedActions.offline.sync.created.byId),
  //   concatMap(({ input: { id, groupId } }) => this.store.select(FileUploadedSelectors.byId(id)).pipe(
  //     take(1),
  //     map((fileUploaded) => {
  //       return [
  //         FileUploadedActions.basic.remove.one({ data: id }),
  //         FileUploadedActions.offline.created.remove.one({ data: id }),
  //         FileUploadedActions.api.download.request({ input: { courseId: groupId, body: fileUploaded } })
  //       ];
  //     }),
  //     concatMap(actions => of(...actions))
  //   ))
  // ));

  // --------------------------------------------------------------
  //  Requested

  syncRequestedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.offline.sync.requested.syncAll),
    concatMap(_ => of(
      FileUploadedActions.offline.sync.requested.ids(),
      FileUploadedActions.offline.sync.requested.groups(),
    ))
  ));


  syncRequestedIds$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.offline.sync.requested.ids),
    concatMap((_) => this.store.select(FileUploadedOfflineSelectors.requested.ids).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        map(id => FileUploadedActions.offline.sync.requested.byId({ input: id }))),
      ),
    ))
  ));


  // syncRequestedById$ = createEffect(() => this.actions$.pipe(
  //   ofType(FileUploadedActions.offline.sync.requested.byId),
  //   map(({ input }) => [
  //     FileUploadedActions.offline.requested.ids.remove.one({ data: input.id }),
  //     FileUploadedActions.api.byCourse.id.get.one.request({
  //       input: {
  //         id: input.id,
  //         courseId: input.groupId
  //       }
  //     })
  //   ]),
  //   concatMap(actions => of(...actions))
  // ));


  syncRequestedGroups$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.offline.sync.requested.groups),
    concatMap((_) => this.store.select(FileUploadedOfflineSelectors.requested.groups).pipe(
      take(1),
      concatMap(groups => of(...groups).pipe(
        map(groupId => FileUploadedActions.offline.sync.requested.groupById({ groupId }))),
      ),
    ))
  ));

  // syncRequestedGroupById$ = createEffect(() => this.actions$.pipe(
  //   ofType(FileUploadedActions.offline.sync.requested.groupById),
  //   map(({ groupId }) => [
  //     FileUploadedActions.offline.requested.groupIds.remove.one({ data: groupId }),
  //     FileUploadedActions.api.byCourse.id.get.all.request({ input: { courseId: groupId } })
  //   ]),
  //   concatMap(actions => of(...actions))
  // ));


  // --------------------------------------------------------------
  //  Deleted

  syncDeletedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(FileUploadedActions.offline.sync.deleted.syncAll),
    concatMap(_ => this.store.select(FileUploadedOfflineSelectors.deleted.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((input) => FileUploadedActions.offline.sync.deleted.byId({ input }))
      )),
    ))
  ));

  // syncDeletedById$ = createEffect(() => this.actions$.pipe(
  //   ofType(FileUploadedActions.offline.sync.deleted.byId),
  //   map(({ input: { groupId, id } }) => [
  //     FileUploadedActions.offline.deleted.remove({ data: { groupId, id } }),
  //     FileUploadedActions.api.byCourse.id.delete.request({ input: { courseId: groupId, id } })
  //   ]),
  //   concatMap(actions => of(...actions))
  // ));

  constructor(private actions$: Actions, private store: Store, private fileApi: FileApiService) { }
}
