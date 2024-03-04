import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SyncAdapter as adapter, SyncState as State } from './sync.state';


//#region Selectors

// Feature selector
const selectSyncState = createFeatureSelector<State>('syncs');


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// Id selector
const getSelectedSyncId = (state: State) => state.selectedSyncId;


// Composed selectors
const selectSyncIds = createSelector(
  selectSyncState,
  selectIds
);
const selectSyncEntities = createSelector(
  selectSyncState,
  selectEntities
);
const selectAllSyncs = createSelector(
  selectSyncState,
  selectAll
);
const selectSyncTotal = createSelector(
  selectSyncState,
  selectTotal
);

const selectLoadingCurrent = createSelector(
  selectSyncState,
  state => state.load.loading ?? []
)

const selectLoadingError = createSelector(
  selectSyncState,
  state => state.load.error ?? []
)

const selectIsLoading = createSelector(
  selectLoadingCurrent,
  current => current?.length > 0
)

const selectToSave = createSelector(
  selectSyncState,
  state => state.toSave ?? []
)

//#endregion

export const SyncSelectors = {
  state: selectSyncState,
  ids: selectSyncIds,
  entities: selectSyncEntities,
  all: selectAllSyncs,
  total: selectSyncTotal,
  load: {
    pending: selectIsLoading,
    loading: selectLoadingCurrent,
    error: selectLoadingError,
  },
  toSave: selectToSave
};
