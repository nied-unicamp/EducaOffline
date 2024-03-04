import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { fromArray2 } from 'src/app/models';
import { fromJsonToUserSM } from 'src/app/models/user.model';
import { WallApiService } from 'src/app/services/api/wall.api.service';
import { LoginSelectors } from '../login/login.selector';
import { UserActions } from '../user/user.actions';
import { WallCommentActions } from './wall-comment.actions';

@Injectable()
export class WallCommentsEffects {

  loadAll$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.fetchAll.request),
    concatMap(({ input }) => this.wallApiService.getWallComments({
      courseId: input.courseId,
      id: input.postId
    }).pipe(
      map(wallComments => WallCommentActions.fetchAll.success({ input, data: wallComments })),
      catchError((error: any) => of(WallCommentActions.fetchAll.error({ input, error })))
    ))
  ));

  upsertUsersFromLoadAllSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.fetchAll.success),
    filter(({ data }) => data.length > 0),
    map(({ data }) => [...new Set(data.map(comment => comment.createdBy))]),
    map(fromArray2(fromJsonToUserSM)),
    map(users => UserActions.basic.upsert.many({ data: users }))
  ));


  create$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.create.request),
    concatMap(({ input }) => this.wallApiService.createComment(input).pipe(
      map(data => WallCommentActions.create.success({ input, data })),
      catchError((error: any) => of(WallCommentActions.create.error({ input, error })))
    ))
  ));

  createOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.create.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      const date = new Date();
      const info = { id: date.getTime(), date: date.toISOString(), me };

      return WallCommentActions.create.offlineError({ input, error, info })
    })
  ));

  // VVVVVVVVVV SUCCESS
  deleteByCourseId$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.delete.request),
    concatMap(({ input }) => this.wallApiService.deleteComment(input).pipe(
      map(data => WallCommentActions.delete.success({ input, data })),
      catchError((error: any) => of(WallCommentActions.delete.error({ input, error })))
    ))
  ));


  deleteOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.delete.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => {
      const date = new Date();
      const info = { date: date.toISOString() };

      return WallCommentActions.delete.offlineError({ input, error, info })
    })
  ));

  toggleLike$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.like.request),
    concatMap(({ input }) => this.wallApiService.changeCommentLike(input).pipe(
      map(data => WallCommentActions.like.success({ input, data })),
      catchError((error: any) => of(WallCommentActions.like.error({ input, error })))
    )),
  ));

  toggleLikeOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(WallCommentActions.like.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => {
      const date = new Date();
      const info = { date: date.toISOString() };

      return WallCommentActions.like.offlineError({ input, error, info })
    })
  ))


  constructor(private actions$: Actions, private wallApiService: WallApiService, private store: Store) { }
}
