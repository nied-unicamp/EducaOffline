import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, take, withLatestFrom } from 'rxjs/operators';
import { CourseSM } from 'src/app/models/course.model';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { AppState } from '../../state';
import { CourseActions } from '../course.actions';
import { CourseOfflineSelectors } from './course.offline.selector';

@Injectable()
export class CourseOfflineEffects {

  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.syncAll),
    concatMap(_ => of(
      CourseActions.offline.sync.created.syncAll(),
      CourseActions.offline.sync.requested.syncAll(),
      CourseActions.offline.sync.updated.syncAll(),
      CourseActions.offline.sync.deleted.syncAll(),
    ))
  ));

  syncCreatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.created.syncAll),
    concatMap(_ => this.store.select(CourseOfflineSelectors.created.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => CourseActions.offline.sync.created.byId({ input: { id } }))
      )),
    ))
  ));

  syncCreatedById$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.created.byId),
    concatMap(({ input }) => this.store.select(CourseSelectors.byId(input.id)).pipe(
      take(1),
      map((course) => {
        return [
          CourseActions.basic.remove.one({ data: input.id }),
          CourseActions.offline.created.remove.one({ data: input.id }),
          CourseActions.api.create.request({ input: { body: course } })
        ];
      }),
      concatMap(actions => of(...actions))
    ))
  ));

  syncRequestedAllIds$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.requested.ids),
    concatMap((_) => this.store.select(CourseOfflineSelectors.requested.ids).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        map(id => CourseActions.offline.sync.requested.byId({ input: { id } }))),
      ),
    ))
  ));

  syncRequestedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.requested.syncAll),
    concatMap(_ => of(
      CourseActions.offline.sync.requested.all(),
      CourseActions.offline.sync.requested.ids()
    ))
  ));


  syncRequestedAll$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.requested.all),
    concatMap(_ => this.store.select(CourseOfflineSelectors.requested.requestedAll).pipe(
      take(1),
      filter((requested) => requested),
      concatMap(__ => of(
        CourseActions.offline.requested.all.remove(),
        CourseActions.api.fetchAll.request()
      ))
    ))
  ));

  syncRequestedById$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.requested.byId),
    map(({ input }) => [
      CourseActions.offline.requested.ids.remove.one({ data: input.id }),
      CourseActions.api.fetchOne.request({ input })
    ]),
    concatMap(actions => of(...actions))
  ));

  syncUpdatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.updated.syncAll),
    concatMap(_ => this.store.select(CourseOfflineSelectors.updated.ids).pipe(
      take(1),
      concatMap((ids: number[]) => of(...ids).pipe(
        map((id) => CourseActions.offline.sync.updated.byId({ input: { id } }))
      )),
    ))
  ));

  syncUpdatedById$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.updated.byId),
    concatMap(({ input }) => this.store.select(CourseSelectors.byId(input.id)).pipe(
      take(1),
      withLatestFrom(
        this.store.select(CourseOfflineSelectors.updated.byId(input.id))
      ),
      map(([newCourse, oldCourse]) => [
        CourseActions.offline.updated.remove.one({ data: input.id }),
        CourseActions.basic.update.one({ data: { id: input.id, changes: oldCourse } }),
        CourseActions.api.update.request({ input: { id: input.id, body: newCourse } })
      ]),
      concatMap(actions => of(...actions))
    ))
  ));

  syncDeletedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.deleted.syncAll),
    concatMap(_ => this.store.select(CourseOfflineSelectors.deleted.ids).pipe(
      take(1),
      concatMap((ids: number[]) => of(...ids).pipe(
        map((id) => CourseActions.offline.sync.deleted.byId({ input: { id } }))
      )),
    ))
  ));

  syncDeletedById$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.offline.sync.deleted.byId),
    concatMap(({ input }) => this.store.select(CourseOfflineSelectors.deleted.byId(input.id)).pipe(
      take(1),
      map((courseToDelete: CourseSM) => [
        CourseActions.offline.deleted.remove.one({ data: input.id }),
        CourseActions.basic.add.one({ data: { ...courseToDelete } }),
        CourseActions.api.delete.request({ input })
      ]),
      concatMap(actions => of(...actions))
    ))
  ));

  constructor(private actions$: Actions, private store: Store<AppState>) { }
}
