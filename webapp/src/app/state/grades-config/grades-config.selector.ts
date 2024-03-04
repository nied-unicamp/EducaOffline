import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { gradesConfigAdapter as adapter, GradesConfigState as State } from './grades-config.state';

// Feature selector
const selectGradesConfigState = createFeatureSelector<State>('gradesConfigs');



// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectGradesConfigIds = createSelector(
  selectGradesConfigState,
  selectIds
);
const selectGradesConfigEntities = createSelector(
  selectGradesConfigState,
  selectEntities
);
const selectAllActivities = createSelector(
  selectGradesConfigState,
  selectAll
);
const selectGradesConfigTotal = createSelector(
  selectGradesConfigState,
  selectTotal
);


const selectByCourseId = (id: number) => createSelector(
  selectAllActivities,
  (list) => list.find(item => item.courseId == id)
);


const selectMetadataState = createSelector<any,[State],MetadataState<number>>(
  selectGradesConfigState,
  (state) => state.metadata
);

const selectMetadata = MetadataSelectors(selectMetadataState);


export const GradesConfigSelectors = {
  byCourseId: selectByCourseId,
  basic: {
    state: selectGradesConfigState,
    ids: selectGradesConfigIds,
    entities: selectGradesConfigEntities,
    all: selectAllActivities,
    total: selectGradesConfigTotal,
  },
  metadata: selectMetadata,
};
