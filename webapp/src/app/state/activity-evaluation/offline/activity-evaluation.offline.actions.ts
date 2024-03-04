import { createAction, props } from '@ngrx/store';
import { FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { MaterialSM } from 'src/app/models/material.model';
import { ActionTemplates } from '../../shared/template.actions';
import { IdAndGroupId } from '../../shared/template.state';
import { ActivityEvaluationSM } from 'src/app/models/activity-evaluation.model';
import { ActivityEvaluationJson } from 'src/app/models/activity-evaluation';

export const ActivityEvaluationOfflineActions = {
  meta: {
    addOfflineEvaluation: createAction('[ Activity Evaluation / Offline ] Create activity evaluation offline',
      props<{
        evaluation: ActivityEvaluationSM,
        idAndGroup: IdAndGroupId
      }>()),
    editOfflineEvaluation: createAction('[ Activity Evaluation / Offline ] Edit activity evaluation offline',
    props<{
      evaluation: ActivityEvaluationSM,
      idAndGroup: IdAndGroupId
    }>())
  },
  created: ActionTemplates.basicActions<IdAndGroupId>('Activity Evaluation / Offline / Created'),
  requested: {
    groupIds: ActionTemplates.arrayActions<number>('Activity Evaluation / Offline / Requested / GroupIds'),
  },
  updated: ActionTemplates.basicActions<IdAndGroupId>('Activity Evaluation / Offline / Updated / Like'),
  deleted: ActionTemplates.idAndGroup('Activity Evaluation / Offline / Deleted'),

  sync: {
    syncAll: createAction('[ Activity Evaluation / Offline / Sync / All ] Sync all offline changes'),
    created: {
      syncAll: createAction('[ Activity Evaluation / Offline / Sync / Created / All ] Sync All'),
      byId: createAction(
        '[ Activity Evaluation / Offline / Sync / Created / ById ] Sync by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    requested: {
      syncAll: createAction('[ Activity Evaluation / Offline / Sync / Requested / All Requested ] Sync All'),
      groupById: createAction(
        '[ Activity Evaluation / Offline / Sync / Requested / Groups by Id ] Sync a requested group',
        props<{ input: { groupId: number } }>()
      ),
    },
    updated: {
      syncAll: createAction('[ Activity Evaluation / Offline / Sync / Updated / All Updated ] Sync All'),
      byId: createAction(
        '[ Activity Evaluation / Offline / Sync / Updated / By Id ] Sync a updated item',
        props<{ input: IdAndGroupId }>()
      ),
    },
    deleted: {
      syncAll: createAction('[ Activity Evaluation / Offline / Sync / Deleted / All ] Sync all'),
      byId: createAction(
        '[ Activity Evaluation / Offline / Sync / Deleted / ById ] Sync material deleted offline',
        props<{ input: IdAndGroupId }>()
      ),
    }
  }
}
