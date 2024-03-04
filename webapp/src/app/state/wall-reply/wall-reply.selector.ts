import { createFeatureSelector, createSelector } from '@ngrx/store';

import { GroupSelectors, GroupState } from '../shared/group/group';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { WallPostSelectors } from '../wall-post/wall-post.selector';
import { wallReplyAdapter as adapter, WallReplyState as StateReply } from '../wall-reply/wall-reply.state';

// Feature selector
const selectWallReplyState = createFeatureSelector<StateReply>('wallReplies');
//#region Basic Selectors

// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectWallRepliesIds = createSelector(
  selectWallReplyState,
  selectIds
);
const selectWallRepliesEntities = createSelector(
  selectWallReplyState,
  selectEntities
);
const selectAllWallReplies = createSelector(
  selectWallReplyState,
  selectAll
);
const selectWallRepliesTotal = createSelector(
  selectWallReplyState,
  selectTotal
);

//#endregion
const selectWallRepliesByParentCommentId = (parentCommentId: number) => createSelector(
  selectAllWallReplies,
  (replies) => replies.filter(reply => reply.parentCommentId == parentCommentId)
)

const selectById = (id: number) => createSelector(
    selectWallRepliesEntities,
    (entities) => id ? entities[id] : null
);

//#region Metadata Selectors

const selectMetadataState = createSelector<any,[StateReply],MetadataState<number>>(
    selectWallReplyState,
    (state) => state.metadata
  );
  
const selectMetadata = MetadataSelectors(selectMetadataState);
//#endregion


//#region ***************************************** Group Selectors *************************************************

const selectGroupsState = createSelector<any,[StateReply],GroupState>(
selectWallReplyState,
(state) => state?.groups
);

const selectGroup = GroupSelectors(selectGroupsState);

//#region Selectors by Current course
const selectCurrentGroupItemIds = createSelector(
WallPostSelectors.current.id,
selectGroup.entities,
(id, groupEntities) => groupEntities[id]?.items ?? []
);

const selectInCurrentGroup = createSelector(
selectCurrentGroupItemIds,
selectWallRepliesEntities,
(ids, wallReplies) => ids?.map(id => wallReplies[id]) ?? []
);
  
//#endregion

//#region Selectors by group Id
const selectIdsByGroupId = (groupId: number) => createSelector(
selectGroup.byId(groupId),
(group) => group?.items ?? []
);

const selectItemsByGroupId = (groupId: number) => createSelector(
selectIdsByGroupId(groupId),
selectWallRepliesEntities,
(ids, entities) => ids?.filter(id => id > 0).map(id => entities[id]) ?? []
);
//#endregion
  
//#endregion ****************************************************** *************************************************
  
  
export const selectRepliesByCommentId = (commentId: number) =>
  createSelector(
    selectAllWallReplies,
    replies => replies.filter(reply => reply.parentCommentId === commentId)
);



export const WallReplySelectors = {
    byId: selectById,
    // byPost: {
    //     current: {
    //     ids: selectCurrentGroupItemIds,
    //     all: selectInCurrentGroup,
    //     },
    //     id: {
    //     ids: selectIdsByGroupId,
    //     all: selectItemsByGroupId,
    //     },
    // },
    byParentCommentId: selectWallRepliesByParentCommentId,
    byComment: {
      current: {
        ids: selectCurrentGroupItemIds,
        all: selectInCurrentGroup,
      },
      id: {
        ids: selectIdsByGroupId,
        all: selectItemsByGroupId,
      },
  },
    basic: {
        state: selectWallReplyState,
        ids: selectWallRepliesIds,
        entities: selectWallRepliesEntities,
        all: selectAllWallReplies,
        total: selectWallRepliesTotal,
    },
    group: selectGroup,
    metadata: selectMetadata,
    state: selectWallReplyState
};