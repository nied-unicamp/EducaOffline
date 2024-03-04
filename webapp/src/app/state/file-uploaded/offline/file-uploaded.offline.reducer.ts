import { combineReducers } from '@ngrx/store';
import { arrayReducer, basicReducer, idStringAndGroupReducer } from 'src/app/state/shared/template.reducers';
import { IdStringAndGroupId } from '../../shared/template.state';
import { fileUploadedOfflineCreatedAdapter, fileUploadedOfflineDeletedAdapter, fileUploadedOfflineRequestedIdsAdapter, FileUploadedOfflineState, fileUploadedOfflineUpdatedLikeAdapter, fileUploadedOfflineUpdatedPinIdAdapter, fileUploadedOfflineUpdatedPinIndirectAdapter } from './file-uploaded.offline.state';

export const fileUploadedOfflineReducer = combineReducers<FileUploadedOfflineState>({
  created: basicReducer<IdStringAndGroupId>('FileUploaded / Offline / Created', fileUploadedOfflineCreatedAdapter),
  requested: combineReducers({
    ids: basicReducer<IdStringAndGroupId>('FileUploaded / Offline / Requested / Ids', fileUploadedOfflineRequestedIdsAdapter),
    groupIds: arrayReducer<number>('FileUploaded / Offline / Requested / GroupIds')
  }),
  updated: combineReducers({
    like: idStringAndGroupReducer('FileUploaded / Offline / Updated / Like', fileUploadedOfflineUpdatedLikeAdapter),
    pin: combineReducers({
      ids: idStringAndGroupReducer('FileUploaded / Offline / Updated / Pin / Id', fileUploadedOfflineUpdatedPinIdAdapter),
      indirectChanges: idStringAndGroupReducer('FileUploaded / Offline / Updated / Pin / Id / Indirect', fileUploadedOfflineUpdatedPinIndirectAdapter),
    })
  }),
  deleted: idStringAndGroupReducer('FileUploaded / Offline / Deleted', fileUploadedOfflineDeletedAdapter),
});
