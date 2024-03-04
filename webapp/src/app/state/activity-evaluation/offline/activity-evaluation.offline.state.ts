import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { getArrayAdapter } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';


/******************************* Created **********************************/
export interface ActivityEvaluationOfflineCreatedState extends EntityState<IdAndGroupId> {
}

export const activityEvaluationOfflineCreatedAdapter = createEntityAdapter<IdAndGroupId>();

export const activityEvaluationOfflineCreatedInitialState = activityEvaluationOfflineCreatedAdapter.getInitialState();

/******************************* Requested **********************************/
export interface ActivityEvaluationOfflineRequestedState {
  groupIds: number[];
}

export const activityEvaluationOfflineRequestedGroupIdsAdapter = getArrayAdapter<number>();

export const activityEvaluationOfflineRequestedInitialState: ActivityEvaluationOfflineRequestedState = {
  groupIds: activityEvaluationOfflineRequestedGroupIdsAdapter.initialState(),
};

/******************************* Updated **********************************/
export interface ActivityEvaluationOfflineUpdatedState extends EntityState<IdAndGroupId> {
}

export const activityEvaluationOfflineUpdatedAdapter = createEntityAdapter<IdAndGroupId>();
export const activityEvaluationOfflineUpdatedInitialState = activityEvaluationOfflineUpdatedAdapter.getInitialState();

/******************************* Deleted **********************************/
export interface ActivityEvaluationOfflineDeletedState extends EntityState<IdAndGroupId> {
}

export const activityEvaluationOfflineDeletedAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export const activityEvaluationOfflineDeletedInitialState: ActivityEvaluationOfflineDeletedState = activityEvaluationOfflineDeletedAdapter.getInitialState();



/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface ActivityEvaluationOfflineState {
  created: ActivityEvaluationOfflineCreatedState;
  requested: ActivityEvaluationOfflineRequestedState;
  updated: ActivityEvaluationOfflineUpdatedState;
  deleted: ActivityEvaluationOfflineDeletedState;
}

export const activityEvaluationOfflineInitialState: ActivityEvaluationOfflineState = {
  created: activityEvaluationOfflineCreatedInitialState,
  requested: activityEvaluationOfflineRequestedInitialState,
  updated: activityEvaluationOfflineUpdatedInitialState,
  deleted: activityEvaluationOfflineDeletedInitialState
};
