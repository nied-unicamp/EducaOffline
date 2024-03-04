import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, take, withLatestFrom } from 'rxjs/operators';
import { WallCommentSelectors } from 'src/app/state/wall-comment/wall-comment.selector';
import { LoginSelectors } from '../../login/login.selector';
import { OfflineRequestType } from '../../shared/offline/offline.state';
import { AppState } from '../../state';
import { WallPostSelectors } from '../../wall-post/wall-post.selector';
import { WallCommentActions } from '../wall-comment.actions';
import { WallCommentOfflineSelectors } from './wall-comment.offline.selector';
import { WallCommentSM } from 'src/app/models/wall-comment.model';

@Injectable()
export class WallCommentOfflineEffects {

  //IDK
  createOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.create.offlineError),
    map(({ input, info }) => {
      const data: WallCommentSM = {
        ...input.body, id: info.id as number,
        liked: false,
        likeCounter: 0,
        teacher: false,
        createdById: info.me,
        createdDate: info.date,
        lastModifiedById: info.me,
        lastModifiedDate: info.date,
      };
      return [
        WallCommentActions.offline.created.add.one({
          data: {
            groupId: input.postId,
            id: info.id
          }
        }),
        WallCommentActions.offline.meta.addOfflineComment({
          comment: data,
          idAndGroup: {
            groupId: input.postId,
            id: info.id
          },
        })
      ]      
    } ),
    concatMap(actions => of(...actions))
  ));



  deleteOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.delete.offlineError),
    map(({ input }) => WallCommentActions.offline.deleted.add({
      data: {
        groupId: input.postId,
        id: input.commentId
      }
    }))
  ));

  likeOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.like.offlineError),
    withLatestFrom(this.store.select(WallCommentOfflineSelectors.updated.like.state)),
    map(([{ input }, likeState]) => {
      const alreadyLikedOffline = (<number[]>likeState.ids).includes(input.commentId);

      if (alreadyLikedOffline) {
        return WallCommentActions.offline.updated.like.remove({
          data: {
            groupId: input.postId,
            id: input.commentId
          }
        })
      }

      return WallCommentActions.offline.updated.like.add({
        data: {
          groupId: input.postId,
          id: input.commentId
        }
      })
    })
  ));

  


  // ------------------------------------------------
  // ------------------------------------------------
  // SYNC
  // ------------------------------------------------
  // ------------------------------------------------

  // Todo: Coordinate this with other entities
  autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
    filter(isOffline => !isOffline),
    withLatestFrom(this.store.select(WallCommentOfflineSelectors.nextAction)),
    filter(([_, type]) => type !== OfflineRequestType.None),
    map(_ => WallCommentActions.offline.sync.syncAll())
  ))


  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.offline.sync.syncAll),
    concatMap(_ => of(
      WallCommentActions.offline.sync.created.syncAll(),
      WallCommentActions.offline.sync.requested.syncAll(),
      WallCommentActions.offline.sync.updated.syncAll(),
      WallCommentActions.offline.sync.deleted.syncAll(),
    ))
  ));

  // --------------------------------------------------------------
  //  Created

  syncCreatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.offline.sync.created.syncAll),
    concatMap(_ => this.store.select(WallCommentOfflineSelectors.created.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => WallCommentActions.offline.sync.created.byId({ input: id }))
      )),
    ))
  ));

  syncCreatedById$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.offline.sync.created.byId),
    concatMap(({ input: { id, groupId } }) => this.store.select(WallCommentSelectors.byId(id)).pipe(
      take(1),
      withLatestFrom(this.store.select(WallPostSelectors.group.getGroupIdFromItem(groupId))),
      map(([wallComment, postGroup]) => {
        return [
          WallCommentActions.basic.remove.one({ data: id }),
          WallCommentActions.offline.created.remove.one({ data: id }),
          WallCommentActions.create.request({
            input: {
              commentId: wallComment.id,
              courseId: postGroup.groupId,
              postId: postGroup.id,
              body: wallComment
            }
          })
        ];
      }),
      concatMap(actions => of(...actions))
    ))
  ));

  // --------------------------------------------------------------
  //  Requested

  syncRequestedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.offline.sync.requested.syncAll),
    concatMap((_) => this.store.select(WallCommentOfflineSelectors.requested.groups).pipe(
      take(1),
      concatMap(groups => of(...groups).pipe(
        map(groupId => WallCommentActions.offline.sync.requested.groupById({ groupId }))),
      ),
    ))
  ));

  syncRequestedGroupById$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.offline.sync.requested.groupById),
    concatMap(({ groupId }) => this.store.select(WallPostSelectors.group.getGroupIdFromItem(groupId)).pipe(
      take(1)
    )),
    map((parentGroup) => [
      WallCommentActions.offline.requested.groupIds.remove.one({ data: parentGroup.id }),
      WallCommentActions.fetchAll.request({
        input: {
          courseId: parentGroup.groupId,
          postId: parentGroup.id
        }
      })
    ]),
    concatMap(actions => of(...actions))
  ));

  // --------------------------------------------------------------
  //  Updated

  syncUpdatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.offline.sync.updated.syncAll),
    concatMap((_) => this.store.select(WallCommentOfflineSelectors.updated.like.ids).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        map(id => WallCommentActions.offline.sync.updated.like({ input: id }))),
      ),
    ))
  ));


  syncUpdatedLikeById$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.offline.sync.updated.like),
    concatMap(({ input }) => this.store.select(WallPostSelectors.group.getGroupIdFromItem(input.groupId)).pipe(
      take(1),
      map(parentGroup => {
        return { input, courseId: parentGroup.groupId }
      })
    )),
    concatMap(({ input, courseId }) => this.store.select(WallCommentSelectors.byId(input.id)).pipe(
      take(1),
      map(entity => {
        return {
          idAndGroup: input,
          requestData: {
            courseId,
            postId: input.groupId,
            commentId: input.id,
            to: entity.liked
          }
        }
      })
    )),
    map(({ idAndGroup, requestData }) => [
      WallCommentActions.offline.updated.like.remove({ data: idAndGroup }),
      WallCommentActions.like.request({ input: requestData })
    ]),
    concatMap(actions => of(...actions))
  ));


  // --------------------------------------------------------------
  //  Deleted

  syncDeletedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.offline.sync.deleted.syncAll),
    concatMap(_ => this.store.select(WallCommentOfflineSelectors.deleted.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((input) => WallCommentActions.offline.sync.deleted.byId({ input }))
      )),
    ))
  ));

  syncDeletedById$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.offline.sync.deleted.byId),
    concatMap(({ input }) => this.store.select(WallPostSelectors.group.getGroupIdFromItem(input.groupId)).pipe(
      take(1),
      map((parentGroup) => [
        WallCommentActions.offline.deleted.remove({ data: input }),
        WallCommentActions.delete.request({
          input: {
            commentId: input.id,
            courseId: parentGroup.groupId,
            postId: parentGroup.id
          }
        })
      ]),
      concatMap(actions => of(...actions))
    ))
  ));

  constructor(private actions$: Actions, private store: Store<AppState>) { }
}
