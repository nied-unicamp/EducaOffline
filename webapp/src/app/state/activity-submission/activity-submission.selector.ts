import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { activitySubmissionAdapter as adapter, ActivitySubmissionState as State } from './activity-submission.state';

// Feature selector
const selectActivitySubmissionState = createFeatureSelector<State>('activitySubmissions');



// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectActivitySubmissionIds = createSelector(
  selectActivitySubmissionState,
  selectIds
);
const selectActivitySubmissionEntities = createSelector(
  selectActivitySubmissionState,
  selectEntities
);
const selectAllActivities = createSelector(
  selectActivitySubmissionState,
  selectAll
);
const selectActivitySubmissionTotal = createSelector(
  selectActivitySubmissionState,
  selectTotal
);



const selectById = (id: number) => createSelector(
  selectActivitySubmissionEntities,
  (entities) => id ? entities[id] : null
);


const selectMetadataState = createSelector<any,[State],MetadataState<number>>(
  selectActivitySubmissionState,
  (state) => state.metadata
);

const selectMetadata = MetadataSelectors(selectMetadataState);


export const ActivitySubmissionSelectors = {
  byId: selectById,
  basic: {
    state: selectActivitySubmissionState,
    ids: selectActivitySubmissionIds,
    entities: selectActivitySubmissionEntities,
    all: selectAllActivities,
    total: selectActivitySubmissionTotal,
  },
  metadata: selectMetadata,
};
