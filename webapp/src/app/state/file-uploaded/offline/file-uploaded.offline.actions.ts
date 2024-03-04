import { createAction, props } from '@ngrx/store';
import { ActionTemplates } from '../../shared/template.actions';
import { IdStringAndGroupId } from '../../shared/template.state';

export const FileUploadedOfflineActions = {

  created: ActionTemplates.basicActions<IdStringAndGroupId>('FileUploaded / Offline / Created'),
  requested: {
    ids: ActionTemplates.basicActions<IdStringAndGroupId>('FileUploaded / Offline / Requested / Ids'),
    groupIds: ActionTemplates.arrayActions<number>('FileUploaded / Offline / Requested / GroupIds'),
  },
  updated: {
    like: ActionTemplates.idStringAndGroup('FileUploaded / Offline / Updated / Like'),
    pin: {
      ids: ActionTemplates.idStringAndGroup('FileUploaded / Offline / Updated / Pin / Id'),
      indirectChanges: ActionTemplates.idStringAndGroup('FileUploaded / Offline / Updated / Pin / Id / Indirect')
    }
  },
  deleted: ActionTemplates.idStringAndGroup('FileUploaded / Offline / Deleted'),


  sync: {
    syncAll: createAction('[ FileUploaded / Offline / Sync / All ] Sync all offline changes'),
    created: {
      syncAll: createAction('[ FileUploaded / Offline / Sync / Created / All ] Sync All'),
      byId: createAction(
        '[ FileUploaded / Offline / Sync / Created / ById ] Sync by id',
        props<{ input: IdStringAndGroupId }>()
      ),
    },
    requested: {
      syncAll: createAction('[ FileUploaded / Offline / Sync / Requested / All Requested ] Sync All'),
      groups: createAction('[ FileUploaded / Offline / Sync / Requested / Groups ] Sync all groups'),
      groupById: createAction(
        '[ FileUploaded / Offline / Sync / Requested / Groups by Id ] Sync a requested group',
        props<{ groupId: number }>()
      ),
      ids: createAction('[ FileUploaded / Offline / Sync / Requested / Ids ] Get list of ids'),
      byId: createAction(
        '[ FileUploaded / Offline / Sync / Requested / ById ] Sync requested fileUploaded by id',
        props<{ input: IdStringAndGroupId }>()
      ),
    },
    updated: {
      syncAll: createAction('[ FileUploaded / Offline / Sync / Updated / All ] Sync all'),
      like: {
        syncAll: createAction('[ FileUploaded / Offline / Sync / Updated / Like] Sync likes'),
        byId: createAction(
          '[ FileUploaded / Offline / Sync / Updated / Like / ById ] Sync fileUploaded like offline',
          props<{ input: IdStringAndGroupId }>()
        ),
      },
      pin: {
        syncAll: createAction('[ FileUploaded / Offline / Sync / Updated / Pin] Sync pins'),
        byCourse: createAction(
          '[ FileUploaded / Offline / Sync / Updated / Pin / ByCourse ] Sync fileUploaded pin offline',
          props<{ courseId: number, ids: IdStringAndGroupId[] }>()
        ),
      }
    },
    deleted: {
      syncAll: createAction('[ FileUploaded / Offline / Sync / Deleted / All ] Sync all'),
      byId: createAction(
        '[ FileUploaded / Offline / Sync / Deleted / ById ] Sync fileUploaded deleted offline',
        props<{ input: IdStringAndGroupId }>()
      ),
    }
  }
}
