import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, createAction } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { catchError, concatMap, filter, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { ActivitiesApiService } from 'src/app/services/api/activities.api.service';
import { ActivityEvaluationActions } from './activity-evaluation.actions';
import { ActivityItemActions } from '../activity-item/activity-item.actions';
import { fromJsonToActivityEvaluationSM } from 'src/app/models/activity-evaluation.model';
import { ActivityItemSelectors } from '../activity-item/activity-item.selector';
import { ActivityItemSM } from 'src/app/models/activity-item.model';
import { ActivitySubmissionSelectors } from '../activity-submission/activity-submission.selector';
import { LoginSelectors } from '../login/login.selector';

@Injectable()
export class ActivityEvaluationEffects {

  get$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.get.request),
    concatMap(({ input }) => this.activitiesApiService.getEvaluation(input).pipe(
      map(evaluation => ActivityEvaluationActions.get.success({ input, data: evaluation })),
      catchError((error: any) => of(ActivityEvaluationActions.get.error({ input, error })))
    ))
  ));


  create$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.create.request),
    concatMap(({ input }) => this.activitiesApiService.createEvaluation(input).pipe(
      map(evaluation => ActivityEvaluationActions.create.success({ input, data: evaluation })),
      catchError((error: any) => of(ActivityEvaluationActions.create.error({ input, error })))
    ))
  ));

  createEvaluationOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.create.error),
    withLatestFrom(this.store$.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store$.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      const date = new Date();
      const info = { id: date.getTime(), date: date.toISOString(), me };

      return ActivityEvaluationActions.create.offlineError({ input, error, info })
    })
  ));

// update the evaluation id of activityItem when activity is evaluated (online)
upsertEvaluation$ = createEffect(() => this.actions$.pipe(
  ofType(ActivityEvaluationActions.create.success),
  concatMap(({ input, data }) => this.store$.select(ActivityItemSelectors.byActivityIdAndUserId({
    activityId: input.activityId,
    userId: input.userId
  })).pipe(
    take(1),
    // if activityItem hasn't a evaluation id, set a evaluation id with online id (from db)
    map((item) => {
      if (!item) {
        item = {
          activityId: input.activityId,
          userId: input.userId,
          submissionId: undefined,
          evaluationId: data.id
        }
      }
      console.log(item)
      return ActivityItemActions.indirectlyUpsert({
          items: [{ ...item, evaluationId: data.id }]
        })
    })
  )),
  
));

// update the evaluation id of activityItem when activity is evaluated (offline)
upsertEvaluationOffline$ = createEffect(() => this.actions$.pipe(
  ofType(ActivityEvaluationActions.create.offlineError),
  concatMap(({ input, info }) => this.store$.select(ActivityItemSelectors.byActivityIdAndUserId({
    activityId: input.activityId,
    userId: input.userId
  })).pipe(
    take(1),
    // if activityItem hasn't a evaluation id, set a evaluation id with online id (from db)
    map((item) => {
      if (!item) {
        item = {
          activityId: input.activityId,
          userId: input.userId,
          submissionId: undefined,
          evaluationId: info.id
        }
      }
      console.log(item)
      return ActivityItemActions.indirectlyUpsert({
          items: [{ ...item, evaluationId: info.id }]
        })
    })
  )),
));

  edit$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.edit.request),
    concatMap(({ input }) => this.activitiesApiService.editEvaluation(input).pipe(
      map(evaluation => ActivityEvaluationActions.edit.success({ input, data: evaluation })),
      catchError((error: any) => of(ActivityEvaluationActions.edit.error({ input, error })))
    ))
  ));

  editEvaluationOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.edit.error),
    withLatestFrom(this.store$.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store$.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      const date = new Date();
      const info = { date: date.toISOString(), me };

      return ActivityEvaluationActions.edit.offlineError({ input, error, info })
    })
  ));

  constructor(private actions$: Actions, private activitiesApiService: ActivitiesApiService, private store$: Store) { }
}
