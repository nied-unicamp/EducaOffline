import { Action, createReducer, on } from '@ngrx/store';
import { fromArray } from 'src/app/models';
import { ActivitySM, fromJsonToActivitySM } from 'src/app/models/activity.model';
import { FileUploadedActions } from '../file-uploaded/file-uploaded.actions';
import { getFileId } from '../file-uploaded/file-uploaded.state';
import { GradesFinalActions } from '../grades-final/grades-final.actions';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { GroupModel, groupAdapter, groupAddAll, groupAddMany } from '../shared/group/group';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { ActivityActions } from './activity.actions';
import { activityAdapter as adapter, ActivityInitialState as initialState, ActivityState, ActivityState as State } from './activity.state';
import { activityOfflineReducer } from './offline/activity.offline.reducer';

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  // add activity to entities using the adapter
  on(ActivityActions.offline.meta.addOfflineActivity, (state, { activity, idAndGroup }) => {

    const stateGroupUpdated = groupAddMany({ group: idAndGroup.groupId, items: [idAndGroup.id] }, state.groups);

    // add activity
    return adapter.addOne(activity, { ...state, groups: stateGroupUpdated })
  }),
  on(ActivityActions.offline.meta.editOfflineActivity, (state, { idAndGroup, activity }) => {

    const newState = adapter.upsertOne(activity, state);

    const newMetadata: Metadata<number> = ({ id: activity.id, lastUpdate: nowString(), type: MetadataType.Item });
    const stateMetadataUpdated = metadataAdapter<number>().upsertOne(newMetadata, state.metadata);

    return { ...newState, metadata: stateMetadataUpdated };
  }),
  // remove activity to entities using the adapter (when changes to online)
  on(ActivityActions.basic.remove.one, (state, { data }) => {
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
  on(FileUploadedActions.basic.remove.one, (state, { data }) => {

    if (data.includes("submission")) { return state; }

    const id = (<number[]>state.ids).find(i => state.entities[i].files.some(f => f.includes(data)));

    return !id ? state : adapter.updateOne({
      id,
      changes: {
        files: state.entities[id].files.filter(file => file !== data)
      }
    }, state);
  }),
  on(ActivityActions.listFiles.success, (state, { input: { id }, data }) => {

    const localFileIds = state.entities[id]?.files?.filter(file => file.startsWith('local')) ?? [];

    return adapter.mapOne({
      id: id,
      map: (item) => ({
        ...item,
        files: [...data.map(file => getFileId(file)), ...localFileIds]
      })
    }, state)
  }),
  on(FileUploadedActions.local.uploadDone, (state, { id, newFile }) => {

    if (id.includes("submission")) { return state; }
    console.log("Id não incluía o submission")
    const itemId = (<number[]>state.ids).find(myId => state.entities[myId].files.includes(id));

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
  on(GradesFinalActions.getUserOverview.success, (state, { data, input: { courseId, userId } }) => {
    const dataSM: ActivitySM[] = fromArray(fromJsonToActivitySM, data.activities);

    const stateWithNewActivities = adapter.addMany(dataSM, state);

    const activityIds = dataSM.map(activity => activity.id);

    const stateGroupUpdated = groupAddAll({ group: courseId, items: activityIds }, state.groups);

    const newMetadata: Metadata<number>[] = activityIds
      .map<Metadata<number>>(id => ({ id, lastUpdate: nowString(), type: MetadataType.Item }));

    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...stateWithNewActivities, groups: stateGroupUpdated, metadata: stateMetadataUpdated };
  }),
  on(ActivityActions.fetchAll.success, (state, { data, input: { courseId } }) => {
    const dataSM: ActivitySM[] = fromArray(fromJsonToActivitySM, data);

    // First add the activities entities
    const stateWithNewActivities = adapter.addMany(dataSM, state);

    // Ids of fetched activities
    const activityIds = data.map(activity => activity.id);

    // Update Group
    const stateGroupUpdated = groupAddAll({ group: courseId, items: activityIds }, state.groups);

    // Update Metadata for each item
    const newMetadata: Metadata<number>[] = activityIds
      .map<Metadata<number>>(id => ({ id, lastUpdate: nowString(), type: MetadataType.Item }));

    // new State with updated Metadata
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...stateWithNewActivities, groups: stateGroupUpdated, metadata: stateMetadataUpdated };
  }),
  on(
    ActivityActions.create.success,
    ActivityActions.edit.success,
    (state, { input: { courseId, form }, data }) => {
      const dataSM: ActivitySM = fromJsonToActivitySM(data);

      const stateActivityUpdated = adapter.upsertOne(dataSM, state);
      const stateGroupUpdated = groupAddMany({ group: courseId, items: [data.id] }, state.groups);
      const newMetadata = metadataAdapter<number>().upsertMany([{ id: data.id, type: MetadataType.Item, lastUpdate: nowString() }], state.metadata);

      return { ...stateActivityUpdated, groups: stateGroupUpdated, metadata: newMetadata };
    }),
  on(ActivityActions.fetchOne.success, (state, { input: { id, courseId }, data }) => {
    const dataSM: ActivitySM = fromJsonToActivitySM(data);

    let stateActivityUpdated = adapter.upsertOne(dataSM, state);

    if ((<number[]>state.ids).includes(id)) {
      const localFileIds = state.entities[id]?.files?.filter(file => file.startsWith('local')) ?? [];

      if (localFileIds.length > 0) {
        stateActivityUpdated = adapter.updateOne({
          id,
          changes: {
            files: [...dataSM.files, ...localFileIds]
          }
        }, stateActivityUpdated);
      }
    }

    const newMetadata = metadataAdapter<number>().upsertMany([{ id, type: MetadataType.Item, lastUpdate: nowString() }], state.metadata);

    return { ...stateActivityUpdated, metadata: newMetadata };
  }),
  on(ActivityActions.delete.success, (state, { input: { id, courseId } }) => {
    const updatedEntities = adapter.removeOne(id, state);

    const updatedGroups = groupAdapter.mapOne({
      id: courseId,
      map: (group) => ({
        ...group,
        items: group.items.filter(i => i != id)
      })
    }, state.groups)

    const updatedMetadata = metadataAdapter<number>().removeOne(`${MetadataType.Item}/${id}`, state.metadata);

    return { ...updatedEntities, groups: updatedGroups, metadata: updatedMetadata };
  }),
  on(ActivityActions.updateWeights, (state, { weights }) => {
    const updates = weights.map((config) => ({id: config.activityId, changes: {gradeWeight: config.weight}}));
    const updatedState = adapter.updateMany(updates, state);

    const newMetadata = weights.map(({ activityId }) => ({
      id: activityId,
      type: MetadataType.Item,
      lastUpdate: nowString()
    }));
    const updatedMetadata = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);
    
    return {...updatedState, metadata: updatedMetadata};
  }),
  on(ActivityActions.select, (state, { id }) => {
    return { ...state, selectedActivityId: id };
  }),
  on(ActivityActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  })
);


export function ActivityReducer(state: State | undefined, action: Action) {
  return joinReducers<ActivitySM, ActivityState>(state, action, [
    reducer,
    basicReducer('Activity', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: activityOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}
