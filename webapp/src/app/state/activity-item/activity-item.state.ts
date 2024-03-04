import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ActivityItemSM } from 'src/app/models/activity-item.model';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';
import { activityItemOfflineInitialState, ActivityItemOfflineState } from './offline/activity-item.offline.state';

export interface ActivityItemState extends EntityState<ActivityItemSM> {
  metadata: MetadataState<string>;
  offline: ActivityItemOfflineState
}

export const activityItemAdapter: EntityAdapter<ActivityItemSM> = createEntityAdapter<ActivityItemSM>({
  selectId: (item: ActivityItemSM) => `${item.activityId}/${item.userId}`
});

export const getActivityItemId = <(item: ActivityItemSM) => string>activityItemAdapter.selectId


export const ActivityItemInitialState: ActivityItemState = activityItemAdapter.getInitialState({
  metadata: metadataAdapter<string>().getInitialState(),
  offline: activityItemOfflineInitialState
});
