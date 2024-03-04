import { combineReducers } from '@ngrx/store';
import { arrayReducer, basicReducer, idAndGroupReducer } from 'src/app/state/shared/template.reducers';
import { IdAndGroupId } from '../../shared/template.state';
import { activitySubmissionOfflineCreatedAdapter, activitySubmissionOfflineDeletedAdapter, activitySubmissionOfflineFilesCurrentAdapter, activitySubmissionOfflineFilesToDeleteAdapter, activitySubmissionOfflineFilesToUpdateAdapter, activitySubmissionOfflineRequestedIdsAdapter, ActivitySubmissionOfflineState, activitySubmissionOfflineUpdatedAdapter} from './activity-submission.offline.state';
import { SubmissionFile } from 'src/app/models/activity-submission.model';

export const activitySubmissionOfflineReducer = combineReducers<ActivitySubmissionOfflineState>({
  created: basicReducer<IdAndGroupId>('ActivitySubmission / Offline / Created', activitySubmissionOfflineCreatedAdapter),
  requested: combineReducers({
    groupIds: arrayReducer<number>('ActivitySubmission / Offline / Requested / GroupIds')
  }),
  updated: basicReducer<IdAndGroupId>('ActivitySubmission / Offline / Updated', activitySubmissionOfflineUpdatedAdapter),
  deleted: idAndGroupReducer('ActivitySubmission / Offline / Deleted', activitySubmissionOfflineDeletedAdapter),
  filesChanged: combineReducers({
    toDelete: basicReducer<SubmissionFile>('ActivitySubmission / Offline / Files / toDelete', activitySubmissionOfflineFilesToDeleteAdapter),
    toUpdate: basicReducer<SubmissionFile>('ActivitySubmission / Offline / Files / toUpdate', activitySubmissionOfflineFilesToUpdateAdapter),
    current: basicReducer<SubmissionFile>('ActivitySubmission / Offline / Files / Current', activitySubmissionOfflineFilesCurrentAdapter)
  })
});
