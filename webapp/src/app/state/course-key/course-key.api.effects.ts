import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap, map } from 'rxjs/operators';
import { CourseKeyApiService } from 'src/app/services/api/course-key.api.service';
import { ApiErrors, getErrorType } from 'src/app/services/interceptors/error.interceptor';
import { CourseActions } from '../course/course.actions';
import { CourseKeyActions } from './course-key.actions';

@Injectable()
export class CourseKeyApiEffects {

  /*************************** Fetch by Key *************************/
  fetchByKeyRequest$ = createEffect(() => this.actions$.pipe(
    ofType(CourseKeyActions.api.fetchByKey.request),
    concatMap(({ input }) => this.courseKeysApiService.findCourseByKey(input.key).pipe(
      map(course => CourseKeyActions.api.fetchByKey.success({ input, data: course })),
      catchError(
        (error: HttpErrorResponse) => {
          const errorType = getErrorType(error);

          switch (errorType) {
            case ApiErrors.Offline:
              return of(CourseKeyActions.offline.requested.keys.add.one({ data: input.key }));
            default:
              return of(CourseKeyActions.api.fetchByKey.error({ input, error: { message: error.message, errorType } }));
          }
        },
      ))
    )), { dispatch: false }
  );

  fetchByKeySuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CourseKeyActions.api.fetchByKey.success),
    flatMap(({ input, data }) => [
      CourseActions.basic.upsert.one({ data }),
      CourseKeyActions.basic.upsert.one({ data: { key: input.key, courseId: data.id } })
    ])
  ));


  /*************************** Fetch by courseId *************************/
  fetchByCourseIdRequest$ = createEffect(() => this.actions$.pipe(
    ofType(CourseKeyActions.api.fetchByCourseId.request),
    concatMap(({ input }) => this.courseKeysApiService.getCourseKey(input.courseId).pipe(
      map(data => CourseKeyActions.api.fetchByCourseId.success({ input, data })),
      catchError(
        (error: HttpErrorResponse) => {
          const errorType = getErrorType(error);

          switch (errorType) {
            case ApiErrors.Offline:
              return of(CourseKeyActions.offline.requested.courseIds.add.one({ data: input.courseId }));
            default:
              return of(CourseKeyActions.api.fetchByCourseId.error({ input, error: { message: error.message, errorType } }));
          }
        },
      ))
    )), { dispatch: false }
  );

  fetchByCourseIdSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CourseKeyActions.api.fetchByCourseId.success),
    flatMap(({ input, data }) => [
      CourseKeyActions.basic.upsert.one({ data: { ...data, courseId: input.courseId } })
    ])
  ));

  constructor(private actions$: Actions, private courseKeysApiService: CourseKeyApiService) { }
}
