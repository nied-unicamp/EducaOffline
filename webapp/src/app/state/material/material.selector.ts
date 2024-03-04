import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourseSelectors } from '../course/course.selector';
import { GroupSelectors, GroupState } from '../shared/group/group';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { materialAdapter as adapter, MaterialState as State } from './material.state';
import { materialOfflineDeletedAdapter } from './offline/material.offline.state';

// Feature selector
const selectMaterialState = createFeatureSelector<State>('materials');

//#region Basic Selectors


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectMaterialIds = createSelector(
  selectMaterialState,
  selectIds
);
const selectMaterialEntities = createSelector(
  selectMaterialState,
  selectEntities
);
const selectAllMaterials = createSelector(
  selectMaterialState,
  selectAll
);
const selectMaterialTotal = createSelector(
  selectMaterialState,
  selectTotal
);
//#endregion

const selectById = (id: number) => createSelector(
  selectMaterialEntities,
  (entities) => id ? entities[id] : null
);

//#region Metadata Selectors

const selectMetadataState = createSelector<any,[State],MetadataState<number>>(
  selectMaterialState,
  (state) => state.metadata
);

const selectMetadata = MetadataSelectors(selectMetadataState);
//#endregion


//#region ***************************************** Group Selectors *************************************************

const selectGroupsState = createSelector<any,[State],GroupState>(
  selectMaterialState,
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
  selectMaterialEntities,
  (ids, materials) => ids ? ids.map(id => materials[id]) : null
);
//#endregion

//#region Selectors by Course Id
const selectIdsByGroupId = (groupId: number) => createSelector(
  selectGroup.byId(groupId),
  (group) => group ? group.items : null
);

const selectItemsByGroupId = (groupId: number) => createSelector(
  selectIdsByGroupId(groupId),
  selectMaterialEntities,
  (ids, entities) => ids ? ids.map(id => entities[id]) : null
);
//#endregion

//#endregion ****************************************************** *************************************************

// Verifica se há algum material com o campo folder igual ao especificado
const folderHasItems = (folderId: number) => createSelector(
  selectAllMaterials,
  (entities) => entities.some(entity => entity.folder === folderId)
);

// Seletores de apoio para folderHasItemsNotDeleted

const offlineStateSelector = createSelector(
  selectMaterialState,
  (state) => state.offline
);

const selectDeletedState = createSelector(
  offlineStateSelector,
  (state) => state.deleted
);

const selectDeletedIds = createSelector(
  selectDeletedState,
  materialOfflineDeletedAdapter.getSelectors().selectIds,
);

// Verifica se há algum material com o campo folder igual ao especificado, e que não se encontra entre os que serão deletados durante a sincronização
const folderHasItemsNotDeleted = (folderId: number) => createSelector(
  selectAllMaterials,
  selectDeletedIds,
  (entities, deletedIds) =>
    entities.some(entity => (<number[]>deletedIds).includes(entity.id) ? false : entity.folder === folderId)
);

const selectChangingFoldersCount = createSelector(
  selectMaterialState,
  (state) => state.changingFoldersCount
);


export const MaterialSelectors = {
  state: selectMaterialState,
  byId: selectById,
  folderHasItems: folderHasItems,
  folderHasItemsNotDeleted: folderHasItemsNotDeleted,
  selectChangingFoldersCount: selectChangingFoldersCount,
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
    state: selectMaterialState,
    ids: selectMaterialIds,
    entities: selectMaterialEntities,
    all: selectAllMaterials,
    total: selectMaterialTotal,
  },
  group: selectGroup,
  metadata: selectMetadata
};
