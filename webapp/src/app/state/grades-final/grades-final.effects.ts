import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { ActivityItemSM } from 'src/app/models/activity-item.model';
import { GradesInfoSM } from 'src/app/models/grades-info.model';
import { GradesApiService } from 'src/app/services/api/grades.api.service';
import { ActivityEvaluationActions } from '../activity-evaluation/activity-evaluation.actions';
import { ActivityItemActions } from '../activity-item/activity-item.actions';
import { ActivitySubmissionActions } from '../activity-submission/activity-submission.actions';
import { ActivityActions } from '../activity/activity.actions';
import { GradesInfoActions } from '../grades-info/grades-info.actions';
import { GradesFinalActions } from './grades-final.actions';

@Injectable()
export class GradesFinalEffects {

  loadAll$ = createEffect(() => this.actions$.pipe(
    ofType(GradesFinalActions.fetchAll.request),
    concatMap(({ input }) => this.gradesApiService.getFinalGrades(input.courseId).pipe(
      map(finals => GradesFinalActions.fetchAll.success({ input, data: finals })),
      catchError((error: any) => of(GradesFinalActions.fetchAll.error({ input, error })))
    ))
  ));

  loadMine$ = createEffect(() => this.actions$.pipe(
    ofType(GradesFinalActions.fetch.request),
    concatMap(({ input }) => this.gradesApiService.getFinalGrade(input.courseId).pipe(
      map(finals => GradesFinalActions.fetch.success({ input, data: finals })),
      catchError((error: any) => of(GradesFinalActions.fetch.error({ input, error })))
    ))
  ));

  getOverview$ = createEffect(() => this.actions$.pipe(
    ofType(GradesFinalActions.getOverview.request),
    concatMap(({ input }) => this.gradesApiService.getOverview(input.courseId).pipe(
      map(finals => [
        GradesFinalActions.getOverview.success({ input, data: finals }),
        ActivityItemActions.indirectlyUpsert({
          items: finals.grades.map(item => ({
            activityId: item.activityId,
            courseId: input.courseId,
            userId: item.userId,
            submissionId: item?.activitySubmission?.id,
            evaluationId: item?.activityEvaluation?.id
          } as ActivityItemSM))
        }),
        ActivityActions.fetchAll.success({
          input: {
            courseId: input.courseId,
          },
          data: finals.activities
        }),
        ActivitySubmissionActions.basic.upsert.many({
          data: finals?.grades?.map(grade => ({
            ...grade?.activitySubmission,
            lastModifiedById: grade?.activitySubmission?.lastModifiedBy?.id,
            createdById: grade?.activitySubmission?.createdBy?.id,
            files: undefined,
          })).filter(item => item?.id) ?? []
        }),
        ActivityEvaluationActions.basic.upsert.many({
          data: finals?.grades?.map(grade => ({
            ...grade?.activityEvaluation,
            lastModifiedById: grade?.activityEvaluation?.lastModifiedBy?.id,
          })).filter(item => item?.id) ?? []
        }),
        GradesInfoActions.basic.upsert.many({
          data: finals.averageGrades.map(average => ({ ...average })) as GradesInfoSM[]
        })
      ]),
      catchError((error: any) => of([
        GradesFinalActions.getOverview.error({ input, error })
      ]))
    )),
    concatMap(actions => of(...actions))
  ));

  getUserOverview$ = createEffect(() => this.actions$.pipe(
    ofType(GradesFinalActions.getUserOverview.request),
    concatMap(({ input }) => this.gradesApiService.getUserOverview(input).pipe(
      map(finals => GradesFinalActions.getUserOverview.success({ input, data: finals })),
      catchError((error: any) => of(GradesFinalActions.getUserOverview.error({ input, error })))
    ))
  ));

  constructor(private actions$: Actions, private gradesApiService: GradesApiService, private store$: Store) { }
}
