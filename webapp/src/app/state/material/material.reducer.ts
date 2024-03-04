import { Action, createReducer, on } from '@ngrx/store';
import { fromArray } from 'src/app/models';
import { fromJsonToMaterialSM, MaterialSM } from 'src/app/models/material.model';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { groupAdapter, groupAddMany, GroupModel } from '../shared/group/group';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { MaterialActions } from './material.actions';
import { materialAdapter as adapter, materialInitialState as initialState, MaterialState, MaterialState as State } from './material.state';
import { materialOfflineReducer } from './offline/material.offline.reducer';

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(MaterialActions.offline.meta.addOfflineMaterial, (state, { material, idAndGroup }) => {
    const stateGroupUpdated = groupAddMany({ group: idAndGroup.groupId, items: [idAndGroup.id] }, state.groups);

    return adapter.addOne(material, { ...state, groups: stateGroupUpdated })
  }),
  on(MaterialActions.offline.meta.addOfflineLink, (state, { material, idAndGroup }) => {
    const stateGroupUpdated = groupAddMany({ group: idAndGroup.groupId, items: [idAndGroup.id] }, state.groups);

    return adapter.addOne(material, { ...state, groups: stateGroupUpdated })
  }),
  on(MaterialActions.offline.meta.updateOfflineMaterial, (state, { material }) => {
    const stateUpdated = adapter.upsertOne(material, state);

    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: material.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...stateUpdated, metadata: newMetadata };
  }),
  on(MaterialActions.basic.remove.one, (state, { data }) => {
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
  on(MaterialActions.fetchAll.success, (state, { data: apiData, input: { courseId } }) => {
    const data = fromArray(fromJsonToMaterialSM, apiData);

    // First add the materials entities
    const stateWithNewMaterials = adapter.addMany(data, state);

    // Ids of fetched materials
    const materialIds = data.map(material => material.id);

    // Update Group
    const stateGroupUpdated = groupAddMany({ group: courseId, items: materialIds }, state.groups);

    // Update Metadata for each item
    const newMetadata: Metadata<number>[] = materialIds
      .map<Metadata<number>>(id => ({ id, lastUpdate: nowString(), type: MetadataType.Item }));

    // new State with updated Metadata
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...stateWithNewMaterials, groups: stateGroupUpdated, metadata: stateMetadataUpdated };
  }),
  on(MaterialActions.fetchFolderMaterials.success, (state, { data: apiData, input: { courseId, folderId } }) => {
    const data = fromArray(fromJsonToMaterialSM, apiData);

    //set folderId for the material
    data.forEach((mat) => mat.folder = folderId);

    // First add the materials entities
    const stateWithNewMaterials = adapter.addMany(data, state);

    // Ids of fetched materials
    const materialIds = data.map(material => material.id);

    // Update Group
    const stateGroupUpdated = groupAddMany({ group: courseId, items: materialIds }, state.groups);

    // Update Metadata for each item
    const newMetadata: Metadata<number>[] = materialIds
      .map<Metadata<number>>(id => ({ id, lastUpdate: nowString(), type: MetadataType.Item }));

    // new State with updated Metadata
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...stateWithNewMaterials, groups: stateGroupUpdated, metadata: stateMetadataUpdated };
  }),
  on(MaterialActions.create.files.success, (state, { data: apiData, input: { courseId } }) => {
    const data = fromArray(fromJsonToMaterialSM, apiData);

    // First add the materials entities
    const stateWithNewMaterials = adapter.addMany(data, state);

    // Ids of fetched materials
    const materialIds = data.map(material => material.id);

    // Update Group
    const stateGroupUpdated = groupAddMany({ group: courseId, items: materialIds }, state.groups);

    // Update Metadata for each item
    const newMetadata: Metadata<number>[] = materialIds
      .map<Metadata<number>>(id => ({ id, lastUpdate: nowString(), type: MetadataType.Item }));

    // new State with updated Metadata
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...stateWithNewMaterials, groups: stateGroupUpdated, metadata: stateMetadataUpdated };
  }),
  on(MaterialActions.create.link.success, (state, { input: { courseId }, data }) => {
    const dataSM: MaterialSM = fromJsonToMaterialSM(data);

    const stateUpdated = adapter.upsertOne(dataSM, state);
    const stateGroupUpdated = groupAddMany({ group: courseId, items: [data.id] }, state.groups);
    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: data.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...stateUpdated, groups: stateGroupUpdated, metadata: newMetadata };
  }),
  on(MaterialActions.editLink.success, (state, { data }) => {
    const dataSM: MaterialSM = fromJsonToMaterialSM(data);

    // Get the folder of the material in the store, since it doesn't come in the response.
    // We know it's the same as before, since this action is only called when changing name and/or description
    dataSM.folder = state.entities[dataSM.id].folder;

    const stateUpdated = adapter.upsertOne(dataSM, state);

    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: data.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...stateUpdated, metadata: newMetadata };
  }),
  on(MaterialActions.delete.success, (state, { input }) => {
    const currentGroup = state.groups.entities[input.courseId];
    const newGroup: GroupModel = {
      ...currentGroup,
      items: currentGroup.items.filter(id => id !== input.materialId)
    }

    const newGroups = groupAdapter.upsertOne(newGroup, state.groups)
    const newMetadata = metadataAdapter<number>().removeOne(
      `${MetadataType.Item}/${input.materialId}`,
      state.metadata
    );
    const statePostsUpdated = adapter.removeOne(input.materialId, state);

    return { ...statePostsUpdated, metadata: newMetadata, groups: newGroups };
  }),
  on(MaterialActions.changeMaterialFolder.request, (state) => ({
    ...state,
    changingFoldersCount: state.changingFoldersCount + 1
  })),
  on(MaterialActions.changeMaterialFolder.error, MaterialActions.changeMaterialFolder.success, (state) => ({
    ...state,
    changingFoldersCount: state.changingFoldersCount - 1
  })),
  on(MaterialActions.changeMaterialFolder.success, (state, { input: { materialId, folderId } }) => {
    const currentSM = state.entities[materialId];

    const newSM = { ...currentSM, folder: Number(folderId) };

    const stateUpdated = adapter.upsertOne(newSM, state);

    return { ...stateUpdated };
  }),
  on(MaterialActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  }),
  on(MaterialActions.updateFolderReferences, (state, { oldFolderId, newFolderId }) => {
    const idsOfMaterialsInFolder = (<number[]>state.ids).filter((id) => state.entities[id].folder === oldFolderId);

    const updates = idsOfMaterialsInFolder.map((id) => ({
      id,
      changes: { folder: newFolderId },
    }));

    return adapter.updateMany(updates, state);
  })
);


export function MaterialReducer(state: State | undefined, action: Action) {
  return joinReducers<MaterialSM, MaterialState>(state, action, [
    reducer,
    basicReducer('Material', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: materialOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}
