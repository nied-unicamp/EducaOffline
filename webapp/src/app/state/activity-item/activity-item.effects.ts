import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { catchError, concatMap, filter, map, take, withLatestFrom } from 'rxjs/operators';
import { ActivitiesApiService } from 'src/app/services/api/activities.api.service';
import { ActivityEvaluationActions } from '../activity-evaluation/activity-evaluation.actions';
import { ActivitySubmissionActions } from '../activity-submission/activity-submission.actions';
import { ActivityItemActions } from './activity-item.actions';
import { ActivityItemSelectors } from './activity-item.selector';
import { LoginSelectors } from '../login/login.selector';

@Injectable()
export class ActivityItemEffects {

  load$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityItemActions.fetchAll.request),
    concatMap(({ input }) => this.activitiesApiService.getActivityItems(input).pipe(
      map(items => ActivityItemActions.fetchAll.success({ input, data: items })),
      catchError((error: any) => of(ActivityItemActions.fetchAll.error({ input, error })))
    ))
  ));

  loadError$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityItemActions.fetchAll.error),
    withLatestFrom(this.store$.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store$.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => ActivityItemActions.fetchAll.offlineError({ input, error, info: {} }))
  ))

  upsertMySubmission$ = createEffect(() => this.actions$.pipe(
    ofType(ActivitySubmissionActions.create.success, ActivitySubmissionActions.edit.success),
    map(({ input, data }) => ActivityItemActions.indirectlyUpsert({
      items: [{
        activityId: input.activityId,
        evaluationId: null,
        submissionId: data.id,
        userId: data.lastModifiedBy.id
      }]
    }))
  ));

  upsertEvaluation$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.get.success),
    concatMap(({ input, data }) => this.store$.select(ActivityItemSelectors.byActivityIdAndSubmissionId({
      activityId: input.activityId,
      submissionId: input.submissionId
    })).pipe(
      take(1),
      map(item => {
        if (!item) {
          throwError(new Error(`Please get the submission ${input.submissionId} before the evaluation`))
        }
        return ({ input, data, item })
      })
    )),
    map(({ input, data, item }) => !data.id
      ? createAction('[ ActivityEvaluation ] No Evaluation to upsert')
      : ActivityItemActions.indirectlyUpsert({
        items: [{ ...item, evaluationId: data.id }]
      }))
  ));


  constructor(private actions$: Actions, private activitiesApiService: ActivitiesApiService, private store$: Store) { }
}
