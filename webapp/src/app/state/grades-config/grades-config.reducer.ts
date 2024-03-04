import { Action, createReducer, on } from '@ngrx/store';
import { fromJsonToGradesConfigSM, GradesConfigSM } from 'src/app/models/grades-config.model';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { GradesConfigActions } from './grades-config.actions';
import { gradesConfigAdapter as adapter, GradesConfigInitialState as initialState, GradesConfigState as State } from './grades-config.state';

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(GradesConfigActions.get.success, (state, { data, input: { courseId } }) => {
    const dataSM: GradesConfigSM = fromJsonToGradesConfigSM(data);
    const newState = adapter.upsertOne(dataSM, state);

    const newMetadata: Metadata<number> = ({ id: data.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(GradesConfigActions.editWeights.success, (state, { input: { courseId }, data }) => {
    const dataSM: GradesConfigSM = fromJsonToGradesConfigSM(data);
    const newState = adapter.upsertOne(dataSM, state);

    const newMetadata: Metadata<number> = ({ id: data.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(GradesConfigActions.useArithmeticMean.success, (state, { input: { courseId }, data }) => {
    const gradedActivities = state.entities[data.id].gradedActivities;
    const dataSM: GradesConfigSM = fromJsonToGradesConfigSM(data);
    const dataWithGradedActivitiesSM: GradesConfigSM = {...dataSM, gradedActivities };
    const newState = adapter.upsertOne(dataWithGradedActivitiesSM, state);

    const newMetadata: Metadata<number> = ({ id: data.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(GradesConfigActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  })
);

export function GradesConfigReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}

