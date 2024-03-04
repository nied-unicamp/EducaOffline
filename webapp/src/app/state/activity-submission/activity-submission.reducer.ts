import { Action, createReducer, on } from '@ngrx/store';
import { fromArray } from 'src/app/models';
import { ActivitySubmissionSM, fromJsonToActivitySubmissionSM } from 'src/app/models/activity-submission.model';
import { GradesFinalActions } from '../grades-final/grades-final.actions';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { ActivitySubmissionActions } from './activity-submission.actions';
import { activitySubmissionAdapter as adapter, ActivitySubmissionInitialState as initialState, ActivitySubmissionState, ActivitySubmissionState as State } from './activity-submission.state';
import { activitySubmissionOfflineReducer } from './offline/activity-submission.offline.reducer';
import { getFileId } from '../file-uploaded/file-uploaded.state';
import { FileUploadedActions } from '../file-uploaded/file-uploaded.actions';
import { groupAddMany } from '../shared/group/group';
import { activitySubmissionOfflineFilesToDeleteAdapter } from './offline/activity-submission.offline.state';
import { ActivitySubmissionOfflineActions } from './offline/activity-submission.offline.actions';

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(ActivitySubmissionActions.getMine.success, (state, { data }) => {
    if (!data) {
      return state;
    }

    const dataSM: ActivitySubmissionSM = fromJsonToActivitySubmissionSM(data);
    const newState = adapter.upsertOne(dataSM, state);

    const newMetadata: Metadata<number> = ({ id: data.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(GradesFinalActions.getUserOverview.success, (state, { data, input }) => {
    const dataSM: ActivitySubmissionSM[] = fromArray(fromJsonToActivitySubmissionSM, data.grades.map(grade => grade.activitySubmission).filter(submission => submission !== undefined));
    const newState = adapter.upsertMany(dataSM, state);

    const newMetadata: Metadata<number>[] = dataSM.map(item => ({ id: item.id, lastUpdate: nowString(), type: MetadataType.Item }));
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivitySubmissionActions.getAll.success, (state, { data }) => {
    const dataSM: ActivitySubmissionSM[] = fromArray(fromJsonToActivitySubmissionSM, data);
    const newState = adapter.upsertMany(dataSM, state);

    const newMetadata: Metadata<number>[] = data.map(item => ({ id: item.id, lastUpdate: nowString(), type: MetadataType.Item }));
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivitySubmissionActions.create.success, (state, { data }) => {
    const dataSM: ActivitySubmissionSM = fromJsonToActivitySubmissionSM(data);
    console.log(dataSM);
    const newState = adapter.upsertOne(dataSM, state);

    const newMetadata: Metadata<number> = ({ id: data.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivitySubmissionActions.offline.meta.addOfflineSubmission, (state, { submission, idAndGroup }) => {

    console.log(submission);
    const stateGroupUpdated = groupAddMany({ group: idAndGroup.groupId, items: [idAndGroup.id] }, state.groups);

    // add activity
    return adapter.addOne(submission, { ...state, groups: stateGroupUpdated })
  }),
  // add the submission files to entities
  on(ActivitySubmissionActions.listFiles.success, (state, { input: { submissionId }, data }) => {

    const localFileIds = state.entities[submissionId]?.files?.filter(file => file.startsWith('local')) ?? [];

    return adapter.mapOne({
      id: submissionId,
      map: (item) => ({
        ...item,
        files: [...data.map(file => getFileId(file)), ...localFileIds]
      })
    }, state)
  }),
  
  // update reference files on entities
  on(FileUploadedActions.local.uploadDone, (state, { id, newFile }) => {

    if (!id.includes("submission")) { return state; }

    const itemId = (<number[]>state.ids).find(myId => state.entities[myId].files.includes(id));
    console.log("itemId encontrado")
    return adapter.updateOne({
      id: itemId,
      changes: {
        files: [
          ...state.entities[itemId].files.filter(file => file !== id),
          getFileId(newFile)
        ]
      }
    }, state);
  }),
  on(FileUploadedActions.basic.remove.one, (state, { data }) => {

    if (!data.includes("submission")) { return state; }

    const id = (<number[]>state.ids).find(i => state.entities[i].files.some(f => f.includes(data)));

    return !id ? state : adapter.updateOne({
      id,
      changes: {
        files: state.entities[id].files.filter(file => file !== data)
      }
    }, state);
  }),
  on(ActivitySubmissionActions.edit.success, (state, { data }) => {
    const dataSM: ActivitySubmissionSM = fromJsonToActivitySubmissionSM(data);
    const newState = adapter.upsertOne(dataSM, state);

    const newMetadata: Metadata<number> = ({ id: data.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivitySubmissionActions.offline.meta.editOfflineSubmission, (state, { idAndGroup, submission }) => {

    const newState = adapter.upsertOne(submission, state);

    const newMetadata: Metadata<number> = ({ id: submission.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivitySubmissionActions.delete.success, (state, { input: { submissionId } }) => {
    const newState = adapter.removeOne(submissionId, state);

    const stateMetadataUpdated = metadataAdapter<number>().removeOne(`${MetadataType.Item}/${submissionId}`, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  on(ActivitySubmissionActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  })
);

export function ActivitySubmissionReducer(state: State | undefined, action: Action) {
  return joinReducers<ActivitySubmissionSM, ActivitySubmissionState>(state, action, [
    reducer,
    basicReducer('ActivitySubmission', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: activitySubmissionOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}
