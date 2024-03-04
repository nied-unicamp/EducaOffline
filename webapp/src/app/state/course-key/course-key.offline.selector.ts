import { createSelector } from '@ngrx/store';
import { OfflineRequestType } from '../shared/offline/offline.state';
import { CourseKeySelectors } from './course-key.selector';

const offlineStateSelector = createSelector(
  CourseKeySelectors.state,
  (state) => state.offline
);

const selectRequestedState = createSelector(
  offlineStateSelector,
  (state) => state.requested
);

const selectRequestedKeys = createSelector(
  selectRequestedState,
  (state) => state.keys
);

const selectRequestedCourseIds = createSelector(
  selectRequestedState,
  (state) => state.courseIds
);

const selectCountRequestedKeys = createSelector(
  selectRequestedState,
  (requestedState) => requestedState.keys ? requestedState.keys.length : 0
);

const selectCountRequestedCourseIds = createSelector(
  selectRequestedState,
  (requestedState) => requestedState.courseIds ? requestedState.courseIds.length : 0
);

const selectNextAction = createSelector(
  selectCountRequestedKeys,
  selectCountRequestedCourseIds,
  (keys, courseIds) =>
    keys > 0 || courseIds > 0 ? OfflineRequestType.Requested :
      OfflineRequestType.None
);

export const CourseKeyOfflineSelectors = {
  state: offlineStateSelector,
  nextAction: selectNextAction,
  requested: {
    state: selectRequestedState,
    keys: selectRequestedKeys,
    courseIds: selectRequestedCourseIds,
  },
};
