import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { WallReplySM } from 'src/app/models/wall-comment.model';
import { groupInitialState, GroupState } from '../shared/group/group';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';
import { WallReplyOfflineState } from 'src/app/state/wall-reply/offline/wall-reply.offline.state';
import { wallCommentOfflineInitialState } from '../wall-comment/offline/wall-comment.offline.state';


export interface WallReplyState extends EntityState<WallReplySM>{
    groups: GroupState;
    metadata: MetadataState<number>;
    offline: WallReplyOfflineState;
  }
  
  export const wallReplyAdapter: EntityAdapter<WallReplySM> = createEntityAdapter<WallReplySM>();
  
  
  export const wallReplyInitialState: WallReplyState = wallReplyAdapter.getInitialState({
    groups: groupInitialState,
    metadata: metadataAdapter<number>().getInitialState({}),
    offline: wallCommentOfflineInitialState,
  });