import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourseSelectors } from '../course/course.selector';
import { GroupSelectors, GroupState } from '../shared/group/group';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { wallPostAdapter as adapter, WallPostState as State } from './wall-post.state';

// Feature selector
const selectPostState = createFeatureSelector<State>('wallPosts');

//#region Basic Selectors


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectPostsIds = createSelector(
  selectPostState,
  selectIds
);
const selectPostsEntities = createSelector(
  selectPostState,
  selectEntities
);
const selectAllPosts = createSelector(
  selectPostState,
  selectAll
);
const selectPostsTotal = createSelector(
  selectPostState,
  selectTotal
);
//#endregion


// Get current Id
const selectCurrentPostId = createSelector(
  selectPostState,
  (state: State) => state.selectedId
);

// Get current
const selectCurrentPost = createSelector(
  selectPostsEntities,
  selectCurrentPostId,
  (postEntities, postId) => postEntities[postId]
);


const selectById = (id: number) => createSelector(
  selectPostsEntities,
  (entities) => id ? entities[id] : null
);

//#region Metadata Selectors

const selectMetadataState = createSelector<any,[State],MetadataState<number>>(
  selectPostState,
  (state) => state.metadata
);

const selectMetadata = MetadataSelectors(selectMetadataState);

const selectCurrentMetadata = createSelector(
  selectCurrentPostId,
  selectMetadata.entities,
  (id, entities) => id ? entities[id] : null
);

//#endregion


//#region ***************************************** Group Selectors *************************************************

const selectGroupsState = createSelector<any,[State],GroupState>(
  selectPostState,
  (state) => state.groups
);

const selectGroup = GroupSelectors(selectGroupsState);

//#region Selectors by Current course
const selectAllCurrentGroupItemIds = createSelector(
  CourseSelectors.currentId,
  selectGroup.entities,
  (id, groupEntities) => groupEntities[id]?.items ?? []
);

const selectCurrentGroupItemIds = createSelector(
  selectAllCurrentGroupItemIds,
  (ids) => ids.filter(id => id > 0)
);


const selectInCurrentGroup = createSelector(
  selectCurrentGroupItemIds,
  selectPostsEntities,
  (ids, posts) => ids ? ids.map(id => posts[id]) : null
);
//#endregion

//#region Selectors by Course Id
const selectIdsByGroupId = (groupId: number) => createSelector(
  selectGroup.byId(groupId),
  (group) => group?.items ?? []
);

const selectItemsByGroupId = (groupId: number) => createSelector(
  selectIdsByGroupId(groupId),
  selectPostsEntities,
  (ids, entities) => ids?.map(id => entities[id]) ?? []
);


const selectPinnedByGroupId = (groupId: number) => createSelector(
  selectItemsByGroupId(groupId),
  (items) => items.filter(item => item.id > 0).find(item => item.isFixed)
);

const selectByActivityId = (activityId: number) => createSelector(
  selectInCurrentGroup,
  (posts) => posts.find((post) => post?.activityId == activityId)
)

//#endregion

//#endregion ****************************************************** *************************************************

export const WallPostSelectors = {
  state: selectPostState,
  byId: selectById,
  byActivityId: selectByActivityId,
  byCourse: {
    current: {
      ids: selectCurrentGroupItemIds,
      all: selectInCurrentGroup
    },
    id: {
      ids: selectIdsByGroupId,
      pinned: selectPinnedByGroupId,
      all: selectItemsByGroupId
    }
  },
  current: {
    id: selectCurrentPostId,
    entity: selectCurrentPost,
    metadata: selectCurrentMetadata,
  },
  basic: {
    state: selectPostState,
    ids: selectPostsIds,
    entities: selectPostsEntities,
    all: selectAllPosts,
    total: selectPostsTotal,
  },
  group: selectGroup,
  metadata: selectMetadata
};
