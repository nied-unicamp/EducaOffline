import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActivitySelectors } from '../activity/activity.selector';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { gradesInfoAdapter as adapter, GradesInfoState as State } from './grades-info.state';

// Feature selector
const selectGradesInfoState = createFeatureSelector<State>('gradesInfos');



// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectGradesInfoIds = createSelector(
  selectGradesInfoState,
  selectIds
);
const selectGradesInfoEntities = createSelector(
  selectGradesInfoState,
  selectEntities
);
const selectAllActivities = createSelector(
  selectGradesInfoState,
  selectAll
);
const selectGradesInfoTotal = createSelector(
  selectGradesInfoState,
  selectTotal
);



const selectById = (id: number) => createSelector(
  selectGradesInfoEntities,
  (entities) => id ? entities[id] : null
);

const selectByCourseId = (courseId: number) => createSelector(
  ActivitySelectors.byCourse.id.ids(courseId),
  selectGradesInfoEntities,
  (ids, entities) => ids?.map(id => entities?.[id]).filter(item => !!item) ?? []
);


const selectMetadataState = createSelector<any,[State],MetadataState<number>>(
  selectGradesInfoState,
  (state) => state.metadata
);

const selectMetadata = MetadataSelectors(selectMetadataState);


export const GradesInfoSelectors = {
  byId: selectById,
  byCourseId: selectByCourseId,
  basic: {
    state: selectGradesInfoState,
    ids: selectGradesInfoIds,
    entities: selectGradesInfoEntities,
    all: selectAllActivities,
    total: selectGradesInfoTotal,
  },
  metadata: selectMetadata,
};
