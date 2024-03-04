import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { gradesFinalAdapter as adapter, GradesFinalState as State } from './grades-final.state';

const selectGradesFinalState = createFeatureSelector<State>('gradesFinals');


const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectGradesFinalIds = createSelector(
  selectGradesFinalState,
  selectIds
);
const selectGradesFinalEntities = createSelector(
  selectGradesFinalState,
  selectEntities
);
const selectAllGradesFinals = createSelector(
  selectGradesFinalState,
  selectAll
);
const selectGradesFinalTotal = createSelector(
  selectGradesFinalState,
  selectTotal
);

const selectById = (id: string) => createSelector(
  selectGradesFinalEntities,
  (entities) => id ? entities[id] : null
);

const selectMetadataState = createSelector<any,[State],MetadataState<string>>(
  selectGradesFinalState,
  (state) => state.metadata
);
const selectMetadata = MetadataSelectors(selectMetadataState);


const selectFinalsByGradesId = (courseId: number) => createSelector(
  selectAllGradesFinals,
  (finals) => finals.filter(item => item.courseId === courseId) ?? []
);

const selectFinalsByUserId = (userId: number) => createSelector(
  selectAllGradesFinals,
  (finals) => finals?.filter(final => final.userId == userId) ?? []
);

const selectFinalByCourseIdAndUserId = ({ courseId, userId }: { courseId: number; userId: number; }) => createSelector(
  selectGradesFinalEntities,
  (finals) => finals[`${courseId}/${userId}`] ?? undefined
);

export const GradesFinalSelectors = {
  byId: selectById,
  byCourseId: selectFinalsByGradesId,
  byUserId: selectFinalsByUserId,
  byCourseIdAndUserId: selectFinalByCourseIdAndUserId,

  basic: {
    state: selectGradesFinalState,
    ids: selectGradesFinalIds,
    entities: selectGradesFinalEntities,
    all: selectAllGradesFinals,
    total: selectGradesFinalTotal,
  },
  metadata: selectMetadata,
};
