import { combineReducers } from '@ngrx/store';
import { arrayReducer, basicReducer, idAndGroupReducer } from 'src/app/state/shared/template.reducers';
import { IdAndGroupId } from '../../shared/template.state';
import { wallPostOfflineCreatedAdapter, wallPostOfflineDeletedAdapter, wallPostOfflineRequestedIdsAdapter, WallPostOfflineState, wallPostOfflineUpdatedLikeAdapter, wallPostOfflineUpdatedPinIdAdapter, wallPostOfflineUpdatedPinIndirectAdapter } from './wall-post.offline.state';

export const wallPostOfflineReducer = combineReducers<WallPostOfflineState>({
  created: basicReducer<IdAndGroupId>('WallPost / Offline / Created', wallPostOfflineCreatedAdapter),
  requested: combineReducers({
    ids: basicReducer<IdAndGroupId>('WallPost / Offline / Requested / Ids', wallPostOfflineRequestedIdsAdapter),
    groupIds: arrayReducer<number>('WallPost / Offline / Requested / GroupIds')
  }),
  updated: combineReducers({
    like: idAndGroupReducer('WallPost / Offline / Updated / Like', wallPostOfflineUpdatedLikeAdapter),
    pin: combineReducers({
      ids: idAndGroupReducer('WallPost / Offline / Updated / Pin / Id', wallPostOfflineUpdatedPinIdAdapter),
      indirectChanges: idAndGroupReducer('WallPost / Offline / Updated / Pin / Id / Indirect', wallPostOfflineUpdatedPinIndirectAdapter),
    })
  }),
  deleted: idAndGroupReducer('WallPost / Offline / Deleted', wallPostOfflineDeletedAdapter),
});
