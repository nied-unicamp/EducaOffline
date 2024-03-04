import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { WallPostSM } from 'src/app/models/wall-post.model';
import { groupAdapter, GroupState } from '../shared/group/group';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';
import { wallPostOfflineInitialState, WallPostOfflineState } from './offline/wall-post.offline.state';

export interface WallPostState extends EntityState<WallPostSM> {
  selectedId: number;
  groups: GroupState;
  metadata: MetadataState<number>;

  offline: WallPostOfflineState;
}

export const wallPostAdapter: EntityAdapter<WallPostSM> = createEntityAdapter<WallPostSM>();

export const wallPostInitialState: WallPostState = wallPostAdapter.getInitialState({
  selectedId: null,
  groups: groupAdapter.getInitialState(),
  metadata: metadataAdapter<number>().getInitialState(),

  offline: wallPostOfflineInitialState
});
