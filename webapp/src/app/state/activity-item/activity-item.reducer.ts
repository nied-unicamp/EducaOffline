import { Action, createReducer, on } from '@ngrx/store';
import { fromArray } from 'src/app/models';
import { ActivityItemSM, fromJsonLiteToActivityItemSM, fromJsonToActivityItemSM } from 'src/app/models/activity-item.model';
import { GradesFinalActions } from '../grades-final/grades-final.actions';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { ActivityItemActions } from './activity-item.actions';
import { activityItemAdapter as adapter, ActivityItemInitialState as initialState, ActivityItemState as State, getActivityItemId, ActivityItemState } from './activity-item.state';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { activityItemOfflineReducer } from './offline/activity-item.offline.reducer';


const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(GradesFinalActions.getUserOverview.success, (state, { data, input: { courseId, userId } }) => {
    const dataSM: ActivityItemSM[] = fromArray(fromJsonLiteToActivityItemSM, data.grades);

    const newState = adapter.addMany(dataSM, state);

    const newMetadata: Metadata<string>[] = dataSM.map(item => ({ id: getActivityItemId(item), lastUpdate: nowString(), type: MetadataType.Item }));
    const stateMetadataUpdated = metadataAdapter<string>().upsertMany(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivityItemActions.fetchAll.success, (state, { data, input: { courseId } }) => {
    const dataSM: ActivityItemSM[] = fromArray(fromJsonToActivityItemSM, data);

    const newState = adapter.upsertMany(dataSM, state);

    const newMetadata: Metadata<string>[] = dataSM.map(item => ({ id: getActivityItemId(item), lastUpdate: nowString(), type: MetadataType.Item }));
    const stateMetadataUpdated = metadataAdapter<string>().upsertMany(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivityItemActions.indirectlyUpsert, (state, { items }) => {
    
    const itemsWithEvaluationIdOfStore = items.map(item => {
      if(!item.evaluationId) console.log(item.activityId + '/' + item.userId + ': ', state.entities[item.activityId + '/' + item.userId]?.evaluationId)
      return {
        ...item,
        evaluationId: item.evaluationId ? item.evaluationId : state.entities[item.activityId + '/' + item.userId]?.evaluationId
      }
    });

    const newState = adapter.upsertMany(itemsWithEvaluationIdOfStore, state);

    const newMetadataItems = itemsWithEvaluationIdOfStore.map(item => ({ id: getActivityItemId(item), type: MetadataType.Item, lastUpdate: nowString() }))
    const newMetadata = metadataAdapter<string>().upsertMany(newMetadataItems, state.metadata);

    return { ...newState, metadata: newMetadata };
  }),
  on(ActivityItemActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  })
);

export function ActivityItemReducer(state: State | undefined, action: Action) {
  return joinReducers<ActivityItemSM, ActivityItemState>(state, action, [
    reducer,
    basicReducer('ActivityItem', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: activityItemOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}

