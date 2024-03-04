import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { GradesApiService } from 'src/app/services/api/grades.api.service';
import { GradesConfigActions } from './grades-config.actions';
import { GradesFinalActions } from '../grades-final/grades-final.actions';
import { ActivityActions } from '../activity/activity.actions';

@Injectable()
export class GradesConfigEffects {

  get$ = createEffect(() => this.actions$.pipe(
    ofType(GradesConfigActions.get.request),
    concatMap(({ input }) => this.gradesApiService.getConfig(input.courseId).pipe(
      map(config => GradesConfigActions.get.success({ input, data: config })),
      catchError((error: any) => of(GradesConfigActions.get.error({ input, error })))
    ))
  ));


  editWeights$ = createEffect(() => this.actions$.pipe(
    ofType(GradesConfigActions.editWeights.request),
    concatMap(({ input }) => this.gradesApiService.editWeights(input).pipe(
      map(config => GradesConfigActions.editWeights.success({ input, data: config })),
      catchError((error: any) => of(GradesConfigActions.editWeights.error({ input, error })))
    ))
  ));


  useArithmeticMean$ = createEffect(() => this.actions$.pipe(
    ofType(GradesConfigActions.useArithmeticMean.request),
    concatMap(({ input }) => this.gradesApiService.useArithmeticMean(input.courseId).pipe(
      map(config => GradesConfigActions.useArithmeticMean.success({ input, data: config })),
      catchError((error: any) => of(GradesConfigActions.useArithmeticMean.error({ input, error })))
    ))
  ));

  fetchNewAvarages$ = createEffect(() => this.actions$.pipe(
    ofType(GradesConfigActions.editWeights.success, GradesConfigActions.useArithmeticMean.success),
    map(({input}) => GradesFinalActions.fetchAll.request({ input })),
  ));

  updateWeights$ = createEffect(() => this.actions$.pipe(
    ofType(GradesConfigActions.editWeights.success),
    map(({input}) => ActivityActions.updateWeights({ weights: input.form.weights }))
  ));

  constructor(private actions$: Actions, private gradesApiService: GradesApiService, private store$: Store) { }
}
