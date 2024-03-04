import { EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FileState, FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { fileUploadedAdapter as adapter, FileUploadedState as State, getFileId } from './file-uploaded.state';

// Feature selector
const selectFileState = createFeatureSelector<State>('fileUploaded');

//#region Basic Selectors


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectFilesIds = createSelector(
  selectFileState,
  selectIds as (state: EntityState<FileUploadedSM>) => string[]
);
const selectFilesEntities = createSelector(
  selectFileState,
  selectEntities
);
const selectAllFiles = createSelector(
  selectFileState,
  selectAll
);
const selectFilesTotal = createSelector(
  selectFileState,
  selectTotal
);
//#endregion

const selectById = (id: string) => createSelector(
  selectFilesEntities,
  (entities) => id ? entities[id] : null
);

const selectCurrentlyState = createSelector(
  selectFileState,
  (state) => state.currently
)

const selectIdsOnQueue = createSelector(
  selectFileState,
  (state) => state.currently?.onQueue ?? []
)

const selectItemsOnQueue = createSelector(
  selectIdsOnQueue,
  selectFilesEntities,
  (ids, entities) => ids?.map(id => entities?.[id]) ?? []
)

const selectIdsSynchronizing = createSelector(
  selectFileState,
  (state) => state.currently?.synchronizing ?? []
)

const selectNextIdToSync = createSelector(
  selectItemsOnQueue,
  selectIdsSynchronizing,
  (queue, synchronizing) => {
    // Define a max of items syncing at the same time and when there is no new item
    if (synchronizing.length >= 3 || !queue?.length) {
      return undefined
    }

    // Prioritize files to upload
    const toUpload = queue.find(item => item.status.currently == FileState.NeedsToBeUploaded)
    const next = toUpload ?? queue[0]

    return getFileId(next)
  }
)

const selectManualRetry = createSelector(
  selectFileState,
  (state) => state.currently?.manualRetry ?? []
)

//#endregion

//#endregion ****************************************************** *************************************************

export const FileUploadedSelectors = {
  state: selectFileState,
  byId: selectById,
  byCourseId: {
    ids: null,
    all: null
  },
  currently: {
    state: selectCurrentlyState,
    onQueue: selectIdsOnQueue,
    next: selectNextIdToSync,
    synchronizing: selectIdsSynchronizing,
    retryManually: selectManualRetry
  },
  basic: {
    state: selectFileState,
    ids: selectFilesIds,
    entities: selectFilesEntities,
    all: selectAllFiles,
    total: selectFilesTotal,
  },
};
