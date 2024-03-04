import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { getArrayAdapter } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';


/******************************* Created **********************************/
export interface MaterialOfflineCreatedState extends EntityState<IdAndGroupId> {
}

export const materialOfflineCreatedAdapter = createEntityAdapter<IdAndGroupId>();

export const materialOfflineCreatedInitialState = materialOfflineCreatedAdapter.getInitialState();

/******************************* Requested **********************************/
export interface MaterialOfflineRequestedState {
  groupIds: number[];
}

export const materialOfflineRequestedGroupIdsAdapter = getArrayAdapter<number>();

export const materialOfflineRequestedInitialState: MaterialOfflineRequestedState = {
  groupIds: materialOfflineRequestedGroupIdsAdapter.initialState(),
};

/******************************* Updated **********************************/
export interface MaterialOfflineUpdatedState extends EntityState<IdAndGroupId> {
}

export const materialOfflineUpdatedAdapter = createEntityAdapter<IdAndGroupId>();
export const materialOfflineUpdatedInitialState = materialOfflineUpdatedAdapter.getInitialState();

/******************************* Deleted **********************************/
export interface MaterialOfflineDeletedState extends EntityState<IdAndGroupId> {
}

export const materialOfflineDeletedAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export const materialOfflineDeletedInitialState: MaterialOfflineDeletedState = materialOfflineDeletedAdapter.getInitialState();



/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface MaterialOfflineState {
  created: MaterialOfflineCreatedState;
  requested: MaterialOfflineRequestedState;
  updated: MaterialOfflineUpdatedState;
  deleted: MaterialOfflineDeletedState;
}

export const materialOfflineInitialState: MaterialOfflineState = {
  created: materialOfflineCreatedInitialState,
  requested: materialOfflineRequestedInitialState,
  updated: materialOfflineUpdatedInitialState,
  deleted: materialOfflineDeletedInitialState
};
