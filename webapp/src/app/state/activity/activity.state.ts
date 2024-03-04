import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ActivityFilter, ActivitySM } from 'src/app/models/activity.model';
import { groupAdapter, GroupState } from '../shared/group/group';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';
import { activityOfflineInitialState, ActivityOfflineState } from './offline/activity.offline.state';

export interface ActivityState extends EntityState<ActivitySM> {
  selectedActivityId: number | null;
  filter: ActivityFilter;
  groups: GroupState;
  metadata: MetadataState<number>;
  offline: ActivityOfflineState;
}

export const activityAdapter: EntityAdapter<ActivitySM> = createEntityAdapter<ActivitySM>();

export const ActivityInitialState: ActivityState = activityAdapter.getInitialState({
  selectedActivityId: null,
  filter: ActivityFilter.NoFilter,
  groups: groupAdapter.getInitialState(),
  metadata: metadataAdapter<number>().getInitialState(),
  offline: activityOfflineInitialState
});
