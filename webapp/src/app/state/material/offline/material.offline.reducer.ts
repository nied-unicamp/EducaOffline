import { combineReducers } from '@ngrx/store';
import { arrayReducer, basicReducer, idAndGroupReducer } from 'src/app/state/shared/template.reducers';
import { IdAndGroupId } from '../../shared/template.state';
import { materialOfflineCreatedAdapter, materialOfflineDeletedAdapter, MaterialOfflineState, materialOfflineUpdatedAdapter } from './material.offline.state';

export const materialOfflineReducer = combineReducers<MaterialOfflineState>({
  created: basicReducer<IdAndGroupId>('Material / Offline / Created', materialOfflineCreatedAdapter),
  requested: combineReducers({
    groupIds: arrayReducer<number>('Material / Offline / Requested / GroupIds')
  }),
  updated: idAndGroupReducer('Material / Offline / Updated', materialOfflineUpdatedAdapter),
  deleted: idAndGroupReducer('Material / Offline / Deleted', materialOfflineDeletedAdapter),
});
