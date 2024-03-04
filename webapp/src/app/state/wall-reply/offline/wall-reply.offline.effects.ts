import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, take, withLatestFrom } from 'rxjs/operators';

import { WallReplySelectors } from 'src/app/state/wall-reply/wall-reply.selector';
import { LoginSelectors } from '../../login/login.selector';
import { OfflineRequestType } from '../../shared/offline/offline.state';
import { AppState } from '../../state';
import { WallPostSelectors } from '../../wall-post/wall-post.selector';
import { WallReplyActions } from '../wall-reply.actions';
import { WallReplyOfflineSelectors } from './wall-reply.offline.selector';
import { WallReplySM, fromSMtoReplyForm } from 'src/app/models/wall-comment.model';
 @Injectable()
export class WallReplyOfflineEffects {
   
  createOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallReplyActions.createReply.offlineError),
    map(({ input, info }) => {
        const data: WallReplySM = {
            ...input.body, id: info.id as number,
            liked: false,
            likeCounter: 0,
            teacher: false,
            createdById: info.me,
            createdDate: info.date,
            lastModifiedById: info.me,
            lastModifiedDate: info.date,
            parentCommentId: input.commentId
        };
        return WallReplyActions.offline.meta.addOfflineReply({
                reply: data,
                idAndGroup: {
                    groupId: input.postId,
                    id: info.id
                },
            })
    }),
  ));
 
 
 
 
 markReplyAsCreatedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallReplyActions.offline.meta.addOfflineReply),
    map(({idAndGroup}) => WallReplyActions.offline.created.add.one({data: idAndGroup})
    )
  ))
 

  deleteOffline$ = createEffect(() => this.actions$.pipe(
    ofType(WallReplyActions.delete.offlineError),
    map(({ input }) => [
      WallReplyActions.basic.remove.one({data: input.replyId}),
      WallReplyActions.offline.deleted.add({
      data: {
        groupId: input.postId,
        id: input.replyId
      }
      })
    ]),
  concatMap((actions) => of(...actions))
  ));

  // ------------------------------------------------
  // ------------------------------------------------
  // SYNC
  // ------------------------------------------------
  // ------------------------------------------------

  // Todo: Coordinate this with other entities
  autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
    filter(isOffline => !isOffline),
    withLatestFrom(this.store.select(WallReplyOfflineSelectors.nextAction)),
    filter(([_, type]) => type !== OfflineRequestType.None),
    map(_ => WallReplyActions.offline.sync.syncAll())
  ))

  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallReplyActions.offline.sync.syncAll),
    concatMap(_ => of(
      WallReplyActions.offline.sync.created.syncAll(),
      WallReplyActions.offline.sync.requested.syncAll(),
      WallReplyActions.offline.sync.updated.syncAll(),
      WallReplyActions.offline.sync.deleted.syncAll(),
    ))
  ));

// --------------------------------------------------------------
//  Created

  syncCreatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallReplyActions.offline.sync.created.syncAll),
    concatMap(_ => this.store.select(WallReplyOfflineSelectors.created.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => WallReplyActions.offline.sync.created.byId({ input: id }))
      )),
    ))
  ));

  syncCreatedById$ = createEffect(() => this.actions$.pipe(
    ofType(WallReplyActions.offline.sync.created.byId),
    concatMap(({ input: { id, groupId } }) => this.store.select(WallReplySelectors.byId(id)).pipe(
      take(1),
      withLatestFrom(this.store.select(WallPostSelectors.group.getGroupIdFromItem(groupId))),
      map(([wallReply, postGroup]) => {
        const wallReplyForm = fromSMtoReplyForm(wallReply);
        
        return [
          WallReplyActions.basic.remove.one({ data: id }),
          
          WallReplyActions.offline.created.remove.one({ data: id }),
          WallReplyActions.createReply.request({
            input: {
              commentId: wallReply.parentCommentId,
              courseId: postGroup.groupId,
              postId: postGroup.id,
              body: wallReplyForm
            }
          })
        ];  
      }),
      concatMap(actions => of(...actions))
    ))
  ));


// --------------------------------------------------------------
//  Deleted

  syncDeletedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallReplyActions.offline.sync.deleted.syncAll),
    concatMap(_ => this.store.select(WallReplyOfflineSelectors.deleted.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((input) => WallReplyActions.offline.sync.deleted.byId({ input }))
      )),
    ))
  ));

    syncDeletedById$ = createEffect(() => this.actions$.pipe(
    ofType(WallReplyActions.offline.sync.deleted.byId),
    concatMap(({ input }) => this.store.select(WallPostSelectors.group.getGroupIdFromItem(input.groupId)).pipe(
      take(1),
      map((parentGroup) => [
        WallReplyActions.offline.deleted.remove({ data: input }),
        WallReplyActions.delete.request({
          input: {
           replyId: input.id,
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
