import { combineReducers } from '@ngrx/store';
import { arrayReducer, basicReducer, idAndGroupReducer } from 'src/app/state/shared/template.reducers';
import { IdAndGroupId } from '../../shared/template.state';
import { ActivityEvaluationOfflineState, activityEvaluationOfflineCreatedAdapter, activityEvaluationOfflineDeletedAdapter, activityEvaluationOfflineUpdatedAdapter } from './activity-evaluation.offline.state';

export const activityEvaluationOfflineReducer = combineReducers<ActivityEvaluationOfflineState>({
  created: basicReducer<IdAndGroupId>('Activity Evaluation / Offline / Created', activityEvaluationOfflineCreatedAdapter),
  requested: combineReducers({
    groupIds: arrayReducer<number>('Activity Evaluation / Offline / Requested / GroupIds')
  }),
  updated: idAndGroupReducer('Activity Evaluation / Offline / Updated / Like', activityEvaluationOfflineUpdatedAdapter),
  deleted: idAndGroupReducer('Activity Evaluation / Offline / Deleted', activityEvaluationOfflineDeletedAdapter),
});
