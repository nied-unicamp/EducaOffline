import { createSelector } from '@ngrx/store';
import { ActivitySubmissionSelectors } from 'src/app/state/activity-submission/activity-submission.selector';
import { OfflineRequestType } from 'src/app/state/shared/offline/offline.state';
import { activitySubmissionOfflineDeletedAdapter, activitySubmissionOfflineFilesCurrentAdapter, activitySubmissionOfflineFilesToDeleteAdapter, activitySubmissionOfflineFilesToUpdateAdapter } from './activity-submission.offline.state';

const offlineStateSelector = createSelector(
  ActivitySubmissionSelectors.basic.state,
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
  (state) => {
    return state.updated
  }
)

const selectUpdatedIds = createSelector(
  selectUpdatedState,
  (state) => (<number[]>state.ids) ?? []

)

const selectUpdatedIdsAndGroups = createSelector(
  selectUpdatedState,
  selectUpdatedIds,
  (state, ids) => ids.map(id => state.entities[id])
)

const selectUpdatedCount = createSelector(
  selectUpdatedIds,
  (ids) => ids.length
)

const selectDeletedState = createSelector(
  offlineStateSelector,
  (state) => state.deleted
);

const selectDeletedIds = createSelector(
  selectDeletedState,
  activitySubmissionOfflineDeletedAdapter.getSelectors().selectIds,
);

const selectDeletedIdsAndGroupsIds = createSelector(
  selectDeletedState,
  selectDeletedIds,
  (state, ids) => (<number[]>ids).map(id => state.entities[id])
)

const selectDeletedEntities = createSelector(
  selectDeletedState,
  activitySubmissionOfflineDeletedAdapter.getSelectors().selectEntities
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

const selectFilesToDeleteState = createSelector(
  offlineStateSelector,
  (state) => state.filesChanged.toDelete
)

const selectFilesToUpdateState = createSelector(
  offlineStateSelector,
  (state) => state.filesChanged.toUpdate
)

const selectFilesToDeleteEntities = createSelector(
  selectFilesToDeleteState,
  activitySubmissionOfflineFilesToDeleteAdapter.getSelectors().selectEntities
)

const selectFilesToUpdateEntities = createSelector(
  selectFilesToUpdateState,
  activitySubmissionOfflineFilesToUpdateAdapter.getSelectors().selectEntities
)

const {
  selectAll
} = activitySubmissionOfflineFilesToDeleteAdapter.getSelectors();

const selectAllFilesToDelete = createSelector(
  selectFilesToDeleteState,
  selectAll
)

const selectFileToUpdateById = (id: number) => createSelector(
  selectFilesToUpdateEntities,
  (entities) => id ? entities[id] : null
)

const selectFilesCurrentState = createSelector(
  offlineStateSelector,
  (state) => state.filesChanged.current
)

const selectFilesCurrentEntities = createSelector(
  selectFilesCurrentState,
  activitySubmissionOfflineFilesCurrentAdapter.getSelectors().selectEntities
)

const selectCurrentFileById = (id: number) => createSelector(
  selectFilesCurrentEntities,
  (entities) => id ? entities[id] : null
)

const selectCurrentFileIds = createSelector(
  selectDeletedState,
  activitySubmissionOfflineDeletedAdapter.getSelectors().selectIds,
);

const selectAllCurrentFiles = createSelector(
  selectCurrentFileIds,
  selectFilesCurrentEntities,
  (ids, entities) => ids ? ids.map(id => entities[id]) : null
)

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


export const ActivitySubmissionOfflineSelectors = {
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
    groups: selectRequestedGroups,
    count: selectCountRequested,
    countIds: selectCountRequested,
    countGroupIds: selectCountGroupIdsRequested,
  },
  updated: {
    ids: selectUpdatedIdsAndGroups,
    state: selectUpdatedState,
    count: selectUpdatedCount
  },
  deleted: {
    state: selectDeletedState,
    ids: selectDeletedIdsAndGroupsIds,
    byId: selectDeletedById,
    count: selectCountDeleted,
  },
  filesChanged: {
    toDelete: {
      all: selectAllFilesToDelete
    },
    toUpdate: {
      byId: selectFileToUpdateById
    },
    current: {
      all: selectAllCurrentFiles
    }
  }
};
