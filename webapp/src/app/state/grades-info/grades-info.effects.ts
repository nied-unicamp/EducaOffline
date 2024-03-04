import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { ActivitiesApiService } from 'src/app/services/api/activities.api.service';
import { GradesApiService } from 'src/app/services/api/grades.api.service';
import { GradesInfoActions } from './grades-info.actions';

@Injectable()
export class GradesInfoEffects {

  getSummary$ = createEffect(() => this.actions$.pipe(
    ofType(GradesInfoActions.getSummary.request),
    concatMap(({ input }) => this.gradesApiService.getSummary(input.courseId).pipe(
      map(info => GradesInfoActions.getSummary.success({ input, data: info })),
      catchError((error: any) => of(GradesInfoActions.getSummary.error({ input, error })))
    ))
  ));

  constructor(private actions$: Actions, private gradesApiService: GradesApiService, private store$: Store) { }
}
