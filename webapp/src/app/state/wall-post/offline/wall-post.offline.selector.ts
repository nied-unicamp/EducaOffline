import { createSelector } from '@ngrx/store';
import { OfflineRequestType } from 'src/app/state/shared/offline/offline.state';
import { WallPostSelectors } from 'src/app/state/wall-post/wall-post.selector';
import { wallPostOfflineDeletedAdapter } from './wall-post.offline.state';

const offlineStateSelector = createSelector(
  WallPostSelectors.state,
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

const selectRequestedIds = createSelector(
  selectRequestedState,
  (state) => state.ids.ids as number[]
);

const selectRequestedIdsAndGroups = createSelector(
  offlineStateSelector,
  selectRequestedIds,
  (state, ids) => ids.map(id => state[id])
);


const selectUpdatedState = createSelector(
  offlineStateSelector,
  (state) => state.updated
)

const selectUpdatedLikeState = createSelector(
  selectUpdatedState,
  (state) => state.like
)


const selectUpdatedLikeIds = createSelector(
  selectUpdatedLikeState,
  (state) => (<number[]>state.ids) ?? []
)

const selectUpdatedLikeCount = createSelector(
  selectUpdatedLikeIds,
  (ids) => ids.length
)

const selectUpdatedLikeList = createSelector(
  selectUpdatedLikeState,
  selectUpdatedLikeIds,
  (state, ids) => ids?.map(id => state.entities[id]) ?? []
)

const selectUpdatedPinState = createSelector(
  selectUpdatedState,
  (state) => state.pin
)

const selectUpdatedPinIdsState = createSelector(
  selectUpdatedPinState,
  (state) => state.ids
)

const selectUpdatedPinIdsIdList = createSelector(
  selectUpdatedPinIdsState,
  (state) => (<number[]>state.ids) ?? []
)

const selectUpdatedPinIdsIdCount = createSelector(
  selectUpdatedPinIdsIdList,
  (ids) => ids.length
)

const selectUpdatedPinIdsList = createSelector(
  selectUpdatedPinIdsState,
  selectUpdatedPinIdsIdList,
  (state, ids) => ids?.map(id => state.entities[id]) ?? []
)

const selectUpdatedPinIndirectState = createSelector(
  selectUpdatedPinState,
  (state) => state.indirectChanges
)

const selectUpdatedPinIndirectIdList = createSelector(
  selectUpdatedPinIndirectState,
  (state) => (<number[]>state.ids) ?? []
)

const selectUpdatedPinIndirectIdCount = createSelector(
  selectUpdatedPinIndirectIdList,
  (ids) => ids.length
)

const selectUpdatedPinIndirectList = createSelector(
  selectUpdatedPinIdsState,
  selectUpdatedPinIndirectIdList,
  (state, ids) => ids?.map(id => state.entities[id]) ?? []
)

const selectUpdatedCount = createSelector(
  selectUpdatedLikeCount,
  selectUpdatedPinIdsIdCount,
  (likes, ids) => likes + ids
)

const selectDeletedState = createSelector(
  offlineStateSelector,
  (state) => state.deleted
);

const selectDeletedIds = createSelector(
  selectDeletedState,
  wallPostOfflineDeletedAdapter.getSelectors().selectIds,
);

const selectDeletedIdsAndGroupsIds = createSelector(
  selectDeletedState,
  selectDeletedIds,
  (state, ids) => (<number[]>ids).map(id => state.entities[id])
)

const selectDeletedEntities = createSelector(
  selectDeletedState,
  wallPostOfflineDeletedAdapter.getSelectors().selectEntities
);

const selectDeletedById = (id: number) => createSelector(
  selectDeletedEntities,
  (entities) => id ? entities[id] : null
);

const selectCountCreated = createSelector(
  selectCreatedState,
  (createdState) => createdState.ids ? createdState.ids.length : 0
);

const selectCountIdsRequested = createSelector(
  selectRequestedIds,
  (ids) => ids.length ?? 0
);

const selectCountGroupIdsRequested = createSelector(
  selectRequestedGroups,
  (ids) => ids.length ?? 0
);

const selectCountRequested = createSelector(
  selectCountIdsRequested,
  selectCountGroupIdsRequested,
  (a, b) => a + b
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
  selectUpdatedLikeCount,
  selectCountDeleted,
  (created, updated, deleted) => (created + updated + deleted > 0)
);


export const WallPostOfflineSelectors = {
  state: offlineStateSelector,
  nextAction: selectNextAction,
  hasToSync: selectHasToSync,
  created: {
    state: selectCreatedState,
    ids: selectCreatedIdsAndGroups,
    count: selectCountCreated,
  },
  requested: {
    state: selectRequestedState,
    ids: selectRequestedIdsAndGroups,
    groups: selectRequestedGroups,
    count: selectCountRequested,
    countIds: selectCountRequested,
    countGroupIds: selectCountGroupIdsRequested,
  },
  updated: {
    state: selectUpdatedState,
    count: selectUpdatedCount,
    like: {
      state: selectUpdatedLikeState,
      ids: selectUpdatedLikeList,
      count: selectUpdatedLikeCount,
    },
    pin: {
      state: selectUpdatedPinState,
      ids: {
        state: selectUpdatedPinIdsState,
        list: selectUpdatedPinIdsList,
        count: selectUpdatedPinIdsIdCount,
      },
      indirect: {
        state: selectUpdatedPinIndirectState,
        list: selectUpdatedPinIndirectList,
        count: selectUpdatedPinIndirectIdCount,
      }
    }
  },
  deleted: {
    state: selectDeletedState,
    ids: selectDeletedIdsAndGroupsIds,
    byId: selectDeletedById,
    count: selectCountDeleted,
  },
};
