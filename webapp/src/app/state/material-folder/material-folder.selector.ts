import { createFeatureSelector, createSelector } from "@ngrx/store";
import { folderAdapter as adapter, MaterialFolderState as State } from './material-folder.state';
import { MetadataSelectors, MetadataState } from "../shared/metadata/metadata";
import { GroupSelectors, GroupState } from "../shared/group/group";
import { CourseSelectors } from "../course/course.selector";

// Feature selector
const selectFolderState = createFeatureSelector<State>('folders');

//#region Basic Selectors


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectFolderIds = createSelector(
  selectFolderState,
  selectIds
);
const selectFolderEntities = createSelector(
  selectFolderState,
  selectEntities
);
const selectAllFolders = createSelector(
  selectFolderState,
  selectAll
);
const selectFolderTotal = createSelector(
  selectFolderState,
  selectTotal
);
//#endregion

const selectById = (id: number) => createSelector(
  selectFolderEntities,
  (entities) => id ? entities[id] : null
);

//#region Metadata Selectors

const selectMetadataState = createSelector<any, [State], MetadataState<number>>(
  selectFolderState,
  (state) => state.metadata
);

const selectMetadata = MetadataSelectors(selectMetadataState);
//#endregion

//#region ***************************************** Group Selectors *************************************************

const selectGroupsState = createSelector<any, [State], GroupState>(
  selectFolderState,
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
  selectFolderEntities,
  (ids, folders) => ids ? ids.map(id => folders[id]) : null
);
//#endregion

//#region Selectors by Course Id
const selectIdsByGroupId = (groupId: number) => createSelector(
  selectGroup.byId(groupId),
  (group) => group ? group.items : null
);

const selectItemsByGroupId = (groupId: number) => createSelector(
  selectIdsByGroupId(groupId),
  selectFolderEntities,
  (ids, entities) => ids ? ids.map(id => entities[id]) : null
);
//#endregion

//#endregion ****************************************************** *************************************************

export const MaterialFolderSelectors = {
  state: selectFolderState,
  byId: selectById,
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
  basic: {
    state: selectFolderState,
    ids: selectFolderIds,
    entities: selectFolderEntities,
    all: selectAllFolders,
    total: selectFolderTotal,
  },
  metadata: selectMetadata
};
