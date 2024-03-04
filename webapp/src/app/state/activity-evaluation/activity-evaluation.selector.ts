import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { activityEvaluationAdapter as adapter, ActivityEvaluationState as State } from './activity-evaluation.state';

// Feature selector
const selectActivityEvaluationState = createFeatureSelector<State>('activityEvaluations');



// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectActivityEvaluationIds = createSelector(
  selectActivityEvaluationState,
  selectIds
);
const selectActivityEvaluationEntities = createSelector(
  selectActivityEvaluationState,
  selectEntities
);
const selectAllActivities = createSelector(
  selectActivityEvaluationState,
  selectAll
);
const selectActivityEvaluationTotal = createSelector(
  selectActivityEvaluationState,
  selectTotal
);



const selectById = (id: number) => createSelector(
  selectActivityEvaluationEntities,
  (entities) => id ? entities[id] : null
);


const selectMetadataState = createSelector<any,[State],MetadataState<number>>(
  selectActivityEvaluationState,
  (state) => state.metadata
);

const selectMetadata = MetadataSelectors(selectMetadataState);


export const ActivityEvaluationSelectors = {
  byId: selectById,
  basic: {
    state: selectActivityEvaluationState,
    ids: selectActivityEvaluationIds,
    entities: selectActivityEvaluationEntities,
    all: selectAllActivities,
    total: selectActivityEvaluationTotal,
  },
  metadata: selectMetadata,
};
