import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourseSelectors } from '../course/course.selector';
import { GroupSelectors, GroupState } from '../shared/group/group';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { activityAdapter as adapter, ActivityState as State } from './activity.state';
import { ActivitySM } from 'src/app/models/activity.model';

// Feature selector
const selectActivityState = createFeatureSelector<State>('activities');

//#region Basic Selectors


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectActivityIds = createSelector(
  selectActivityState,
  selectIds
);
const selectActivityEntities = createSelector(
  selectActivityState,
  selectEntities
);
const selectAllActivities = createSelector(
  selectActivityState,
  selectAll
);
const selectActivityTotal = createSelector(
  selectActivityState,
  selectTotal
);
//#endregion


//#region Basic current entity Selectors
// Get current Id
const selectCurrentActivityId = createSelector(
  selectActivityState,
  (state: State) => state.selectedActivityId
);

// Get current
const selectCurrentActivity = createSelector(
  selectActivityEntities,
  selectCurrentActivityId,
  (activityEntities, activityId) => activityEntities[activityId]
);
//#endregion

const selectById = (id: number) => createSelector(
  selectActivityEntities,
  (entities) => id ? entities[id] : null
);

const selectByIds = (ids: number[]) => createSelector(
  selectActivityEntities,
  (entities) => ids.map(id => entities[id]) ?? []
);

//#region Metadata Selectors

const selectMetadataState = createSelector<any,[State],MetadataState<number>>(
  selectActivityState,
  (state) => state.metadata
);

const selectMetadata = MetadataSelectors(selectMetadataState);

const selectCurrentMetadata = createSelector(
  selectCurrentActivityId,
  selectMetadata.entities,
  (id, entities) => id ? entities[id] : null
);
//#endregion


//#region ***************************************** Group Selectors *************************************************

const selectGroupsState = createSelector<any,[State],GroupState>(
  selectActivityState,
  (state) => state.groups
);

const selectGroup = GroupSelectors(selectGroupsState);

//#region Selectors by Current course
const selectCurrentGroupItemIds = createSelector(
  CourseSelectors.currentId,
  selectGroup.entities,
  (id, groupEntities) => id ? groupEntities[id] ? groupEntities[id].items : null : null
);

const selectInCurrentGroup = createSelector(
  selectCurrentGroupItemIds,
  selectActivityEntities,
  (ids, activities) => ids ? ids.map(id => activities[id]) : null
);
//#endregion

//#region Selectors by Course Id
const selectIdsByGroupId = (groupId: number) => createSelector(
  selectGroup.byId(groupId),
  (group) => group ? group.items : null
);

const selectItemsByGroupId = (groupId: number) => createSelector(
  selectActivityEntities,
  selectIdsByGroupId(groupId),
  (entities, ids) => ids ? ids.map(id => entities[id]) : []
);

const selectFilter = createSelector(
  selectActivityState,
  (state: State) => state.filter
);

const selectFiles = (id: number) => createSelector(
  selectById(id),
  (activity: ActivitySM) => activity?.files?.length ?? 0
)

//#endregion

//#endregion ****************************************************** *************************************************

export const ActivitySelectors = {
  byId: selectById,
  byIds: selectByIds,
  filter: selectFilter,
  byCourse: {
    current: {
      ids: selectCurrentGroupItemIds,
      all: selectInCurrentGroup
    },
    id: {
      ids: selectIdsByGroupId,
      all: selectItemsByGroupId
    }
  },
  current: {
    id: selectCurrentActivityId,
    entity: selectCurrentActivity,
    metadata: selectCurrentMetadata,
  },
  basic: {
    state: selectActivityState,
    ids: selectActivityIds,
    entities: selectActivityEntities,
    all: selectAllActivities,
    total: selectActivityTotal,
  },
  files: selectFiles,
  group: selectGroup,
  metadata: selectMetadata,
};
