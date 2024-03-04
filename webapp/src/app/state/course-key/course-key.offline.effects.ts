import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { flatMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../state';
import { CourseKeyActions } from './course-key.actions';
import { CourseKeyOfflineSelectors } from './course-key.offline.selector';

@Injectable()
export class CourseKeyOfflineEffects {

  syncRequestedAll$ = createEffect(() => this.actions$.pipe(
    ofType(CourseKeyActions.offline.sync.requested.syncAll),
    withLatestFrom(
      this.store.select(CourseKeyOfflineSelectors.requested.keys),
      this.store.select(CourseKeyOfflineSelectors.requested.courseIds),
    ),
    flatMap(([_, keys, courses]) => {
      return [
        ...courses?.map(courseId => CourseKeyActions.offline.sync.requested.byCourseId({ input: { courseId } })),
        ...keys?.map(key => CourseKeyActions.offline.sync.requested.byKey({ input: { key } })),
      ]
    }),
  ));

  syncRequestedByKey$ = createEffect(() => this.actions$.pipe(
    ofType(CourseKeyActions.offline.sync.requested.byKey),
    flatMap(({ input }) => [
      CourseKeyActions.offline.requested.keys.remove.one({ data: input.key }),
      CourseKeyActions.api.fetchByKey.request({ input })
    ]),
  ));

  syncRequestedByCourseId$ = createEffect(() => this.actions$.pipe(
    ofType(CourseKeyActions.offline.sync.requested.byCourseId),
    flatMap(({ input }) => [
      CourseKeyActions.offline.requested.courseIds.remove.one({ data: input.courseId }),
      CourseKeyActions.api.fetchByCourseId.request({ input })
    ]),
  ));


  constructor(private actions$: Actions, private store: Store<AppState>) { }
}
