import { createAction, props } from '@ngrx/store';
import { FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { MaterialSM } from 'src/app/models/material.model';
import { ActionTemplates } from '../../shared/template.actions';
import { IdAndGroupId } from '../../shared/template.state';

export const MaterialOfflineActions = {
  meta: {
    addOfflineMaterial: createAction('[ FileUploaded / Offline ] Save file to upload later',
      props<{
        material: MaterialSM,
        fileSM: FileUploadedSM,
        file: File,
        idAndGroup: IdAndGroupId
      }>()),
    addOfflineLink: createAction('[ FileUploaded / Offline ] Save link material to upload later',
      props<{
        material: MaterialSM,
        idAndGroup: IdAndGroupId
      }>()),
    updateOfflineMaterial: createAction('[ Material / Offline ] Save edited link to upload later',
      props<{
        material: MaterialSM,
        idAndGroup: IdAndGroupId
      }>())
  },

  created: ActionTemplates.basicActions<IdAndGroupId>('Material / Offline / Created'),
  requested: {
    groupIds: ActionTemplates.arrayActions<number>('Material / Offline / Requested / GroupIds'),
  },
  updated: ActionTemplates.idAndGroup('Material / Offline / Updated'),
  deleted: ActionTemplates.idAndGroup('Material / Offline / Deleted'),

  sync: {
    syncAll: createAction('[ Material / Offline / Sync / All ] Sync all offline changes'),
    created: {
      syncAll: createAction('[ Material / Offline / Sync / Created / All ] Sync All'),
      byId: createAction(
        '[ Material / Offline / Sync / Created / ById ] Sync by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    requested: {
      syncAll: createAction('[ Material / Offline / Sync / Requested / All Requested ] Sync All'),
      groupById: createAction(
        '[ Material / Offline / Sync / Requested / Groups by Id ] Sync a requested group',
        props<{ input: { groupId: number } }>()
      ),
    },
    updated: {
      syncAll: createAction('[ Material / Offline / Sync / Updated / All Updated ] Sync All'),
      byId: createAction(
        '[ Material / Offline / Sync / Updated / By Id ] Sync a updated item',
        props<{ input: IdAndGroupId }>()
      ),
    },
    deleted: {
      syncAll: createAction('[ Material / Offline / Sync / Deleted / All ] Sync all'),
      byId: createAction(
        '[ Material / Offline / Sync / Deleted / ById ] Sync material deleted offline',
        props<{ input: IdAndGroupId }>()
      ),
    }
  }
}
