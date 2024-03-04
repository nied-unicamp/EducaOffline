import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, take, withLatestFrom } from 'rxjs/operators';
import { WallPostSelectors } from 'src/app/state/wall-post/wall-post.selector';
import { LoginSelectors } from '../../login/login.selector';
import { OfflineRequestType } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';
import { AppState } from '../../state';
import { WallPostActions } from '../wall-post.actions';
import { WallPostOfflineSelectors } from './wall-post.offline.selector';
import { UserSelectors } from '../../user/user.selector';
import { WallPostSM } from 'src/app/models/wall-post.model';

@Injectable()
export class WallPostOfflineEffects {

  //IDK
  createPostOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.create.offlineError),
    map(({ input, info }) => {

      const data: WallPostSM = {
        ...input.body, id: info.id,
        createdById: info.me,
        createdDate: info.date,
        lastModifiedById: info.me,
        lastModifiedDate: info.date,
        favorite: false,
        favoriteCounter: 0,
        liked: false,
        likeCounter: 0
      };

      return WallPostActions.offline.meta.addPostOffline({
        wallPost: data,
        idAndGroup: {
          id: info.id,
          groupId: input.courseId
        }
      })
    })
  ));

  createPostWithActivityIdOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.createWithActivityId.offlineError),
    map(({ input, info }) => {

      const data: WallPostSM = {
        ...input.body, id: info.id,
        createdById: info.me,
        createdDate: info.date,
        lastModifiedById: info.me,
        lastModifiedDate: info.date,
        favorite: false,
        favoriteCounter: 0,
        liked: false,
        likeCounter: 0,
        activityId: input.activityId
      };

      return WallPostActions.offline.meta.addPostOffline({
        wallPost: data,
        idAndGroup: {
          id: info.id,
          groupId: input.courseId
        }
      })
    })
  ));

  markPostAsCreatedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.create.offlineError),
    map(({ input, info }) => WallPostActions.offline.created.add.one({
      data: {
        groupId: input.courseId,
        id: info.id
      }
    }))
  ))

  markFetchActivityPostsAsRequestedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.fetchActivityPosts.offlineError),
    map(({ input, info }) => WallPostActions.offline.requested.ids.add.one({
      data: {
        groupId: input.courseId,
        id: info.id
      }
    }))
  ))

  deleteOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.delete.offlineError),
    map(({ input, info }) => WallPostActions.offline.deleted.add({
      data: {
        groupId: input.courseId,
        id: input.id
      }
    }))
  ));

  likeOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.like.offlineError),
    withLatestFrom(this.store.select(WallPostOfflineSelectors.updated.like.state)),
    map(([{ input }, likeState]) => {
      const alreadyLikedOffline = (<number[]>likeState.ids).includes(input.id);

      if (alreadyLikedOffline) {
        return WallPostActions.offline.updated.like.remove({
          data: {
            groupId: input.courseId,
            id: input.id
          }
        })
      }

      return WallPostActions.offline.updated.like.add({
        data: {
          groupId: input.courseId,
          id: input.id
        }
      })
    })
  ));

  pinOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.pin.offlineError),
    withLatestFrom(this.store.select(WallPostOfflineSelectors.updated.pin.state)),
    concatMap(([{ input }, pinState]) => this.store.select(WallPostSelectors.byCourse.id.pinned(input.courseId)).pipe(
      take(1),
      map(fixedPost => {
        return { input, pinState, fixedPost }
      })
    )),
    map(({ input, pinState, fixedPost }) => {
      const addItem = WallPostActions.offline.updated.pin.ids.add({
        data: {
          groupId: input.courseId,
          id: input.id
        }
      })

      const removeItem = WallPostActions.offline.updated.pin.ids.remove({
        data: {
          groupId: input.courseId,
          id: input.id
        }
      })

      const removeFixed = WallPostActions.offline.updated.pin.ids.remove({
        data: {
          groupId: input.courseId,
          id: fixedPost?.id
        }
      })

      const addIndirect = WallPostActions.offline.updated.pin.indirectChanges.add({
        data: {
          groupId: input.courseId,
          id: fixedPost?.id
        }
      })

      const removeIndirect = WallPostActions.offline.updated.pin.indirectChanges.remove({
        data: pinState.indirectChanges.entities[input.courseId]
      })

      const alreadyModified = (<number[]>pinState.ids.ids).includes(input.id)
      const hasRelatedIndirect = (<number[]>pinState.indirectChanges.ids).includes(input.courseId);

      console.log({ hasRelatedIndirect, alreadyModified, input, fixedPost, pinState })

      // If true, the currently pinned post is so "offline" only
      if (hasRelatedIndirect) {
        if (alreadyModified) { // So we will undo it
          return [removeItem, removeIndirect]
        }

        return [removeFixed, addItem]
      }

      if (alreadyModified) {
        return [removeItem]
      }

      if (fixedPost?.id && input.to) {
        return [addIndirect, addItem]
      }

      return [addItem]
    }),
    concatMap(actions => of(...actions))
  ));


  // ------------------------------------------------
  // SYNC
  // ------------------------------------------------

  // Todo: Coordinate this with other entities
  autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
    filter(isOffline => !isOffline),
    withLatestFrom(this.store.select(WallPostOfflineSelectors.nextAction)),
    filter(([_, type]) => type !== OfflineRequestType.None),
    map(_ => WallPostActions.offline.sync.syncAll())
  ))


  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.syncAll),
    concatMap(_ => of(
      WallPostActions.offline.sync.created.syncAll(),
      WallPostActions.offline.sync.requested.syncAll(),
      WallPostActions.offline.sync.updated.syncAll(),
      WallPostActions.offline.sync.deleted.syncAll(),
    ))
  ));

  // --------------------------------------------------------------
  //  Created

  syncCreatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.created.syncAll),
    concatMap(_ => this.store.select(WallPostOfflineSelectors.created.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => WallPostActions.offline.sync.created.byId({ input: id }))
      )),
    ))
  ));

  syncCreatedById$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.created.byId),
    concatMap(({ input: { id, groupId } }) => this.store.select(WallPostSelectors.byId(id)).pipe(
      take(1),
      map((wallPost) => {
        
        if (wallPost.activityId) { return; }

        // check if wall post was created by admin
        if (wallPost.createdById == 1 && (wallPost.text.includes('[CANCELED | n1i2e3d4]') || 
                                          wallPost.text.includes('[GRADES | n1i2e3d4]')   ||  
                                          wallPost.text.includes('[AVERAGE | n1i2e3d4]'))) {
          this.store.dispatch(WallPostActions.api.byCourse.id.createWithCreatedById.request({ input: { courseId: groupId, userId: wallPost.createdById, body: wallPost } }))
        } else {
          this.store.dispatch(WallPostActions.api.byCourse.id.create.request({ input: { courseId: groupId, body: wallPost } }));
        }

        return [
          WallPostActions.basic.remove.one({ data: id }),
          WallPostActions.offline.created.remove.one({ data: id })
        ];
      }),
      concatMap(actions => of(...actions))
    ))
  ));

  // --------------------------------------------------------------
  //  Requested

  syncRequestedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.requested.syncAll),
    concatMap(_ => of(
      WallPostActions.offline.sync.requested.ids(),
      WallPostActions.offline.sync.requested.groups(),
    ))
  ));


  syncRequestedIds$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.requested.ids),
    concatMap((_) => this.store.select(WallPostOfflineSelectors.requested.ids).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        map(id => WallPostActions.offline.sync.requested.byId({ input: id }))),
      ),
    ))
  ));


  syncRequestedById$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.requested.byId),
    map(({ input }) => {
      if (input) {
        return [
          WallPostActions.offline.requested.ids.remove.one({ data: input.id }),
          WallPostActions.api.byCourse.id.fetchActivityPosts.request({
            input: {
              courseId: input.groupId
            }
          })
        ]
      }
    }),
    concatMap(actions => of(...actions))
  ));


  syncRequestedGroups$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.requested.groups),
    concatMap((_) => this.store.select(WallPostOfflineSelectors.requested.groups).pipe(
      take(1),
      concatMap(groups => of(...groups).pipe(
        map(groupId => WallPostActions.offline.sync.requested.groupById({ groupId }))),
      ),
    ))
  ));

  syncRequestedGroupById$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.requested.groupById),
    map(({ groupId }) => [
      WallPostActions.offline.requested.groupIds.remove.one({ data: groupId }),
      WallPostActions.api.byCourse.id.get.all.request({ input: { courseId: groupId } })
    ]),
    concatMap(actions => of(...actions))
  ));

  // --------------------------------------------------------------
  //  Updated

  syncUpdatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.updated.syncAll),
    concatMap(_ => of(
      WallPostActions.offline.sync.updated.like.syncAll(),
      WallPostActions.offline.sync.updated.pin.syncAll(),
    ))
  ));


  syncUpdatedLikeIds$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.updated.like.syncAll),
    concatMap((_) => this.store.select(WallPostOfflineSelectors.updated.like.ids).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        map(id => WallPostActions.offline.sync.updated.like.byId({ input: id }))),
      ),
    ))
  ));


  syncUpdatedLikeById$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.updated.like.byId),
    concatMap(({ input }) => this.store.select(WallPostSelectors.byId(input.id)).pipe(
      take(1),
      map(entity => {
        return {
          idAndGroup: input,
          requestData: {
            courseId: input.groupId,
            id: input.id,
            to: entity.liked
          }
        }
      })
    )),
    map(({ idAndGroup, requestData }) => [
      WallPostActions.offline.updated.like.remove({ data: idAndGroup }),
      WallPostActions.api.byCourse.id.like.request({ input: requestData })
    ]),
    concatMap(actions => of(...actions))
  ));

  syncUpdatedPin$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.updated.pin.syncAll),
    withLatestFrom(this.store.select(WallPostOfflineSelectors.updated.pin.ids.list)),
    concatMap(([_, ids]) => of(...new Set(ids.map(item => item.groupId))).pipe(
      map(courseId => {
        const myIds = ids.filter(id => id.groupId === courseId);
        return WallPostActions.offline.sync.updated.pin.byCourse({ courseId, ids: myIds });
      })
    )),
  ));


  syncUpdatedPinByCourse$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.updated.pin.byCourse),
    concatMap(({ courseId, ids }) => this.store.select(WallPostSelectors.byCourse.id.pinned(courseId)).pipe(
      take(1),
      withLatestFrom(this.store.select(WallPostOfflineSelectors.updated.pin.indirect.state)),
      map(([pinnedPost, indirectState]) => {
        const indirectId = indirectState.entities[courseId]

        return { pinnedPost, indirectId, ids }
      })
    )),
    map(({ ids, pinnedPost, indirectId }) => {
      let item: IdAndGroupId;
      let to: boolean;

      if (ids.length > 1) {
        to = true
        if (ids[1].id === pinnedPost?.id) {
          item = ids[0]
        } else {
          item = ids[1]
        }
      } else {
        item = ids[0];
        to = item.id === pinnedPost?.id
      }

      return { ids, item, to, indirectId }
    }),
    map(({ item, to, ids, indirectId }) => [
      !indirectId ? null : WallPostActions.offline.updated.pin.indirectChanges.remove({ data: indirectId }),
      ...ids.map(id => WallPostActions.offline.updated.pin.ids.remove({ data: id })),
      WallPostActions.api.byCourse.id.pin.request({
        input: {
          courseId: item.groupId,
          id: item.id,
          to
        }
      })
    ]),
    concatMap(actions => of(...actions)),
    filter(action => action !== null)
  ));

  // --------------------------------------------------------------
  //  Deleted

  syncDeletedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.deleted.syncAll),
    concatMap(_ => this.store.select(WallPostOfflineSelectors.deleted.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((input) => WallPostActions.offline.sync.deleted.byId({ input }))
      )),
    ))
  ));

  syncDeletedById$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.offline.sync.deleted.byId),
    map(({ input: { groupId, id } }) => [
      WallPostActions.offline.deleted.remove({ data: { groupId, id } }),
      WallPostActions.api.byCourse.id.delete.request({ input: { courseId: groupId, id } })
    ]),
    concatMap(actions => of(...actions))
  ));

  constructor(private actions$: Actions, private store: Store<AppState>) { }
}
