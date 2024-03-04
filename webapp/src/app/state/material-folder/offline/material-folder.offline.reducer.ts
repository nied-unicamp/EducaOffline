import { combineReducers } from '@ngrx/store';
import { arrayReducer, basicReducer, idAndGroupReducer } from 'src/app/state/shared/template.reducers';
import { IdAndGroupId } from '../../shared/template.state';
import { MaterialFolderOfflineState, materialFolderOfflineCreatedAdapter, materialFolderOfflineDeletedAdapter, materialFolderOfflineUpdatedAdapter } from './material-folder.offline.state';

export const materialFolderOfflineReducer = combineReducers<MaterialFolderOfflineState>({
  created: basicReducer<IdAndGroupId>('MaterialFolder / Offline / Created', materialFolderOfflineCreatedAdapter),
  requested: combineReducers({
    groupIds: arrayReducer<number>('MaterialFolder / Offline / Requested / GroupIds')
  }),
  downloadRequested: combineReducers({
    groupIds: arrayReducer<number>('MaterialFolder / Offline / DownloadRequested / GroupIds')
  }),
  updated: idAndGroupReducer('MaterialFolder / Offline / Updated', materialFolderOfflineUpdatedAdapter),
  deleted: idAndGroupReducer('MaterialFolder / Offline / Deleted', materialFolderOfflineDeletedAdapter),
});
