import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MetadataSelectors, MetadataState } from '../shared/metadata/metadata';
import { activityItemAdapter as adapter, ActivityItemState as State } from './activity-item.state';

const selectActivityItemState = createFeatureSelector<State>('activityItems');


const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

const selectActivityItemIds = createSelector(
  selectActivityItemState,
  selectIds
);
const selectActivityItemEntities = createSelector(
  selectActivityItemState,
  selectEntities
);
const selectAllActivityItems = createSelector(
  selectActivityItemState,
  selectAll
);
const selectActivityItemTotal = createSelector(
  selectActivityItemState,
  selectTotal
);

const selectById = (id: string) => createSelector(
  selectActivityItemEntities,
  (entities) => id ? entities[id] : null
);

const selectMetadataState = createSelector<any,[State],MetadataState<string>>(
  selectActivityItemState,
  (state) => state.metadata
);
const selectMetadata = MetadataSelectors(selectMetadataState);


const selectItemsByActivityId = (activityId: number) => createSelector(
  selectAllActivityItems,
  (items) => items?.filter(item => item.activityId == activityId) ?? []
);

const selectItemsByUserId = (userId: number) => createSelector(
  selectAllActivityItems,
  (items) => items?.filter(item => item.userId == userId) ?? []
);

const selectItemByActivityIdAndUserId = ({ activityId, userId }: { activityId: number; userId: number; }) => createSelector(
  selectAllActivityItems,
  (items) => items?.find(item => item.userId === userId && item.activityId === activityId) ?? undefined
);

const selectItemByActivityIdAndSubmissionId = ({ activityId, submissionId }: { activityId: number; submissionId: number; }) => createSelector(
  selectAllActivityItems,
  (items) => items?.find(item => item.submissionId === submissionId && item.activityId === activityId) ?? undefined
);

const selectItemByEvaluationId = (evaluationId: number) => createSelector(
  selectAllActivityItems,
  (items) => items?.find(item => item.evaluationId == evaluationId) ?? undefined
)

export const ActivityItemSelectors = {
  byId: selectById,
  byActivityId: selectItemsByActivityId,
  byUserId: selectItemsByUserId,
  byActivityIdAndUserId: selectItemByActivityIdAndUserId,
  byActivityIdAndSubmissionId: selectItemByActivityIdAndSubmissionId,
  byEvaluationId: selectItemByEvaluationId,

  basic: {
    state: selectActivityItemState,
    ids: selectActivityItemIds,
    entities: selectActivityItemEntities,
    all: selectAllActivityItems,
    total: selectActivityItemTotal,
  },
  metadata: selectMetadata,
};
