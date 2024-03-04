import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { StateWithOffline } from '../template.state';
import { OfflineRequestType, OfflineState } from './offline.state';

export const OfflineSelectors = <T extends StateWithOffline<T>>
    (offlineStateSelector: MemoizedSelector<any, OfflineState<T>, DefaultProjectorFn<OfflineState<T>>>) => {
    const selectCreatedState = createSelector(
        offlineStateSelector,
        (state) => state.created
    );

    const selectRequestedState = createSelector(
        offlineStateSelector,
        (state) => state.requested
    );

    const selectUpdatedState = createSelector(
        offlineStateSelector,
        (state) => state.updated
    );

    const selectDeletedState = createSelector(
        offlineStateSelector,
        (state) => state.deleted
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

    return {
        state: offlineStateSelector,
        nextAction: selectNextAction,
        created: {
            state: selectCreatedState,
            count: selectCountCreated,
        },
        requested: {
            state: selectRequestedState,
            count: selectCountRequested,
        },
        updated: {
            state: selectUpdatedState,
            count: selectCountUpdated,
        },
        deleted: {
            state: selectDeletedState,
            count: selectCountDeleted,
        },
    };
};

