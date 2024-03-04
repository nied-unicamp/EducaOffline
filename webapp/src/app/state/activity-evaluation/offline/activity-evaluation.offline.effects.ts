import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { FileState, FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { fromSMToMaterialForm, MaterialSM } from 'src/app/models/material.model';
import { FileApiService } from 'src/app/services/api/file.api.service';
import { MaterialSelectors } from 'src/app/state/material/material.selector';
import { FileUploadedActions } from '../../file-uploaded/file-uploaded.actions';
import { FileUploadedSelectors } from '../../file-uploaded/file-uploaded.selector';
import { getFileId } from '../../file-uploaded/file-uploaded.state';
import { LoginSelectors } from '../../login/login.selector';
import { OfflineRequestType } from '../../shared/offline/offline.state';
import { AppState } from '../../state';
import { ActivityEvaluationActions } from '../activity-evaluation.actions';
import { ActivityEvaluationSM } from 'src/app/models/activity-evaluation.model';
import { ActivityEvaluationOfflineActions } from './activity-evaluation.offline.actions';
import { ActivityEvaluationOfflineSelectors } from './activity-evaluation.offline.selector';
import { ActivityEvaluationSelectors } from '../activity-evaluation.selector';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { ActivityItemSelectors } from '../../activity-item/activity-item.selector';
import { ActivityEvaluationForm } from 'src/app/models/activity-evaluation.model';
import { ActivityItemActions } from '../../activity-item/activity-item.actions';
import { Activity } from 'src/app/models/activity.model';
import { ActivityItemSM } from 'src/app/models/activity-item.model';

@Injectable()
export class ActivityEvaluationOfflineEffects {


  createEvaluationOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.create.offlineError),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([{ input, info }, userId]) => {
      console.log("create.offlineError catched!")
      const activityEvaluationSM = {
        id: info.id,
        comment: input.form.comment,
        score: input.form.score,
        lastModifiedById: userId,
        lastModifiedDate: info.date
      } as ActivityEvaluationSM

      return ActivityEvaluationOfflineActions.meta.addOfflineEvaluation({
        idAndGroup: {
          id: info.id,
          groupId: input.courseId
        },
        evaluation: activityEvaluationSM
      })
    }),
  ));

  markEvaluationAsCreatedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.offline.meta.addOfflineEvaluation),
    map(({ idAndGroup }) => ActivityEvaluationOfflineActions.created.add.one({ data: idAndGroup }))
  ));

  editEvaluationOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.edit.offlineError),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([{ input, info }, userId]) => {
      console.log("edit.offlineError catched!")
      const activityEvaluationSM = {
        id: input.evaluationId,
        comment: input.form.comment,
        score: input.form.score,
        lastModifiedById: userId,
        lastModifiedDate: info.date
      } as ActivityEvaluationSM

      return ActivityEvaluationOfflineActions.meta.editOfflineEvaluation({
        idAndGroup: {
          id: input.evaluationId,
          groupId: input.courseId
        },
        evaluation: activityEvaluationSM
      })
    }),
  ));

  markEvaluationAsEditedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.offline.meta.editOfflineEvaluation),
    map(({ idAndGroup }) => ActivityEvaluationOfflineActions.updated.add.one({ data: idAndGroup }))
  ));

  // ------------------------------------------------
  // ------------------------------------------------
  // SYNC
  // ------------------------------------------------
  // ------------------------------------------------

  autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
    filter(isOffline => !isOffline),
    withLatestFrom(this.store.select(ActivityEvaluationOfflineSelectors.nextAction)),
    filter(([_, type]) => type !== OfflineRequestType.None),
    map(_ => ActivityEvaluationActions.offline.sync.syncAll())
  ))


  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.offline.sync.syncAll),
    tap(() => console.log("sync All catched!")),
    concatMap(_ => of(
      ActivityEvaluationActions.offline.sync.created.syncAll(),
      ActivityEvaluationActions.offline.sync.requested.syncAll(),
      ActivityEvaluationActions.offline.sync.updated.syncAll()
    ))
  ));

  // --------------------------------------------------------------
  //  Created

  syncCreatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.offline.sync.created.syncAll),
    concatMap(_ => this.store.select(ActivityEvaluationOfflineSelectors.created.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => ActivityEvaluationActions.offline.sync.created.byId({ input: id }))
      )),
    ))
  ));

  syncCreatedById$ = createEffect(() => this.actions$.pipe(
    // select id and groupId that was created offline
    ofType(ActivityEvaluationActions.offline.sync.created.byId),
    // select activity evaluation object using id
    concatMap(({ input: { id, groupId } }) => this.store.select(ActivityEvaluationSelectors.byId(id)).pipe(
      take(1),
      map(( evaluation ) => {
        let item: ActivityItemSM;
        this.store.select(ActivityItemSelectors.byEvaluationId(id)).subscribe(i => item = i)
        console.log('Evaluation a ser enviado:', evaluation)
        console.log('item encontrado:', item)
        // make ActivityEvaluationForm object to put on input
        const form = {
          comment: evaluation.comment,
          score: evaluation.score
        } as ActivityEvaluationForm

        // dispatch the action to create activity evaluation online
        let createAction: Action = ActivityEvaluationActions.create.request({
          input: {
            courseId: groupId,
            activityId: item?.activityId,
            userId: item.userId,
            form: form
          }
        })
        // remove ids offline
        return [
          ActivityEvaluationActions.basic.remove.one({ data: id }),
          ActivityEvaluationActions.offline.created.remove.one({ data: id }),
          createAction
        ];
      }),
      concatMap(actions => of(...actions))
    ))
  ));

  // --------------------------------------------------------------
  //  Updated

  syncUpdatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.offline.sync.updated.syncAll),
    concatMap((_) => this.store.select(ActivityEvaluationOfflineSelectors.updated.ids).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        map(id => ActivityEvaluationActions.offline.sync.updated.byId({ input: id }))),
      ),
    ))
  ));

  // sync evaluation by id
  syncUpdatedById$ = createEffect(() => this.actions$.pipe(
    ofType(ActivityEvaluationActions.offline.sync.updated.byId),
    // select activity evaluation by id
    concatMap(({ input }) => this.store.select(ActivityEvaluationSelectors.byId(input.id)).pipe(
      take(1),
      // select activity item by evaluation id
      concatMap((evaluation) => this.store.select(ActivityItemSelectors.byEvaluationId(evaluation.id)).pipe(
        map((item) => {

          // make ActivityEvaluationForm object to put on input
          const form = {
            comment: evaluation.comment,
            score: evaluation.score
          } as ActivityEvaluationForm

          return [
            // dispatch action to edit activity evaluation online
            ActivityEvaluationActions.edit.request({
              input: {
                courseId: input.groupId,
                activityId: item.activityId,
                userId: item.userId,
                evaluationId: item.evaluationId,
                form: form
              }
            }),
            // remove from updated offline
            ActivityEvaluationActions.offline.updated.remove.one({ data: input.id })
          ]
        }),
        concatMap(actions => of(...actions))
      ))
    ))
  ));


  constructor(private actions$: Actions, private store: Store<AppState>, private fileApi: FileApiService) { }
}
