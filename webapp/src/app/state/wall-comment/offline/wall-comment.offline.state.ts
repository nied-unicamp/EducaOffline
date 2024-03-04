import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { getArrayAdapter } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';


/******************************* Created **********************************/
export interface WallCommentOfflineCreatedState extends EntityState<IdAndGroupId> {
}

export const wallCommentOfflineCreatedAdapter = createEntityAdapter<IdAndGroupId>();

export const wallCommentOfflineCreatedInitialState = wallCommentOfflineCreatedAdapter.getInitialState();

/******************************* Requested **********************************/
export interface WallCommentOfflineRequestedState {
  groupIds: number[];
}

export const wallCommentOfflineRequestedGroupIdsAdapter = getArrayAdapter<number>();

export const wallCommentOfflineRequestedInitialState: WallCommentOfflineRequestedState = {
  groupIds: wallCommentOfflineRequestedGroupIdsAdapter.initialState(),
};

/******************************* Updated **********************************/
export interface WallCommentOfflineUpdatedState {
  like: EntityState<IdAndGroupId>;
}

export const wallCommentOfflineUpdatedLikeAdapter = createEntityAdapter<IdAndGroupId>();
export const wallCommentOfflineUpdatedLikeInitialState = wallCommentOfflineUpdatedLikeAdapter.getInitialState();

export const wallCommentOfflineUpdatedInitialState: WallCommentOfflineUpdatedState = {
  like: wallCommentOfflineUpdatedLikeInitialState,
};

/******************************* Deleted **********************************/
export interface WallCommentOfflineDeletedState extends EntityState<IdAndGroupId> {
}

export const wallCommentOfflineDeletedAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export const wallCommentOfflineDeletedInitialState: WallCommentOfflineDeletedState = wallCommentOfflineDeletedAdapter.getInitialState();



/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface WallCommentOfflineState {
  created: WallCommentOfflineCreatedState;
  requested: WallCommentOfflineRequestedState;
  updated: WallCommentOfflineUpdatedState;
  deleted: WallCommentOfflineDeletedState;
}

export const wallCommentOfflineInitialState: WallCommentOfflineState = {
  created: wallCommentOfflineCreatedInitialState,
  requested: wallCommentOfflineRequestedInitialState,
  updated: wallCommentOfflineUpdatedInitialState,
  deleted: wallCommentOfflineDeletedInitialState
};
