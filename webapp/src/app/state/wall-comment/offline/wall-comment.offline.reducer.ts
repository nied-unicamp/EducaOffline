import { combineReducers } from '@ngrx/store';
import { arrayReducer, basicReducer, idAndGroupReducer } from 'src/app/state/shared/template.reducers';
import { IdAndGroupId } from '../../shared/template.state';
import { wallCommentOfflineCreatedAdapter, wallCommentOfflineDeletedAdapter, WallCommentOfflineState, wallCommentOfflineUpdatedLikeAdapter } from './wall-comment.offline.state';

export const wallCommentOfflineReducer = combineReducers<WallCommentOfflineState>({
  created: basicReducer<IdAndGroupId>('WallComment / Offline / Created', wallCommentOfflineCreatedAdapter),
  requested: combineReducers({
    groupIds: arrayReducer<number>('WallComment / Offline / Requested / GroupIds')
  }),
  updated: combineReducers({
    like: idAndGroupReducer('WallComment / Offline / Updated / Like', wallCommentOfflineUpdatedLikeAdapter),
  }),
  deleted: idAndGroupReducer('WallComment / Offline / Deleted', wallCommentOfflineDeletedAdapter),
});
