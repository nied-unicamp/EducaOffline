import { createSelector } from "@ngrx/store";
import { UserSelectors } from "../user.selector";
import { OfflineRequestType } from "../../shared/offline/offline.state";

const offlineStateSelector = createSelector(
    UserSelectors.state,
    (state) => state.offline
);

const selectUpdatedState = createSelector(
    offlineStateSelector,
    (state) => state.updated
  );

const selectUpdatedIds = createSelector(
    selectUpdatedState,
    (state) => (<number[]>state.ids) ?? []
);

const selectUpdatedCount = createSelector(
    selectUpdatedIds,
    (ids) => ids.length
);

const selectNextAction = createSelector(
    selectUpdatedCount,
    (updated) =>
        updated > 0 ? OfflineRequestType.Updated :
            OfflineRequestType.None
);

export const userOfflineSelectors = {
    state: offlineStateSelector,
    nextAction: selectNextAction,
    updated: {
        ids: selectUpdatedIds,
        state: selectUpdatedState
    }
}