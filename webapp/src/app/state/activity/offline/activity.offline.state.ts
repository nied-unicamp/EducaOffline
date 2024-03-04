import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { getArrayAdapter } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';
import { FilesToDelete } from 'src/app/models/activity.model';


/******************************* Created **********************************/
export interface ActivityOfflineCreatedState extends EntityState<IdAndGroupId> {
}

export const activityOfflineCreatedAdapter = createEntityAdapter<IdAndGroupId>();

export const activityOfflineCreatedInitialState = activityOfflineCreatedAdapter.getInitialState();

/******************************* Requested **********************************/
export interface ActivityOfflineRequestedState {
  groupIds: number[];
}

export const activityOfflineRequestedGroupIdsAdapter = getArrayAdapter<number>();

export const activityOfflineRequestedInitialState: ActivityOfflineRequestedState = {
  groupIds: activityOfflineRequestedGroupIdsAdapter.initialState(),
};

/******************************* Updated **********************************/
export interface ActivityOfflineUpdatedState extends EntityState<IdAndGroupId> {
}

export const activityOfflineUpdatedAdapter = createEntityAdapter<IdAndGroupId>();
export const activityOfflineUpdatedInitialState = activityOfflineUpdatedAdapter.getInitialState();

/******************************* Deleted **********************************/
export interface ActivityOfflineDeletedState extends EntityState<IdAndGroupId> {
}

export const activityOfflineDeletedAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export const activityOfflineDeletedInitialState: ActivityOfflineDeletedState = activityOfflineDeletedAdapter.getInitialState();

/******************************* FilesToDelete **********************************/
export interface ActivityOfflineFilesToDeleteState extends EntityState<FilesToDelete> {
}

export const activityOfflineFilesToDeleteAdapter = createEntityAdapter<FilesToDelete>({
  selectId: (item) => item.activityId
});

export const activityOfflineFilesToDeleteInitialState: ActivityOfflineFilesToDeleteState = activityOfflineFilesToDeleteAdapter.getInitialState();

/******************************* Release Grade **********************************/
export interface ActivityOfflineGradeReleasedState extends EntityState<IdAndGroupId> {
}

export const activityOfflineGradeReleasedAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export const activityOfflineGradeReleasedInitialState: ActivityOfflineGradeReleasedState = activityOfflineGradeReleasedAdapter.getInitialState();


/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface ActivityOfflineState {
  created: ActivityOfflineCreatedState;
  requested: ActivityOfflineRequestedState;
  updated: ActivityOfflineUpdatedState;
  deleted: ActivityOfflineDeletedState;
  filesToDelete: ActivityOfflineFilesToDeleteState;
  gradeReleased: ActivityOfflineGradeReleasedState
}

export const activityOfflineInitialState: ActivityOfflineState = {
  created: activityOfflineCreatedInitialState,
  requested: activityOfflineRequestedInitialState,
  updated: activityOfflineUpdatedInitialState,
  deleted: activityOfflineDeletedInitialState,
  filesToDelete: activityOfflineFilesToDeleteInitialState,
  gradeReleased: activityOfflineGradeReleasedInitialState
};
