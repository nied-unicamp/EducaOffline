import { createAction, props } from '@ngrx/store';
import { ActionTemplates } from '../../shared/template.actions';
import { IdAndGroupId } from '../../shared/template.state';
import { MaterialFolderSM } from 'src/app/models/material-folder.model';

export const MaterialFolderOfflineActions = {
  meta: {
    addOfflineFolder: createAction('[ MaterialFolder / Offline ] Save material folder to upload later',
      props<{
        folder: MaterialFolderSM,
        idAndGroup: IdAndGroupId
      }>()),
    editOffline: createAction('[ MaterialFolder / Offline ] Update material folder to upload later',
      props<{
        folder: MaterialFolderSM,
        idAndGroup: IdAndGroupId
      }>())
  },

  created: ActionTemplates.basicActions<IdAndGroupId>('MaterialFolder / Offline / Created'),
  requested: {
    groupIds: ActionTemplates.arrayActions<number>('MaterialFolder / Offline / Requested / GroupIds'),
  },
  updated: ActionTemplates.idAndGroup('MaterialFolder / Offline / Updated'),
  deleted: ActionTemplates.idAndGroup('MaterialFolder / Offline / Deleted'),

  sync: {
    syncAll: createAction('[ MaterialFolder / Offline / Sync / All ] Sync all offline changes'),
    created: {
      syncAll: createAction('[ MaterialFolder / Offline / Sync / Created / All ] Sync All'),
      byId: createAction(
        '[ MaterialFolder / Offline / Sync / Created / ById ] Sync by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    requested: {
      syncAll: createAction('[ MaterialFolder / Offline / Sync / Requested / All Requested ] Sync All'),
      groupById: createAction(
        '[ MaterialFolder / Offline / Sync / Requested / Groups by Id ] Sync a requested group',
        props<{ input: { groupId: number } }>()
      ),
    },
    updated: {
      syncAll: createAction('[ MaterialFolder / Offline / Sync / Updated / All Updated ] Sync All'),
      byId: createAction(
        '[ MaterialFolder / Offline / Sync / Updated / By Id ] Sync a updated item',
        props<{ input: IdAndGroupId }>()
      ),
    },
    deleted: {
      syncAll: createAction('[ MaterialFolder / Offline / Sync / Deleted / All ] Sync all'),
      byId: createAction(
        '[ MaterialFolder / Offline / Sync / Deleted / ById ] Sync folder deleted offline',
        props<{ input: IdAndGroupId }>()
      ),
    }
  }
}
