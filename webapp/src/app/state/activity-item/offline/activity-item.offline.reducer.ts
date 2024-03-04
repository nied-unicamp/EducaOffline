import { combineReducers } from '@ngrx/store';
import { arrayReducer, basicReducer, idAndGroupReducer } from 'src/app/state/shared/template.reducers';
import { IdAndGroupId } from '../../shared/template.state';
import { ActivityItemOfflineState } from './activity-item.offline.state';


export const activityItemOfflineReducer = combineReducers<ActivityItemOfflineState>({
  requested: combineReducers({
    groupIds: arrayReducer<number>('ActivityItem / Offline / Requested / GroupIds')
  }),
});