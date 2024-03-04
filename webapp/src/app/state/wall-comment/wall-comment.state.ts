import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { WallCommentSM, WallReplySM } from 'src/app/models/wall-comment.model';
import { groupInitialState, GroupState } from '../shared/group/group';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';
import { wallCommentOfflineInitialState, WallCommentOfflineState } from './offline/wall-comment.offline.state';

export interface WallCommentState extends EntityState<WallCommentSM> {
  groups: GroupState;
  metadata: MetadataState<number>;
  offline: WallCommentOfflineState;
}

export const wallCommentAdapter: EntityAdapter<WallCommentSM> = createEntityAdapter<WallCommentSM>();

export const wallCommentInitialState: WallCommentState = wallCommentAdapter.getInitialState({
  groups: groupInitialState,
  metadata: metadataAdapter<number>().getInitialState({}),
  offline: wallCommentOfflineInitialState,
});
