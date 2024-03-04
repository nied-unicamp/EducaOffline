import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { fromArray2 } from 'src/app/models';
import { fromJsonToUserSM } from 'src/app/models/user.model';
import { WallApiService } from 'src/app/services/api/wall.api.service';
import { CourseSelectors } from '../course/course.selector';
import { LoginSelectors } from '../login/login.selector';
import { UserActions } from '../user/user.actions';
import { WallPostActions } from './wall-post.actions';
import { UserSelectors } from '../user/user.selector';

@Injectable()
export class WallPostEffects {

  // Create

  // VVVVVVVVVV SUCCESS
  createByCourseId$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.create.request),
    concatMap(({ input }) => this.wallApiService.createPost(input.body, input.courseId).pipe(
      map(data => WallPostActions.api.byCourse.id.create.success({ input, data })),
      catchError((error: any) => of(WallPostActions.api.byCourse.id.create.error({ input, error })))
    ))
  ));

  // createByCourseIdWithActivityId$ = createEffect(() => this.actions$.pipe(
  //   ofType(WallPostActions.api.byCourse.id.createWithActivityId.request),
  //   concatMap(({ input }) => this.wallApiService.createPostWithActivityId(input.body, input.activityId, input.courseId).pipe(
  //     map(data => WallPostActions.api.byCourse.id.create.success({ input, data })),
  //     catchError((error: any) => of(WallPostActions.api.byCourse.id.createWithActivityId.error({ input, error })))
  //   ))
  // ));

  createByCourseIdWithCreatedById$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.createWithCreatedById.request),
    concatMap(({ input }) => this.wallApiService.createPostWithCreatedById(input.body, input.userId, input.courseId).pipe(
      map(data => WallPostActions.api.byCourse.id.create.success({ input, data })),
      catchError((error: any) => of(WallPostActions.api.byCourse.id.createWithCreatedById.error({ input, error })))
    ))
  ));

  createPostOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.create.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),

    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      const date = new Date();

      const info = { id: date.getTime(), date: date.toISOString(), me };

      return WallPostActions.api.byCourse.id.create.offlineError({ input, error, info })
    })
  ));

  createPostWithCreatedByIdOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.createWithCreatedById.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => {
      const date = new Date();
      const me = input.userId
      const info = { id: date.getTime(), date: date.toISOString(), me };

      return WallPostActions.api.byCourse.id.create.offlineError({ input, error, info })
    })
  ));

  createPostWithActivityIdOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.createWithActivityId.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      const date = new Date();

      const info = { id: date.getTime(), date: date.toISOString(), me };

      return WallPostActions.api.byCourse.id.createWithActivityId.offlineError({ input, error, info })
    })
  ));

  // Get

  // VVVVVVVVVV SUCCESS
  fetchAllByCourseId$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.get.all.request),
    concatMap(({ input }) => this.wallApiService.getPosts(input.courseId).pipe(
      map(posts => WallPostActions.api.byCourse.id.get.all.success({ input, data: posts })),
      catchError((error: any) => of(WallPostActions.api.byCourse.id.get.all.error({ input, error })))
    ))
  ));

  fetchActivityPostsByCourseId$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.fetchActivityPosts.request),
    concatMap(({ input }) => this.wallApiService.fetchActivityPosts(input.courseId).pipe(
      map(data => WallPostActions.api.byCourse.id.fetchActivityPosts.success({ input, data })),
      catchError((error: any) => of(WallPostActions.api.byCourse.id.fetchActivityPosts.error({ input, error })))
    ))
  ));

  fetchActivityPostsByCourseIdError$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.fetchActivityPosts.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => {
      const date = new Date();
      // put a fixed id to requests do not accumulate
      const info = { id: 0 };

      return WallPostActions.api.byCourse.id.fetchActivityPosts.offlineError({ input, error, info })
    })
  ))

  upsertUsersGetAllByCourseIdSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.get.all.success),
    map(({ data }) => [...new Set(data.map(post => post.createdBy))]),
    map(fromArray2(fromJsonToUserSM)),
    map((users) => UserActions.basic.upsert.many({ data: users }))
  ));

  // VVVVVVVVVV SUCCESS
  fetchOneByCourseId$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.get.one.request),
    concatMap(({ input }) => this.wallApiService.getPost(input).pipe(
      map(posts => WallPostActions.api.byCourse.id.get.one.success({ input, data: posts })),
      catchError((error: any) => of(WallPostActions.api.byCourse.id.get.one.error({ input, error })))
    ))
  ));

  upsertUserGetOneByCourseIdSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.get.one.success),
    map(({ data }) => data.createdBy),
    map(fromJsonToUserSM),
    map((data) => UserActions.basic.upsert.one({ data }))
  ));


  // Update

  toggleLike$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.like.request),
    concatMap(({ input }) => this.wallApiService.changeLike(input).pipe(
      map(data => WallPostActions.api.byCourse.id.like.success({ input, data })),
      catchError((error: any) => of(WallPostActions.api.byCourse.id.like.error({ input, error })))
    )),
  ));

  toggleLikeOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.like.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => {
      const date = new Date();
      const info = { date: date.toISOString() };

      return WallPostActions.api.byCourse.id.like.offlineError({ input, error, info })
    })
  ))

  toggleFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.favorite.request),
    concatMap(({ input }) => this.wallApiService.changeFavorite(input).pipe(
      map(data => WallPostActions.api.byCourse.id.favorite.success({ input, data })),
      catchError((error: any) => of(WallPostActions.api.byCourse.id.favorite.error({ input, error })))
    )),
  ));


  togglePin$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.pin.request),
    concatMap(({ input }) => this.wallApiService.changePin(input).pipe(
      map(_ => WallPostActions.api.byCourse.id.pin.success({ input, data: null })),
      catchError((error: any) => of(WallPostActions.api.byCourse.id.pin.error({ input, error })))
    )),
  ));

  togglePinOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.pin.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => {
      const date = new Date();
      const info = { date: date.toISOString() };

      return WallPostActions.api.byCourse.id.pin.offlineError({ input, error, info })
    })
  ))

  // Delete

  // VVVVVVVVVV SUCCESS
  deleteByCourseId$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.delete.request),
    concatMap(({ input }) => this.wallApiService.deletePost(input).pipe(
      map(data => WallPostActions.api.byCourse.id.delete.success({ input, data })),
      catchError((error: any) => of(WallPostActions.api.byCourse.id.delete.error({ input, error })))
    ))
  ));


  deleteOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.id.delete.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => {
      const date = new Date();
      const info = { date: date.toISOString() };

      return WallPostActions.api.byCourse.id.delete.offlineError({ input, error, info })
    })
  ));

  /////////////////////////
  // By current course
  /////////////////////////

  // Create
  createAllByCurrentCourse$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.current.create.request),
    withLatestFrom(this.store.select(CourseSelectors.currentId)),
    map(([action, courseId]) => {
      return {
        ...action.input,
        courseId: Number(courseId)
      }
    }),
    map(input => WallPostActions.api.byCourse.id.create.request({ input })),
  ));

  // Get

  getAllByCurrentCourse$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.current.get.all.request),
    withLatestFrom(this.store.select(CourseSelectors.currentId)),
    map(([_, courseId]) => Number(courseId)),
    map(courseId => WallPostActions.api.byCourse.id.get.all.request({ input: { courseId } })),
  ));

  getOneByCurrentCourse$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.current.get.one.request),
    withLatestFrom(this.store.select(CourseSelectors.currentId)),
    map(([action, courseId]) => {
      return {
        ...action.input,
        courseId: Number(courseId)
      }
    }),
    map(input => WallPostActions.api.byCourse.id.get.one.request({ input })),
  ));

  // Update

  toggleLikeByCurrentCourse$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.current.like.request),
    withLatestFrom(this.store.select(CourseSelectors.currentId)),
    map(([action, courseId]) => {
      return {
        ...action.input,
        courseId: Number(courseId)
      }
    }),
    map(input => WallPostActions.api.byCourse.id.like.request({ input })),
  ));

  togglePinByCurrentCourse$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.current.pin.request),
    withLatestFrom(this.store.select(CourseSelectors.currentId)),
    map(([action, courseId]) => {
      return {
        ...action.input,
        courseId: Number(courseId)
      }
    }),
    map(input => WallPostActions.api.byCourse.id.pin.request({ input })),
  ));

  toggleFavoriteByCurrentCourse$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.current.favorite.request),
    withLatestFrom(this.store.select(CourseSelectors.currentId)),
    map(([action, courseId]) => {
      return {
        ...action.input,
        courseId: Number(courseId)
      }
    }),
    map(input => WallPostActions.api.byCourse.id.favorite.request({ input })),
  ));

  // Delete

  deleteByCurrentCourse$ = createEffect(() => this.actions$.pipe(
    ofType(WallPostActions.api.byCourse.current.delete.request),
    withLatestFrom(this.store.select(CourseSelectors.currentId)),
    map(([action, courseId]) => {
      return {
        ...action.input,
        courseId: Number(courseId)
      }
    }),
    map(input => WallPostActions.api.byCourse.id.delete.request({ input })),
  ));


  constructor(private actions$: Actions, private wallApiService: WallApiService, private store: Store) { }
}
