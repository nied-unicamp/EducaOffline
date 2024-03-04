import { combineReducers } from '@ngrx/store';
import { arrayReducer, basicReducer, idAndGroupReducer } from 'src/app/state/shared/template.reducers';
import { IdAndGroupId } from '../../shared/template.state';
import { activityOfflineCreatedAdapter, activityOfflineDeletedAdapter, activityOfflineFilesToDeleteAdapter, ActivityOfflineState, activityOfflineUpdatedAdapter, activityOfflineGradeReleasedAdapter } from './activity.offline.state';
import { FilesToDelete } from 'src/app/models/activity.model';

export const activityOfflineReducer = combineReducers<ActivityOfflineState>({
  created: basicReducer<IdAndGroupId>('Activity / Offline / Created', activityOfflineCreatedAdapter),
  requested: combineReducers({
    groupIds: arrayReducer<number>('Activity / Offline / Requested / GroupIds')
  }),
  updated: idAndGroupReducer('Activity / Offline / Updated', activityOfflineUpdatedAdapter),
  deleted: idAndGroupReducer('Activity / Offline / Deleted', activityOfflineDeletedAdapter),
  filesToDelete: basicReducer<FilesToDelete>('Activity / Offline / FilesToDelete', activityOfflineFilesToDeleteAdapter),
  gradeReleased: idAndGroupReducer('Activity / Offline / Release Grade', activityOfflineGradeReleasedAdapter)
});
