import { combineReducers } from '@ngrx/store';

import { arrayReducer, basicReducer, idAndGroupReducer } from 'src/app/state/shared/template.reducers';
import { IdAndGroupId } from '../../shared/template.state';
import { wallReplyOfflineCreatedAdapter, wallReplyOfflineDeletedAdapter, WallReplyOfflineState, wallReplyOfflineUpdatedLikeAdapter } from './wall-reply.offline.state';

export const wallReplyOfflineReducer = combineReducers<WallReplyOfflineState>({
  created: basicReducer<IdAndGroupId>('WallReply / Offline / Created', wallReplyOfflineCreatedAdapter),
  requested: combineReducers({
    groupIds: arrayReducer<number>('WallReply / Offline / Requested / GroupIds')
  }),
  updated: combineReducers({
    like: idAndGroupReducer('WallReply / Offline / Updated / Like', wallReplyOfflineUpdatedLikeAdapter),
  }),
  deleted: idAndGroupReducer('WallReply / Offline / Deleted', wallReplyOfflineDeletedAdapter),
});
