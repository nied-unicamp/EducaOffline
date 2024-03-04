import { createSelector } from '@ngrx/store';
import { OfflineRequestType } from 'src/app/state/shared/offline/offline.state';
import { ActivityItemSelectors } from '../activity-item.selector';

const offlineStateSelector = createSelector(
  ActivityItemSelectors.basic.state,
  (state) => state.offline
);

const selectRequestedState = createSelector(
  offlineStateSelector,
  (state) => state.requested
);

const selectRequestedGroups = createSelector(
  selectRequestedState,
  (state) => state.groupIds
);

const selectCountGroupIdsRequested = createSelector(
    selectRequestedGroups,
    (ids) => ids.length ?? 0
  );

const selectCountRequested = createSelector(
  selectCountGroupIdsRequested,
  a => a
);

const selectNextAction = createSelector(
  selectCountRequested,
  (requested) =>
    requested > 0 ? OfflineRequestType.Created :
        OfflineRequestType.None
);


export const ActivityItemOfflineSelectors = {
  state: offlineStateSelector,
  nextAction: selectNextAction,
  requested: {
    state: selectRequestedState,
    groups: selectRequestedGroups,
    count: selectCountRequested,
    countGroupIds: selectCountGroupIdsRequested,
  }
};
