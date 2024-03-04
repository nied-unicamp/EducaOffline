import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ActivityEvaluationSM } from 'src/app/models/activity-evaluation.model';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';
import { activityEvaluationOfflineInitialState, ActivityEvaluationOfflineState } from './offline/activity-evaluation.offline.state';
import { groupAdapter, GroupState } from '../shared/group/group';

export interface ActivityEvaluationState extends EntityState<ActivityEvaluationSM> {
  metadata: MetadataState<number>;
  offline: ActivityEvaluationOfflineState;
  groups: GroupState
}

export const activityEvaluationAdapter: EntityAdapter<ActivityEvaluationSM> = createEntityAdapter<ActivityEvaluationSM>();

export const ActivityEvaluationInitialState: ActivityEvaluationState = activityEvaluationAdapter.getInitialState({
  metadata: metadataAdapter<number>().getInitialState(),
  offline: activityEvaluationOfflineInitialState,
  groups: groupAdapter.getInitialState()
});
