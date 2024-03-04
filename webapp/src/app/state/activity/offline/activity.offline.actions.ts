import { createAction, props } from '@ngrx/store';
import { FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { ActivitySM, FilesToDelete } from 'src/app/models/activity.model';
import { ActionTemplates } from '../../shared/template.actions';
import { IdAndGroupId } from '../../shared/template.state';

export const ActivityOfflineActions = {
  meta: {
    /* Add offline activity information
    (with just the file hashes in string)
    */
    addOfflineActivity: createAction('[ Activity / Offline ] Save activity to upload later',
      props<{
        activity: ActivitySM,
        idAndGroup: IdAndGroupId
      }>()),
    /* Add offline activity's file */
    addFileOfflineActivity: createAction('[ FileUploaded / Offline ] Save files activity to upload later',
    props<{
      fileSM: FileUploadedSM,
      file: File
    }>()),
    editOfflineActivity: createAction('[ Activity / Offline ] Save edit activity to upload later',
      props<{
        activity: ActivitySM,
        idAndGroup: IdAndGroupId
    }>()),
  },

  created: ActionTemplates.basicActions<IdAndGroupId>('Activity / Offline / Created'),
  requested: {
    groupIds: ActionTemplates.arrayActions<number>('Activity / Offline / Requested / GroupIds'),
  },
  updated: ActionTemplates.basicActions('Activity / Offline / Updated'),
  deleted: ActionTemplates.idAndGroup('Activity / Offline / Deleted'),

  filesToDelete: ActionTemplates.basicActions<FilesToDelete>('Activity / Offline / FilesToDelete'),

  gradesReleased: ActionTemplates.basicActions<IdAndGroupId>('Activity / Offline / Release Grade'),

  sync: {
    syncAll: createAction('[ Activity / Offline / Sync / All ] Sync all offline changes'),
    created: {
      syncAll: createAction('[ Activity / Offline / Sync / Created / All ] Sync All'),
      byId: createAction(
        '[ Activity / Offline / Sync / Created / ById ] Sync by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    requested: {
      syncAll: createAction('[ Activity / Offline / Sync / Requested / All Requested ] Sync All'),
      groupById: createAction(
        '[ Activity / Offline / Sync / Requested / Groups by Id ] Sync a requested group',
        props<{ input: { groupId: number } }>()
      ),
    },
    updated: {
      syncAll: createAction('[ Activity / Offline / Sync / Updated / All Updated ] Sync All'),
      byId: createAction(
        '[ Activity / Offline / Sync / Updated / By Id ] Sync a updated item',
        props<{ input: IdAndGroupId }>()
      ),
    },
    deleted: {
      syncAll: createAction('[ Activity / Offline / Sync / Deleted / All ] Sync all'),
      byId: createAction(
        '[ Activity / Offline / Sync / Deleted / ById ] Sync activity deleted offline',
        props<{ input: IdAndGroupId }>()
      ),
    },
    gradesReleased: {
      syncAll: createAction('[ Activity / Offline / Sync / Release Grade / All ] Sync all'),
      byId: createAction(
        '[ Activity / Offline / Sync / Release Grade / ById ] Sync activity grades released offline',
        props<{ input: IdAndGroupId }>()
      ),
    }
  }
}
