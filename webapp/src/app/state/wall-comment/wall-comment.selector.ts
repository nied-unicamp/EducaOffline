import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupSelectors, GroupState } from '../shared/group/group';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { WallPostSelectors } from '../wall-post/wall-post.selector';
import { wallCommentAdapter as adapter, WallCommentState as State } from './wall-comment.state';


// Feature selector
const selectWallCommentState = createFeatureSelector<State>('wallComments');

//#region Basic Selectors


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectWallCommentsIds = createSelector(
  selectWallCommentState,
  selectIds
);
const selectWallCommentsEntities = createSelector(
  selectWallCommentState,
  selectEntities
);
const selectAllWallComments = createSelector(
  selectWallCommentState,
  selectAll
);
const selectWallCommentsTotal = createSelector(
  selectWallCommentState,
  selectTotal
);
//#endregion



const selectById = (id: number) => createSelector(
  selectWallCommentsEntities,
  (entities) => id ? entities[id] : null
);

//#region Metadata Selectors

const selectMetadataState = createSelector<any,[State],MetadataState<number>>(
  selectWallCommentState,
  (state) => state.metadata
);

const selectMetadata = MetadataSelectors(selectMetadataState);
//#endregion


//#region ***************************************** Group Selectors *************************************************

const selectGroupsState = createSelector<any,[State],GroupState>(
  selectWallCommentState,
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
  selectWallCommentsEntities,
  (ids, wallComments) => ids?.map(id => wallComments[id]) ?? []
);

//#endregion

//#region Selectors by group Id
const selectIdsByGroupId = (groupId: number) => createSelector(
  selectGroup.byId(groupId),
  (group) => group?.items ?? []
);

const selectItemsByGroupId = (groupId: number) => createSelector(
  selectIdsByGroupId(groupId),
  selectWallCommentsEntities,
  (ids, entities) => ids?.filter(id => id > 0).map(id => entities[id]) ?? []
);
//#endregion

//#endregion ****************************************************** *************************************************

export const WallCommentSelectors = {
  byId: selectById,
  byPost: {
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
    state: selectWallCommentState,
    ids: selectWallCommentsIds,
    entities: selectWallCommentsEntities,
    all: selectAllWallComments,
    total: selectWallCommentsTotal,
  },
  group: selectGroup,
  metadata: selectMetadata,
  state: selectWallCommentState
};

