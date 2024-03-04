import { Action, createReducer, on } from '@ngrx/store';
import { fromArray } from 'src/app/models';
import { ActivityEvaluationSM, fromJsonToActivityEvaluationSM } from 'src/app/models/activity-evaluation.model';
import { GradesFinalActions } from '../grades-final/grades-final.actions';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { ActivityEvaluationActions } from './activity-evaluation.actions';
import { ActivityEvaluationState, activityEvaluationAdapter as adapter, ActivityEvaluationInitialState as initialState, ActivityEvaluationState as State } from './activity-evaluation.state';
import { ActivityItemActions } from '../activity-item/activity-item.actions';
import { GroupModel, groupAdapter, groupAddMany } from '../shared/group/group';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { activityEvaluationOfflineReducer } from './offline/activity-evaluation.offline.reducer';
import { fromJsonToActivitySM } from 'src/app/models/activity.model';

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(GradesFinalActions.getUserOverview.success, (state, { data, input }) => {
    const dataSM: ActivityEvaluationSM[] = fromArray(
      fromJsonToActivityEvaluationSM,
      data.grades.map(grade =>
        grade?.activityEvaluation
      ).filter(item => item?.id)
    );
    const newState = adapter.upsertMany(dataSM, state);

    const newMetadata: Metadata<number>[] = dataSM.map(item => ({ id: item.id, lastUpdate: nowString(), type: MetadataType.Item }));
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivityEvaluationActions.get.success, (state, { data, input: { courseId } }) => {
    const dataSM: ActivityEvaluationSM = fromJsonToActivityEvaluationSM(data);
    const newState = adapter.upsertOne(dataSM, state);

    const newMetadata: Metadata<number> = ({ id: data.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivityEvaluationActions.create.success, (state, { input: { courseId }, data }) => {
    const dataSM: ActivityEvaluationSM = fromJsonToActivityEvaluationSM(data);
    const newState = adapter.upsertOne(dataSM, state);

    const stateGroupUpdated = groupAddMany({ group: courseId, items: [data.id] }, state.groups);
    const newMetadata: Metadata<number> = ({ id: data.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, groups: stateGroupUpdated, metadata: stateMetadataUpdated };
  }),
  on(ActivityEvaluationActions.addGroup.add.one, (state, { data }) => {
    const stateGroupUpdated = groupAddMany({ group: data.courseId, items: [data.evaluationId] }, state.groups);

    return { ...state, groups: stateGroupUpdated};
  }),
  on(ActivityEvaluationActions.offline.meta.addOfflineEvaluation, (state, { evaluation, idAndGroup }) => {
    const stateGroupUpdated = groupAddMany({ group: idAndGroup.groupId, items: [idAndGroup.id] }, state.groups);

    return adapter.addOne(evaluation, { ...state, groups: stateGroupUpdated })
  }),
  // remove activity to entities using the adapter (when changes to online)
  on(ActivityEvaluationActions.basic.remove.one, (state, { data }) => {
    const groupId = (<number[]>state.groups.ids).filter(id =>
      state.groups.entities[id].items.some(item => item === data)
    )

    if (groupId.length != 1) {
      return state;
    }

    const stateGroupUpdated = groupAdapter.mapOne({
      id: groupId[0],
      map: (item) => ({
        ...item,
        items: item.items.filter(id => id !== data)
      }) as GroupModel
    }, state.groups);

    return { ...state, groups: stateGroupUpdated }
  }),

  on(ActivityEvaluationActions.edit.success, (state, { input: { courseId }, data }) => {
    const dataSM: ActivityEvaluationSM = fromJsonToActivityEvaluationSM(data);
    const newState = adapter.upsertOne(dataSM, state);

    const newMetadata: Metadata<number> = ({ id: data.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivityEvaluationActions.offline.meta.editOfflineEvaluation, (state, { evaluation, idAndGroup }) => {
    const newState = adapter.upsertOne(evaluation, state);

    const newMetadata: Metadata<number> = ({ id: evaluation.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivityEvaluationActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  })
);

export function ActivityEvaluationReducer(state: State | undefined, action: Action) {
  return joinReducers<ActivityEvaluationSM, ActivityEvaluationState>(state, action, [
    reducer,
    basicReducer('Activity Evaluation', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: activityEvaluationOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}

