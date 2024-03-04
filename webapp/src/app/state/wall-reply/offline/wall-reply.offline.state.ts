import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { getArrayAdapter } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';


/******************************* Created **********************************/
export interface WallReplyOfflineCreatedState extends EntityState<IdAndGroupId> {
}

export const wallReplyOfflineCreatedAdapter = createEntityAdapter<IdAndGroupId>();

export const wallReplyOfflineCreatedInitialState = wallReplyOfflineCreatedAdapter.getInitialState();

/******************************* Requested **********************************/
export interface WallReplyOfflineRequestedState {
  groupIds: number[];
}

export const wallReplyOfflineRequestedGroupIdsAdapter = getArrayAdapter<number>();

export const wallReplyOfflineRequestedInitialState: WallReplyOfflineRequestedState = {
  groupIds: wallReplyOfflineRequestedGroupIdsAdapter.initialState(),
};

/******************************* Updated **********************************/
export interface WallReplyOfflineUpdatedState {
  like: EntityState<IdAndGroupId>;
}

export const wallReplyOfflineUpdatedLikeAdapter = createEntityAdapter<IdAndGroupId>();
export const wallReplyOfflineUpdatedLikeInitialState = wallReplyOfflineUpdatedLikeAdapter.getInitialState();

export const wallReplyOfflineUpdatedInitialState: WallReplyOfflineUpdatedState = {
  like: wallReplyOfflineUpdatedLikeInitialState,
};

/******************************* Deleted **********************************/
export interface WallReplyOfflineDeletedState extends EntityState<IdAndGroupId> {
}

export const wallReplyOfflineDeletedAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export const wallReplyOfflineDeletedInitialState: WallReplyOfflineDeletedState = wallReplyOfflineDeletedAdapter.getInitialState();



/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface WallReplyOfflineState {
  created: WallReplyOfflineCreatedState;
  requested: WallReplyOfflineRequestedState;
  updated: WallReplyOfflineUpdatedState;
  deleted: WallReplyOfflineDeletedState;
}

export const wallReplyOfflineInitialState: WallReplyOfflineState = {
  created: wallReplyOfflineCreatedInitialState,
  requested: wallReplyOfflineRequestedInitialState,
  updated: wallReplyOfflineUpdatedInitialState,
  deleted: wallReplyOfflineDeletedInitialState
};
