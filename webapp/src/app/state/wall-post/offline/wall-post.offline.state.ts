import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { getArrayAdapter } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';


/******************************* Created **********************************/
export interface WallPostOfflineCreatedState extends EntityState<IdAndGroupId> {
}

export const wallPostOfflineCreatedAdapter = createEntityAdapter<IdAndGroupId>();

export const wallPostOfflineCreatedInitialState = wallPostOfflineCreatedAdapter.getInitialState();

/******************************* Requested **********************************/
export interface WallPostOfflineRequestedState {
  ids: EntityState<IdAndGroupId>;
  groupIds: number[];
}

export const wallPostOfflineRequestedIdsAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});
export const wallPostOfflineRequestedGroupIdsAdapter = getArrayAdapter<number>();


export const wallPostOfflineRequestedInitialState: WallPostOfflineRequestedState = {
  ids: wallPostOfflineRequestedIdsAdapter.getInitialState(),
  groupIds: wallPostOfflineRequestedGroupIdsAdapter.initialState(),
};

/******************************* Updated **********************************/
export interface WallPostOfflineUpdatedState {
  like: WallPostOfflineUpdatedLikeState,
  pin: WallPostOfflineUpdatedPinState
}

export interface WallPostOfflineUpdatedPinState {
  ids: WallPostOfflineUpdatedPinIdState,
  indirectChanges: WallPostOfflineUpdatedPinIndirectState
}

export interface WallPostOfflineUpdatedLikeState extends EntityState<IdAndGroupId> {
}

export const wallPostOfflineUpdatedLikeAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export interface WallPostOfflineUpdatedPinIdState extends EntityState<IdAndGroupId> {
}

export const wallPostOfflineUpdatedPinIdAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export interface WallPostOfflineUpdatedPinIndirectState extends EntityState<IdAndGroupId> {
}

export const wallPostOfflineUpdatedPinIndirectAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.groupId,
});


export const wallPostOfflineUpdatedPinInitialState: WallPostOfflineUpdatedPinState = {
  ids: wallPostOfflineUpdatedPinIdAdapter.getInitialState(),
  indirectChanges: wallPostOfflineUpdatedPinIndirectAdapter.getInitialState(),
};

export const wallPostOfflineUpdatedInitialState: WallPostOfflineUpdatedState = {
  like: wallPostOfflineUpdatedLikeAdapter.getInitialState(),
  pin: wallPostOfflineUpdatedPinInitialState,
};


/******************************* Deleted **********************************/
export interface WallPostOfflineDeletedState extends EntityState<IdAndGroupId> {
}

export const wallPostOfflineDeletedAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export const wallPostOfflineDeletedInitialState: WallPostOfflineDeletedState = wallPostOfflineDeletedAdapter.getInitialState();
/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface WallPostOfflineState {
  created: WallPostOfflineCreatedState;
  requested: WallPostOfflineRequestedState;
  updated: WallPostOfflineUpdatedState;
  deleted: WallPostOfflineDeletedState;
}

export const wallPostOfflineInitialState: WallPostOfflineState = {
  created: wallPostOfflineCreatedInitialState,
  requested: wallPostOfflineRequestedInitialState,
  updated: wallPostOfflineUpdatedInitialState,
  deleted: wallPostOfflineDeletedInitialState
};
