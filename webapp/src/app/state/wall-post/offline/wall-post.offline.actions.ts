import { createAction, props } from '@ngrx/store';
import { ActionTemplates } from '../../shared/template.actions';
import { IdAndGroupId } from '../../shared/template.state';
import { WallPost, WallPostSM } from 'src/app/models/wall-post.model';

export const WallPostOfflineActions = {

  meta: {
    addPostOffline: createAction('[ WallPost / Offline ] Save post to upload later',
    props<{
      wallPost: WallPostSM,
      idAndGroup: IdAndGroupId
    }>())
  },

  created: ActionTemplates.basicActions<IdAndGroupId>('WallPost / Offline / Created'),
  requested: {
    ids: ActionTemplates.basicActions<IdAndGroupId>('WallPost / Offline / Requested / Ids'),
    groupIds: ActionTemplates.arrayActions<number>('WallPost / Offline / Requested / GroupIds'),
  },
  updated: {
    like: ActionTemplates.idAndGroup('WallPost / Offline / Updated / Like'),
    pin: {
      ids: ActionTemplates.idAndGroup('WallPost / Offline / Updated / Pin / Id'),
      indirectChanges: ActionTemplates.idAndGroup('WallPost / Offline / Updated / Pin / Id / Indirect')
    }
  },
  deleted: ActionTemplates.idAndGroup('WallPost / Offline / Deleted'),


  sync: {
    syncAll: createAction('[ WallPost / Offline / Sync / All ] Sync all offline changes'),
    created: {
      syncAll: createAction('[ WallPost / Offline / Sync / Created / All ] Sync All'),
      byId: createAction(
        '[ WallPost / Offline / Sync / Created / ById ] Sync by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    requested: {
      syncAll: createAction('[ WallPost / Offline / Sync / Requested / All Requested ] Sync All'),
      groups: createAction('[ WallPost / Offline / Sync / Requested / Groups ] Sync all groups'),
      groupById: createAction(
        '[ WallPost / Offline / Sync / Requested / Groups by Id ] Sync a requested group',
        props<{ groupId: number }>()
      ),
      ids: createAction('[ WallPost / Offline / Sync / Requested / Ids ] Get list of ids'),
      byId: createAction(
        '[ WallPost / Offline / Sync / Requested / ById ] Sync requested wallPost by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    updated: {
      syncAll: createAction('[ WallPost / Offline / Sync / Updated / All ] Sync all'),
      like: {
        syncAll: createAction('[ WallPost / Offline / Sync / Updated / Like] Sync likes'),
        byId: createAction(
          '[ WallPost / Offline / Sync / Updated / Like / ById ] Sync wallPost like offline',
          props<{ input: IdAndGroupId }>()
        ),
      },
      pin: {
        syncAll: createAction('[ WallPost / Offline / Sync / Updated / Pin] Sync pins'),
        byCourse: createAction(
          '[ WallPost / Offline / Sync / Updated / Pin / ByCourse ] Sync wallPost pin offline',
          props<{ courseId: number, ids: IdAndGroupId[] }>()
        ),
      }
    },
    deleted: {
      syncAll: createAction('[ WallPost / Offline / Sync / Deleted / All ] Sync all'),
      byId: createAction(
        '[ WallPost / Offline / Sync / Deleted / ById ] Sync wallPost deleted offline',
        props<{ input: IdAndGroupId }>()
      ),
    }
  }
}
