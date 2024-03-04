import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { getArrayAdapter } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';
import { SubmissionFile } from 'src/app/models/activity-submission.model';
import { toUpdate } from '../../shared/template.reducers';

/******************************* Requested **********************************/
export interface ActivityItemOfflineRequestedState {
  groupIds: number[];
}

export const activityItemOfflineRequestedGroupIdsAdapter = getArrayAdapter<number>();

export const activityItemOfflineRequestedInitialState: ActivityItemOfflineRequestedState = {
    groupIds: activityItemOfflineRequestedGroupIdsAdapter.initialState(),
};

/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface ActivityItemOfflineState {
    requested: ActivityItemOfflineRequestedState;
}
  
export const activityItemOfflineInitialState: ActivityItemOfflineState = {
    requested: activityItemOfflineRequestedInitialState
};