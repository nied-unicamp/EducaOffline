import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ActivitySubmissionSM } from 'src/app/models/activity-submission.model';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';
import { activitySubmissionOfflineInitialState, ActivitySubmissionOfflineState } from './offline/activity-submission.offline.state';
import { groupAdapter, GroupState } from '../shared/group/group';

export interface ActivitySubmissionState extends EntityState<ActivitySubmissionSM> {
  metadata: MetadataState<number>;
  offline: ActivitySubmissionOfflineState;
  groups: GroupState;
}

export const activitySubmissionAdapter: EntityAdapter<ActivitySubmissionSM> = createEntityAdapter<ActivitySubmissionSM>();

export const ActivitySubmissionInitialState: ActivitySubmissionState = activitySubmissionAdapter.getInitialState({
  metadata: metadataAdapter<number>().getInitialState(),
  groups: groupAdapter.getInitialState(),
  offline: activitySubmissionOfflineInitialState,
});
