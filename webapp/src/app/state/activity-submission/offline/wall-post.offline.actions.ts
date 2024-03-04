import { createAction, props } from '@ngrx/store';
import { ActionTemplates } from '../../shared/template.actions';
import { IdAndGroupId } from '../../shared/template.state';

export const ActivitySubmissionOfflineActions = {
  created: ActionTemplates.basicActions<IdAndGroupId>('ActivitySubmission / Offline / Created'),
  requested: {
    ids: ActionTemplates.basicActions<IdAndGroupId>('ActivitySubmission / Offline / Requested / Ids'),
    groupIds: ActionTemplates.arrayActions<number>('ActivitySubmission / Offline / Requested / GroupIds'),
  },
  updated: {
    like: ActionTemplates.idAndGroup('ActivitySubmission / Offline / Updated / Like'),
    pin: {
      ids: ActionTemplates.idAndGroup('ActivitySubmission / Offline / Updated / Pin / Id'),
      indirectChanges: ActionTemplates.idAndGroup('ActivitySubmission / Offline / Updated / Pin / Id / Indirect')
    }
  },
  deleted: ActionTemplates.idAndGroup('ActivitySubmission / Offline / Deleted'),


  sync: {
    syncAll: createAction('[ ActivitySubmission / Offline / Sync / All ] Sync all offline changes'),
    created: {
      syncAll: createAction('[ ActivitySubmission / Offline / Sync / Created / All ] Sync All'),
      byId: createAction(
        '[ ActivitySubmission / Offline / Sync / Created / ById ] Sync by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    requested: {
      syncAll: createAction('[ ActivitySubmission / Offline / Sync / Requested / All Requested ] Sync All'),
      groups: createAction('[ ActivitySubmission / Offline / Sync / Requested / Groups ] Sync all groups'),
      groupById: createAction(
        '[ ActivitySubmission / Offline / Sync / Requested / Groups by Id ] Sync a requested group',
        props<{ groupId: number }>()
      ),
      ids: createAction('[ ActivitySubmission / Offline / Sync / Requested / Ids ] Get list of ids'),
      byId: createAction(
        '[ ActivitySubmission / Offline / Sync / Requested / ById ] Sync requested activitySubmission by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    updated: {
      syncAll: createAction('[ ActivitySubmission / Offline / Sync / Updated / All ] Sync all'),
      like: {
        syncAll: createAction('[ ActivitySubmission / Offline / Sync / Updated / Like] Sync likes'),
        byId: createAction(
          '[ ActivitySubmission / Offline / Sync / Updated / Like / ById ] Sync activitySubmission like offline',
          props<{ input: IdAndGroupId }>()
        ),
      },
      pin: {
        syncAll: createAction('[ ActivitySubmission / Offline / Sync / Updated / Pin] Sync pins'),
        byCourse: createAction(
          '[ ActivitySubmission / Offline / Sync / Updated / Pin / ByCourse ] Sync activitySubmission pin offline',
          props<{ courseId: number, ids: IdAndGroupId[] }>()
        ),
      }
    },
    deleted: {
      syncAll: createAction('[ ActivitySubmission / Offline / Sync / Deleted / All ] Sync all'),
      byId: createAction(
        '[ ActivitySubmission / Offline / Sync / Deleted / ById ] Sync activitySubmission deleted offline',
        props<{ input: IdAndGroupId }>()
      ),
    }
  }
}
