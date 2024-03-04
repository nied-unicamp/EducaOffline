import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, BehaviorSubject } from 'rxjs';
import { catchError, concatMap, filter, map, tap, withLatestFrom } from 'rxjs/operators';

import { WallCommentJson } from './../../models/wall-comment.model';
import { WallReplyJson } from 'src/app/models/wall-comment.model';
import { fromArray2 } from 'src/app/models';
import { fromJsonToUserSM } from 'src/app/models/user.model';
import { WallApiService } from 'src/app/services/api/wall.api.service';
import { LoginSelectors } from '../login/login.selector';
import { UserActions } from '../user/user.actions';
import { WallCommentActions } from 'src/app/state/wall-comment/wall-comment.actions';
import { WallReplyActions } from 'src/app/state/wall-reply/wall-reply.actions';

@Injectable()
export class WallRepliesEffects{

    loadAll$ = createEffect(() => this.actions$.pipe(
        ofType(WallReplyActions.fetchAll.request),
        concatMap(({ input }) => this.wallApiService.getReplies({
            courseId: input.courseId,
            postId: input.postId,
            commentId: input.commentId
        }).pipe(
          map(wallReplies => WallReplyActions.fetchAll.success({ input, data: wallReplies })),
          catchError((error: any) => of(WallReplyActions.fetchAll.error({ input, error })))
        ))
    ));
    createReply$ = createEffect(() => this.actions$.pipe(
        ofType(WallReplyActions.createReply.request),
        concatMap(({ input }) => this.wallApiService.createReply(input).pipe(
            map(( data:WallReplyJson) => WallReplyActions.createReply.success({ input, data})),
            catchError((error: any) => of(WallReplyActions.createReply.error({ input, error })))
        ))
    ));
    createOfflineError$ = createEffect(() => this.actions$.pipe(
        ofType(WallReplyActions.createReply.error),
        withLatestFrom(this.store.select(LoginSelectors.isOffline)),
        filter(([_, offline]) => offline),
        withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
        map(([[{ input, error }, _], me]) => {
          const date = new Date();
          const info = { id: date.getTime(), date: date.toISOString(), me };
    
          return WallReplyActions.createReply.offlineError({ input, error, info })
        })
    ));
    fetchAll$ = createEffect(() => this.actions$.pipe(
        ofType(WallReplyActions.fetchAll.request),
        concatMap(({ input }) => this.wallApiService.getReplies(input).pipe(
            map(( data: WallReplyJson[]) => WallReplyActions.fetchAll.success({ input, data})),
            catchError((error: any) => of(WallReplyActions.fetchAll.error({ input, error })))
        ))
    ));
    deleteByCommentId$ = createEffect(() => this.actions$.pipe(
        ofType(WallReplyActions.delete.request),
        concatMap(({ input }) => this.wallApiService.deleteReply(input).pipe(
            map(data => WallReplyActions.delete.success({ input, data })),
            catchError((error: any) => of(WallReplyActions.delete.error({ input, error })))
        ))
    ));
    deleteOfflineError$ = createEffect(() => this.actions$.pipe(
        ofType(WallReplyActions.delete.error),
        withLatestFrom(this.store.select(LoginSelectors.isOffline)),
        filter(([_, offline]) => offline),
        map(([{ input, error }, _]) => {
          const date = new Date();
          const info = { date: date.toISOString() };
    
          return WallReplyActions.delete.offlineError({ input, error, info })
        })
    ));
    constructor(private actions$: Actions, private wallApiService: WallApiService, private store: Store) { }
    
}

