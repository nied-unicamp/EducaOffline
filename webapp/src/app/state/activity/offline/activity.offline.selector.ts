import { createSelector } from '@ngrx/store';
import { OfflineRequestType } from 'src/app/state/shared/offline/offline.state';
import { ActivitySelectors } from '../activity.selector';
import { activityOfflineDeletedAdapter, activityOfflineFilesToDeleteAdapter } from './activity.offline.state';


const offlineStateSelector = createSelector(
  ActivitySelectors.basic.state,
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
  activityOfflineDeletedAdapter.getSelectors().selectIds,
);

const selectDeletedIdsAndGroupsIds = createSelector(
  selectDeletedState,
  selectDeletedIds,
  (state, ids) => (<number[]>ids).map(id => state.entities[id])
)


const selectDeletedEntities = createSelector(
  selectDeletedState,
  activityOfflineDeletedAdapter.getSelectors().selectEntities
);

const selectDeletedById = (id: number) => createSelector(
  selectDeletedEntities,
  (entities) => id ? entities[id] : null
);


// selectors of FilesToDelete offline state
const selectFilesToDeleteState = createSelector(
  offlineStateSelector,
  (state) => state.filesToDelete
)

const selectFilesToDeleteIds = createSelector(
  selectFilesToDeleteState,
  (state) => state.ids as number[]
);

const selectFilesToDeleteEntities = createSelector(
  selectFilesToDeleteState,
  activityOfflineFilesToDeleteAdapter.getSelectors().selectEntities
);

const selectFilesToDeleteByActivityId = (id: number) => createSelector(
  selectFilesToDeleteEntities,
  (entities) => id ? entities[id] : null
)

const selectGradeReleasedState = createSelector(
  offlineStateSelector,
  (state) => state.gradeReleased
)

const selectGradeReleasedIds = createSelector(
  selectGradeReleasedState,
  (state) => state.ids as number[]
);

const selectCountGradeReleased = createSelector(
  selectGradeReleasedState,
  (gradeReleasedState) => gradeReleasedState.ids ? gradeReleasedState.ids.length : 0
);

const selectGradeReleasedIdsAndGroupsIds = createSelector(
  selectGradeReleasedState,
  selectGradeReleasedIds,
  (state, ids) => (<number[]>ids).map(id => state.entities[id])
)

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
  selectCountGradeReleased,
  (created, requested, updated, deleted, gradeReleased) =>
    created > 0 ? OfflineRequestType.Created :
      requested > 0 ? OfflineRequestType.Requested :
        updated > 0 ? OfflineRequestType.Updated :
          deleted > 0 ? OfflineRequestType.Deleted :
            gradeReleased > 0 ? OfflineRequestType.GradeReleased :
              OfflineRequestType.None
);

// Só funciona se estiver dentro do array selectors em CoursesService.getHasToSyncStream()
const selectHasToSync = createSelector(
  selectCountCreated,
  selectUpdatedCount,
  selectCountDeleted,
  (created, updated, deleted) => (created + updated + deleted > 0)
);


export const ActivityOfflineSelectors = {
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
    countGroupIds: selectCountGroupIdsRequested,
  },
  updated: {
    state: selectUpdatedState,
    count: selectUpdatedCount,
    ids: selectUpdatedList
  },
  deleted: {
    state: selectDeletedState,
    idsAndGroupIds: selectDeletedIdsAndGroupsIds,
    ids: selectDeletedIds,
    byId: selectDeletedById,
    count: selectCountDeleted,
  },
  filesToDelete: {
    byActivityId: selectFilesToDeleteByActivityId
  },
  gradeReleased: {
    idsAndGroupIds: selectGradeReleasedIdsAndGroupsIds
  }
};
