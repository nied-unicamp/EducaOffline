import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { getArrayAdapter } from '../../shared/offline/offline.state';
import { IdStringAndGroupId } from '../../shared/template.state';


/******************************* Created **********************************/
export interface FileUploadedOfflineCreatedState extends EntityState<IdStringAndGroupId> {
}

export const fileUploadedOfflineCreatedAdapter = createEntityAdapter<IdStringAndGroupId>();

export const fileUploadedOfflineCreatedInitialState = fileUploadedOfflineCreatedAdapter.getInitialState();

/******************************* Requested **********************************/
export interface FileUploadedOfflineRequestedState {
  ids: EntityState<IdStringAndGroupId>;
  groupIds: number[];
}

export const fileUploadedOfflineRequestedIdsAdapter = createEntityAdapter<IdStringAndGroupId>({
  selectId: (item) => item.id
});
export const fileUploadedOfflineRequestedGroupIdsAdapter = getArrayAdapter<number>();


export const fileUploadedOfflineRequestedInitialState: FileUploadedOfflineRequestedState = {
  ids: fileUploadedOfflineRequestedIdsAdapter.getInitialState(),
  groupIds: fileUploadedOfflineRequestedGroupIdsAdapter.initialState(),
};

/******************************* Updated **********************************/
export interface FileUploadedOfflineUpdatedState {
  like: FileUploadedOfflineUpdatedLikeState,
  pin: FileUploadedOfflineUpdatedPinState
}

export interface FileUploadedOfflineUpdatedPinState {
  ids: FileUploadedOfflineUpdatedPinIdState,
  indirectChanges: FileUploadedOfflineUpdatedPinIndirectState
}

export interface FileUploadedOfflineUpdatedLikeState extends EntityState<IdStringAndGroupId> {
}

export const fileUploadedOfflineUpdatedLikeAdapter = createEntityAdapter<IdStringAndGroupId>({
  selectId: (item) => item.id
});

export interface FileUploadedOfflineUpdatedPinIdState extends EntityState<IdStringAndGroupId> {
}

export const fileUploadedOfflineUpdatedPinIdAdapter = createEntityAdapter<IdStringAndGroupId>({
  selectId: (item) => item.id
});

export interface FileUploadedOfflineUpdatedPinIndirectState extends EntityState<IdStringAndGroupId> {
}

export const fileUploadedOfflineUpdatedPinIndirectAdapter = createEntityAdapter<IdStringAndGroupId>({
  selectId: (item) => item.groupId,
});


export const fileUploadedOfflineUpdatedPinInitialState: FileUploadedOfflineUpdatedPinState = {
  ids: fileUploadedOfflineUpdatedPinIdAdapter.getInitialState(),
  indirectChanges: fileUploadedOfflineUpdatedPinIndirectAdapter.getInitialState(),
};

export const fileUploadedOfflineUpdatedInitialState: FileUploadedOfflineUpdatedState = {
  like: fileUploadedOfflineUpdatedLikeAdapter.getInitialState(),
  pin: fileUploadedOfflineUpdatedPinInitialState,
};


/******************************* Deleted **********************************/
export interface FileUploadedOfflineDeletedState extends EntityState<IdStringAndGroupId> {
}

export const fileUploadedOfflineDeletedAdapter = createEntityAdapter<IdStringAndGroupId>({
  selectId: (item) => item.id
});

export const fileUploadedOfflineDeletedInitialState: FileUploadedOfflineDeletedState = fileUploadedOfflineDeletedAdapter.getInitialState();
/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface FileUploadedOfflineState {
  created: FileUploadedOfflineCreatedState;
  requested: FileUploadedOfflineRequestedState;
  updated: FileUploadedOfflineUpdatedState;
  deleted: FileUploadedOfflineDeletedState;
}

export const fileUploadedOfflineInitialState: FileUploadedOfflineState = {
  created: fileUploadedOfflineCreatedInitialState,
  requested: fileUploadedOfflineRequestedInitialState,
  updated: fileUploadedOfflineUpdatedInitialState,
  deleted: fileUploadedOfflineDeletedInitialState
};
