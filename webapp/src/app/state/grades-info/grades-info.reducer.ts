import { Action, createReducer, on } from '@ngrx/store';
import { fromArray } from 'src/app/models';
import { fromJsonToGradesInfoSM, GradesInfoSM } from 'src/app/models/grades-info.model';
import { GradesFinalActions } from '../grades-final/grades-final.actions';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { GradesInfoActions } from './grades-info.actions';
import { gradesInfoAdapter as adapter, GradesInfoInitialState as initialState, GradesInfoState, GradesInfoState as State } from './grades-info.state';

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(GradesFinalActions.getUserOverview.success, (state, { data, input: { courseId } }) => {
    const dataSM: GradesInfoSM[] = fromArray(fromJsonToGradesInfoSM, data?.averageGrades);

    const newState = adapter.upsertMany(dataSM, state);

    const newMetadata: Metadata<number>[] = dataSM.map(item => ({ id: item.activityId, lastUpdate: nowString(), type: MetadataType.Item }));
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(GradesInfoActions.getSummary.success, (state, { data, input: { courseId } }) => {
    const dataSM: GradesInfoSM[] = fromArray(fromJsonToGradesInfoSM, data);
    const newState = adapter.upsertMany(dataSM, state);

    const newMetadata: Metadata<number>[] = dataSM.map(item => ({ id: item.activityId, lastUpdate: nowString(), type: MetadataType.Item }));
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(GradesInfoActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  })
);

export function GradesInfoReducer(state: State | undefined, action: Action) {
  return joinReducers<GradesInfoSM, GradesInfoState>(state, action, [
    reducer,
    basicReducer<GradesInfoSM>('GradesInfo', adapter),
  ]);
}
