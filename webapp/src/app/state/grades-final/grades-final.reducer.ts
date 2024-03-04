import { Action, createReducer, on } from '@ngrx/store';
import { fromArray } from 'src/app/models';
import { fromJsonToGradesFinalSM, GradesFinalSM } from 'src/app/models/grades-final.model';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { GradesFinalActions } from './grades-final.actions';
import { getGradesFinalId, gradesFinalAdapter as adapter, GradesFinalInitialState as initialState, GradesFinalState as State } from './grades-final.state';


const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(GradesFinalActions.getUserOverview.success, (state, { data, input: { courseId } }) => {
    const dataSM: GradesFinalSM = fromJsonToGradesFinalSM({ ...data?.finalGrade, courseId });

    const newState = adapter.upsertOne(dataSM, state);

    const newMetadata: Metadata<string> = ({ id: getGradesFinalId(dataSM), lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<string>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(GradesFinalActions.getOverview.success, (state, { data, input: { courseId } }) => {
    const dataSM: GradesFinalSM[] = fromArray(fromJsonToGradesFinalSM, data?.finalGrades?.map(item => ({ ...item, courseId })) ?? []);

    const newState = adapter.upsertMany(dataSM, state);

    const newMetadata: Metadata<string>[] = dataSM.map(final => ({ id: getGradesFinalId(final), lastUpdate: nowString(), type: MetadataType.Item }));
    const stateMetadataUpdated = metadataAdapter<string>().upsertMany(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(GradesFinalActions.fetchAll.success, (state, { data, input: { courseId } }) => {
    const dataSM: GradesFinalSM[] = fromArray(fromJsonToGradesFinalSM, data.map(item => ({ ...item, courseId })));

    const newState = adapter.upsertMany(dataSM, state);

    const newMetadata: Metadata<string>[] = dataSM.map(final => ({ id: getGradesFinalId(final), lastUpdate: nowString(), type: MetadataType.Item }));
    const stateMetadataUpdated = metadataAdapter<string>().upsertMany(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(GradesFinalActions.fetch.success, (state, { data, input: { courseId } }) => {
    const dataSM: GradesFinalSM = fromJsonToGradesFinalSM({ ...data, courseId });

    const newState = adapter.upsertOne(dataSM, state);

    const newMetadata: Metadata<string> = ({ id: getGradesFinalId(dataSM), lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<string>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),

  on(GradesFinalActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  })
);

export function GradesFinalReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}

