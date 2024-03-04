import { createAction, props } from '@ngrx/store';
import { ActionTemplates } from '../../shared/template.actions';
import { IdAndGroupId } from '../../shared/template.state';
import { ActivitySubmissionSM, SubmissionFile} from 'src/app/models/activity-submission.model';
import { FileUploadedSM } from 'src/app/models/file-uploaded.model';

export const ActivitySubmissionOfflineActions = {

  meta: {
    addOfflineSubmission: createAction('[ ActivitySubmission / Offline ] Save submission to upload later',
      props<{
        submission: ActivitySubmissionSM,
        idAndGroup: IdAndGroupId
      }>()),
    addFileOfflineSubmission: createAction('[ FileUploaded / Offline ] Save files submission to upload later',
    props<{
      fileSM: FileUploadedSM,
      file: File
    }>()),
    editOfflineSubmission: createAction('[ ActivitySubmission / Offline ] Save edit submission to upload later',
      props<{
        submission: ActivitySubmissionSM,
        idAndGroup: IdAndGroupId
      }>()),
    saveSubmissionFilesIdsToDeleteOffline: createAction('[ ActivitySubmission / Offline ] Save file id to delete file later',
    props<{
      submission: ActivitySubmissionSM,
      idAndGroup: IdAndGroupId
    }>())
  },
  created: ActionTemplates.basicActions<IdAndGroupId>('ActivitySubmission / Offline / Created'),
  requested: {
    groupIds: ActionTemplates.arrayActions<number>('ActivitySubmission / Offline / Requested / GroupIds'),
  },
  updated: ActionTemplates.basicActions<IdAndGroupId>('ActivitySubmission / Offline / Updated'),

  deleted: ActionTemplates.idAndGroup('ActivitySubmission / Offline / Deleted'),

  filesChanged: {
    toDelete: ActionTemplates.basicActions<SubmissionFile>('ActivitySubmission / Offline / Files / toDelete'),
    toUpdate: ActionTemplates.basicActions<SubmissionFile>('ActivitySubmission / Offline / Files / toUpdate'),
    current: ActionTemplates.basicActions<SubmissionFile>('ActivitySubmission / Offline / Files / Current')
  },



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
        props<{ input: { groupId: number } }>()
      ),
      ids: createAction('[ ActivitySubmission / Offline / Sync / Requested / Ids ] Get list of ids'),
      byId: createAction(
        '[ ActivitySubmission / Offline / Sync / Requested / ById ] Sync requested activitySubmission by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    updated: {
      syncAll: createAction('[ ActivitySubmission / Offline / Sync / Updated / All ] Sync all'),
      byId: createAction(
        '[ ActivitySubmission / Offline / Sync / Updated / ById ] Sync by id',
        props<{ input: IdAndGroupId }>()
      ),
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
