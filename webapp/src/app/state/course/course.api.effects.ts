import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';
import { CourseSM } from 'src/app/models/course.model';
import { CoursesApiService } from 'src/app/services/api/courses.api.service';
import { ApiErrors, getErrorType } from 'src/app/services/interceptors/error.interceptor';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { AppState } from '../state';
import { CourseActions } from './course.actions';

@Injectable()
export class CourseApiEffects {

  /*************************** Delete Course *************************/
  deleteRequest$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.api.delete.request),
    concatMap((action) => this.coursesApiService.deleteCourse(action.input.id).pipe(
      map(course => CourseActions.api.delete.success({ input: action.input, data: course })),
      catchError((error: HttpErrorResponse) => {
        const errorType = getErrorType(error);

        switch (errorType) {
          case ApiErrors.Offline:
            return this.store.select(CourseSelectors.byId(action.input.id)).pipe(
              take(1),
              map((course) => {
                return [
                  CourseActions.offline.deleted.add.one({ data: course }),
                  CourseActions.basic.remove.one({ data: action.input.id })
                ];
              }),
              concatMap(actions => of(...actions))
            );
          default:
            return of(CourseActions.api.delete.error({ input: { id: action.input.id }, error: { errorType, message: error.message } }));
        }
      })
    ))
  ));

  deleteSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.api.delete.success),
    map(({ input }) => CourseActions.basic.remove.one({ data: input.id })),
  ));


  /*************************** Create Course *************************/
  createRequest$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.api.create.request),
    concatMap(({ input }) => this.coursesApiService.createCourse(input.body).pipe(
      map(course => CourseActions.api.create.success({ input, data: course })),
      catchError(
        (error: HttpErrorResponse) => {
          const errorType = getErrorType(error);

          switch (errorType) {
            case ApiErrors.Offline:
              const newId: number = (new Date()).getTime();
              return of(
                CourseActions.basic.add.one({ data: { ...input.body, id: newId } }),
                CourseActions.offline.created.add.one({ data: newId })
              );
            default:
              return of(CourseActions.api.create.error({ input, error: { message: error.message, errorType } }));
          }
        },
      )
    ))
  ));

  createSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.api.create.success),
    map(({ data }) => CourseActions.basic.add.one({ data }))
  ));


  /*************************** Update Course *************************/
  updateRequest$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.api.update.request),
    concatMap(({ input }) => this.coursesApiService.updateCourse(input.id, input.body).pipe(
      map((course: CourseSM) => CourseActions.api.update.success({ input, data: course })),
      catchError(
        (error: HttpErrorResponse) => {
          const errorType = getErrorType(error);

          switch (errorType) {
            case ApiErrors.Offline:
              return this.store.select(CourseSelectors.byId(input.id)).pipe(
                take(1),

                map((oldCourse) => {
                  return [
                    CourseActions.offline.updated.add.one({ data: oldCourse }),
                    CourseActions.basic.update.one({ data: { id: input.id, changes: input.body } })
                  ];
                }),
                concatMap(actions => of(...actions))
              );
            default:
              return of(CourseActions.api.update.error({ input, error: { message: error.error.errorMessage, errorType } }));
          }
        },
      )
    ))
  ));

  updateSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.api.update.success),
    map(({ data }) => CourseActions.basic.upsert.one({ data }))
  ));

  /*************************** Fetch one Course *************************/
  fetchOneRequest$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.api.fetchOne.request),
    concatMap(({ input }) => this.coursesApiService.getCourse(input.id).pipe(
      map(course => CourseActions.api.fetchOne.success({ input, data: course })),
      catchError(
        (error: HttpErrorResponse) => {
          const errorType = getErrorType(error);

          switch (errorType) {
            case ApiErrors.Offline:
              return of(CourseActions.offline.requested.ids.add.one({ data: input.id }));
            default:
              return of(CourseActions.api.fetchOne.error({ input, error: { message: error.message, errorType } }));
          }
        },
      ))
    ))
  );


  fetchOneSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.api.fetchOne.success),
    map(({ data }) => CourseActions.basic.upsert.one({ data }))
  ));


  /*************************** Fetch all Course *************************/
  fetchAllRequest$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.api.fetchAll.request),
    concatMap((_) => {
      return this.coursesApiService.getCourses().pipe(
        map(courses => CourseActions.api.fetchAll.success({ data: courses })),
        catchError(
          (error: HttpErrorResponse) => {
            const errorType = getErrorType(error);

            switch (errorType) {
              case ApiErrors.Offline:
                return of(CourseActions.offline.requested.all.add());
              default:
                return of(CourseActions.api.fetchAll.error({ error: { message: error.message, errorType } }));
            }
          },
        )
      );
    })
  ));

  fetchAllSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.api.fetchAll.success),
    map(({ data }) => CourseActions.basic.upsert.many({ data }))
  ));

  constructor(private actions$: Actions, private store: Store<AppState>, private coursesApiService: CoursesApiService) { }
}
