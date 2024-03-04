import { createSelector } from '@ngrx/store';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { OfflineRequestType } from 'src/app/state/shared/offline/offline.state';
import { courseOfflineDeletedAdapter, courseOfflineUpdatedAdapter } from './course.offline.state';

const offlineStateSelector = createSelector(
  CourseSelectors.state,
  (state) => state.offline
);

const selectCreatedState = createSelector(
  offlineStateSelector,
  (state) => state.created
);
const selectCreatedIds = createSelector(
  selectCreatedState,
  (state) => state.ids
);

const selectRequestedState = createSelector(
  offlineStateSelector,
  (state) => state.requested
);

const selectRequestedRequestedAll = createSelector(
  selectRequestedState,
  (state) => state.all
);

const selectRequestedIds = createSelector(
  selectRequestedState,
  (state) => state.ids
);

const selectUpdatedState = createSelector(
  offlineStateSelector,
  (state) => state.updated
);

const selectUpdatedIds = createSelector(
  selectUpdatedState,
  courseOfflineUpdatedAdapter.getSelectors().selectIds
);

const selectUpdatedEntities = createSelector(
  selectUpdatedState,
  courseOfflineUpdatedAdapter.getSelectors().selectEntities
);

const selectUpdatedById = (id: number) => createSelector(
  selectUpdatedEntities,
  (entities) => id ? entities[id] : null
);

const selectDeletedState = createSelector(
  offlineStateSelector,
  (state) => state.deleted
);

const selectDeletedIds = createSelector(
  selectDeletedState,
  courseOfflineDeletedAdapter.getSelectors().selectIds,
);

const selectDeletedEntities = createSelector(
  selectDeletedState,
  courseOfflineDeletedAdapter.getSelectors().selectEntities
);

const selectDeletedById = (id: number) => createSelector(
  selectDeletedEntities,
  (entities) => id ? entities[id] : null
);

const selectCountCreated = createSelector(
  selectCreatedState,
  (createdState) => createdState.ids ? createdState.ids.length : 0
);

const selectCountRequested = createSelector(
  selectRequestedState,
  (requestedState) => requestedState.ids ? requestedState.ids.length : 0
);

const selectCountUpdated = createSelector(
  selectUpdatedState,
  (updatedState) => updatedState.ids ? updatedState.ids.length : 0
);

const selectCountDeleted = createSelector(
  selectDeletedState,
  (deletedState) => deletedState.ids ? deletedState.ids.length : 0
);

const selectNextAction = createSelector(
  selectCountCreated,
  selectCountRequested,
  selectCountUpdated,
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
  selectCountUpdated,
  selectCountDeleted,
  (created, updated, deleted) => (created + updated + deleted > 0)
);


export const CourseOfflineSelectors = {
  state: offlineStateSelector,
  nextAction: selectNextAction,
  hasToSync: selectHasToSync,
  created: {
    state: selectCreatedState,
    ids: selectCreatedIds,
    count: selectCountCreated,
  },
  requested: {
    state: selectRequestedState,
    ids: selectRequestedIds,
    requestedAll: selectRequestedRequestedAll,
    count: selectCountRequested,
  },
  updated: {
    ids: selectUpdatedIds,
    byId: selectUpdatedById,
    state: selectUpdatedState,
    count: selectCountUpdated,
  },
  deleted: {
    state: selectDeletedState,
    ids: selectDeletedIds,
    byId: selectDeletedById,
    count: selectCountDeleted,
  },
};
