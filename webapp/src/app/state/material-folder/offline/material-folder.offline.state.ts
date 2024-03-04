import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { getArrayAdapter } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';


/******************************* Created **********************************/
export interface MaterialFolderOfflineCreatedState extends EntityState<IdAndGroupId> {
}

export const materialFolderOfflineCreatedAdapter = createEntityAdapter<IdAndGroupId>();

export const materialFolderOfflineCreatedInitialState = materialFolderOfflineCreatedAdapter.getInitialState();

/******************************* Requested **********************************/
export interface MaterialFolderOfflineRequestedState {
  groupIds: number[];
}

export const materialFolderOfflineRequestedGroupIdsAdapter = getArrayAdapter<number>();

export const materialFolderOfflineRequestedInitialState: MaterialFolderOfflineRequestedState = {
  groupIds: materialFolderOfflineRequestedGroupIdsAdapter.initialState(),
};

/******************************* Download Requested **********************************/
export interface MaterialFolderOfflineDownloadRequestedState {
  groupIds: number[];
}

export const materialFolderOfflineDownloadRequestedGroupIdsAdapter = getArrayAdapter<number>();

export const materialFolderOfflineDownloadRequestedInitialState: MaterialFolderOfflineDownloadRequestedState = {
  groupIds: materialFolderOfflineDownloadRequestedGroupIdsAdapter.initialState(),
};


/******************************* Updated **********************************/
export interface MaterialFolderOfflineUpdatedState extends EntityState<IdAndGroupId> {
}

export const materialFolderOfflineUpdatedAdapter = createEntityAdapter<IdAndGroupId>();
export const materialFolderOfflineUpdatedInitialState = materialFolderOfflineUpdatedAdapter.getInitialState();

/******************************* Deleted **********************************/
export interface MaterialFolderOfflineDeletedState extends EntityState<IdAndGroupId> {
}

export const materialFolderOfflineDeletedAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export const materialFolderOfflineDeletedInitialState: MaterialFolderOfflineDeletedState = materialFolderOfflineDeletedAdapter.getInitialState();



/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface MaterialFolderOfflineState {
  created: MaterialFolderOfflineCreatedState;
  requested: MaterialFolderOfflineRequestedState;
  downloadRequested: MaterialFolderOfflineDownloadRequestedState;
  updated: MaterialFolderOfflineUpdatedState;
  deleted: MaterialFolderOfflineDeletedState;
} 

export const materialFolderOfflineInitialState: MaterialFolderOfflineState = {
  created: materialFolderOfflineCreatedInitialState,
  requested: materialFolderOfflineRequestedInitialState,
  downloadRequested: materialFolderOfflineDownloadRequestedInitialState,
  updated: materialFolderOfflineUpdatedInitialState,
  deleted: materialFolderOfflineDeletedInitialState
};
