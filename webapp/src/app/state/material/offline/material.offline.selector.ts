import { createSelector } from '@ngrx/store';
import { OfflineRequestType } from 'src/app/state/shared/offline/offline.state';
import { MaterialSelectors } from '../material.selector';
import { materialOfflineDeletedAdapter } from './material.offline.state';
import { FileState } from 'src/app/models/file-uploaded.model';

const offlineStateSelector = createSelector(
  MaterialSelectors.state,
  (state) => state.offline
);

const selectCreatedState = createSelector(
  offlineStateSelector,
  (state) => state.created
);
const selectCreatedIds = createSelector(
  selectCreatedState,
  (state) => state.ids as number[]
);

const selectCreatedIdsAndGroups = createSelector(
  selectCreatedState,
  selectCreatedIds,
  (state, ids) => ids.map(id => state.entities[id])
);

const selectRequestedState = createSelector(
  offlineStateSelector,
  (state) => state.requested
);

const selectRequestedGroups = createSelector(
  selectRequestedState,
  (state) => state.groupIds
);

const selectUpdatedState = createSelector(
  offlineStateSelector,
  (state) => state.updated
);



const selectUpdatedIds = createSelector(
  selectUpdatedState,
  (state) => (<number[]>state.ids) ?? []
)

const selectUpdatedCount = createSelector(
  selectUpdatedIds,
  (ids) => ids.length
)

const selectUpdatedList = createSelector(
  selectUpdatedState,
  selectUpdatedIds,
  (state, ids) => ids?.map(id => state.entities[id]) ?? []
)

const selectDeletedState = createSelector(
  offlineStateSelector,
  (state) => state.deleted
);

const selectDeletedIds = createSelector(
  selectDeletedState,
  materialOfflineDeletedAdapter.getSelectors().selectIds,
);

const selectDeletedIdsAndGroupsIds = createSelector(
  selectDeletedState,
  selectDeletedIds,
  (state, ids) => (<number[]>ids).map(id => state.entities[id])
)


const selectDeletedEntities = createSelector(
  selectDeletedState,
  materialOfflineDeletedAdapter.getSelectors().selectEntities
);

const selectDeletedById = (id: number) => createSelector(
  selectDeletedEntities,
  (entities) => id ? entities[id] : null
);

const selectCountCreated = createSelector(
  selectCreatedState,
  (createdState) => createdState.ids ? createdState.ids.length : 0
);

const selectCountGroupIdsRequested = createSelector(
  selectRequestedGroups,
  (ids) => ids.length ?? 0
);

const selectCountRequested = createSelector(
  selectCountGroupIdsRequested,
  a => a
);

const selectCountDeleted = createSelector(
  selectDeletedState,
  (deletedState) => deletedState.ids ? deletedState.ids.length : 0
);

const selectNextAction = createSelector(
  selectCountCreated,
  selectCountRequested,
  selectUpdatedCount,
  selectCountDeleted,
  (created, requested, updated, deleted) =>
    created > 0 ? OfflineRequestType.Created :
      requested > 0 ? OfflineRequestType.Requested :
        updated > 0 ? OfflineRequestType.Updated :
          deleted > 0 ? OfflineRequestType.Deleted :
            OfflineRequestType.None
);

// Só funciona se estiver dentro do array selectors em CoursesService.getHasToSyncStream()
const selectHasToSync = createSelector(
  selectCountCreated,
  selectUpdatedCount,
  selectCountDeleted,
  (created, updated, deleted) => (created + updated + deleted > 0)
);

// Verifica se o material precisa ser sincronizado, retornando este status.
const materialSyncState = (materialId: number) => createSelector(
  selectDeletedIds,
  selectCreatedIds,
  selectUpdatedIds,
  (deletedIds, createdIds, updatedIds): FileState => {
    if((<number[]>deletedIds).includes(materialId)) return 'NeedsToBeDeleted'  as FileState;
    if((<number[]>createdIds).includes(materialId)) return 'NeedsToBeUploaded' as FileState;
    if((<number[]>updatedIds).includes(materialId)) return 'NeedsToBeUploaded' as FileState;
    return null;
  }
);


export const MaterialOfflineSelectors = {
  state: offlineStateSelector,
  nextAction: selectNextAction,
  hasToSync: selectHasToSync,
  materialSyncState: materialSyncState,
  created: {
    state: selectCreatedState,
    ids: selectCreatedIdsAndGroups,
    count: selectCountCreated,
  },
  requested: {
    state: selectRequestedState,
    groups: selectRequestedGroups,
    count: selectCountRequested,
    countGroupIds: selectCountGroupIdsRequested,
  },
  updated: {
    state: selectUpdatedState,
    count: selectUpdatedCount,
    ids: selectUpdatedList
  },
  deleted: {
    state: selectDeletedState,
    ids: selectDeletedIdsAndGroupsIds,
    byId: selectDeletedById,
    count: selectCountDeleted,
  },
};
