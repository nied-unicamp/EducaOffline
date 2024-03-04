import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { getArrayAdapter } from '../../shared/offline/offline.state';
import { IdAndGroupId } from '../../shared/template.state';
import { SubmissionFile } from 'src/app/models/activity-submission.model';
import { toUpdate } from '../../shared/template.reducers';


/******************************* Created **********************************/
export interface ActivitySubmissionOfflineCreatedState extends EntityState<IdAndGroupId> {
}

export const activitySubmissionOfflineCreatedAdapter = createEntityAdapter<IdAndGroupId>();

export const activitySubmissionOfflineCreatedInitialState = activitySubmissionOfflineCreatedAdapter.getInitialState();

/******************************* Requested **********************************/
export interface ActivitySubmissionOfflineRequestedState {
  groupIds: number[];
}

export const activitySubmissionOfflineRequestedIdsAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});
export const activitySubmissionOfflineRequestedGroupIdsAdapter = getArrayAdapter<number>();


export const activitySubmissionOfflineRequestedInitialState: ActivitySubmissionOfflineRequestedState = {
  groupIds: activitySubmissionOfflineRequestedGroupIdsAdapter.initialState()
};

/******************************* Updated **********************************/
export interface ActivitySubmissionOfflineUpdatedState extends EntityState<IdAndGroupId> {
}

export const activitySubmissionOfflineUpdatedAdapter = createEntityAdapter<IdAndGroupId>();
export const activitySubmissionOfflineUpdatedInitialState = activitySubmissionOfflineUpdatedAdapter.getInitialState();

/******************************* Deleted **********************************/
export interface ActivitySubmissionOfflineDeletedState extends EntityState<IdAndGroupId> {
}

export const activitySubmissionOfflineDeletedAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export const activitySubmissionOfflineDeletedInitialState: ActivitySubmissionOfflineDeletedState = activitySubmissionOfflineDeletedAdapter.getInitialState();

/******************************* Submission Files **********************************/
/********* toDelete *********/
export interface ActivitySubmissionOfflineFilesToDeleteState extends EntityState<SubmissionFile> {
}
export const activitySubmissionOfflineFilesToDeleteAdapter = createEntityAdapter<SubmissionFile>({
  selectId: (item) => item.file
});

export const activitySubmissionOfflineFilesToDeleteInitialState: ActivitySubmissionOfflineFilesToDeleteState = activitySubmissionOfflineFilesToDeleteAdapter.getInitialState();

/********* toUpdate *********/
export interface ActivitySubmissionOfflineFilesToUpdateState extends EntityState<SubmissionFile> {
}
export const activitySubmissionOfflineFilesToUpdateAdapter = createEntityAdapter<SubmissionFile>({
  selectId: (item) => item.file
});

export const activitySubmissionOfflineFilesToUpdateInitialState: ActivitySubmissionOfflineFilesToUpdateState = activitySubmissionOfflineFilesToUpdateAdapter.getInitialState();

/********* Current *********/
export interface ActivitySubmissionOfflineFilesCurrentState extends EntityState<SubmissionFile> {
}
export const activitySubmissionOfflineFilesCurrentAdapter = createEntityAdapter<SubmissionFile>({
  selectId: (item) => item.file
});

export const activitySubmissionOfflineFilesCurrentInitialState: ActivitySubmissionOfflineFilesCurrentState = activitySubmissionOfflineFilesCurrentAdapter.getInitialState();

/********* FileChangedState *********/
export interface SubmissionFileChangedState {
  toDelete: ActivitySubmissionOfflineFilesToDeleteState;
  toUpdate: ActivitySubmissionOfflineFilesToUpdateState;
  current: ActivitySubmissionOfflineFilesCurrentState;
}

export const SubmissionFileChangedInitialState: SubmissionFileChangedState = {
  toDelete: activitySubmissionOfflineFilesToDeleteInitialState,
  toUpdate: activitySubmissionOfflineFilesToUpdateInitialState,
  current: activitySubmissionOfflineFilesCurrentInitialState
}

/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface ActivitySubmissionOfflineState {
  created: ActivitySubmissionOfflineCreatedState;
  requested: ActivitySubmissionOfflineRequestedState;
  updated: ActivitySubmissionOfflineUpdatedState;
  deleted: ActivitySubmissionOfflineDeletedState;
  filesChanged: SubmissionFileChangedState
}

export const activitySubmissionOfflineInitialState: ActivitySubmissionOfflineState = {
  created: activitySubmissionOfflineCreatedInitialState,
  requested: activitySubmissionOfflineRequestedInitialState,
  updated: activitySubmissionOfflineUpdatedInitialState,
  deleted: activitySubmissionOfflineDeletedInitialState,
  filesChanged: SubmissionFileChangedInitialState
};
