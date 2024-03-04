import { Action, createReducer, on } from "@ngrx/store";
import {
  materialFolderInitialState as initialState,
  MaterialFolderState, MaterialFolderState as State,
  folderAdapter as adapter
} from './material-folder.state';
import { LoginActions } from "../login/login.actions";
import { basicReducer, joinReducers } from "../shared/template.reducers";
import { MaterialFolderSM, fromJsonToMaterialFolderSM } from "src/app/models/material-folder.model";
import { MaterialFolderActions } from "./material-folder.actions";
import { fromArray } from "src/app/models";
import { GroupModel, groupAdapter, groupAddMany } from "../shared/group/group";
import { Metadata, MetadataType } from "../shared/metadata/metadata";
import { nowString } from "../shared";
import { metadataAdapter } from "../shared/metadata/metadata";
import { materialFolderOfflineReducer } from "./offline/material-folder.offline.reducer";

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState;
  }),
  on(MaterialFolderActions.offline.meta.addOfflineFolder, (state, { folder, idAndGroup }) => {
    const stateGroupUpdated = groupAddMany({ group: idAndGroup.groupId, items: [idAndGroup.id] }, state.groups);

    return adapter.addOne(folder, { ...state, groups: stateGroupUpdated })
  }),
  on(MaterialFolderActions.offline.meta.editOffline, (state, { folder }) => {
    return adapter.upsertOne(folder, state);
  }),
  on(MaterialFolderActions.basic.remove.one, (state, { data }) => {
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
  on(MaterialFolderActions.fetchAll.success, (state, { data: apiData, input: { courseId } }) => {
    const data = fromArray(fromJsonToMaterialFolderSM, apiData); // data = folderSM[]

    // First add the folder entities
    const stateWithNewFolders = adapter.addMany(data, state);

    // Ids of fetched materials
    const folderIds = data.map(folder => folder.id);

    // Update Group
    const stateGroupUpdated = groupAddMany({ group: courseId, items: folderIds }, state.groups);

    // Update Metadata for each item
    const newMetadata: Metadata<number>[] = folderIds.map<Metadata<number>>(id => ({ id, lastUpdate: nowString(), type: MetadataType.Item }));

    // new State with updated Metadata
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...stateWithNewFolders, groups: stateGroupUpdated, metadata: stateMetadataUpdated };
  }),
  on(MaterialFolderActions.create.success, (state, { input: { courseId }, data }) => {
    const dataSM: MaterialFolderSM = fromJsonToMaterialFolderSM(data);

    const stateUpdated = adapter.upsertOne(dataSM, state);
    const stateGroupUpdated = groupAddMany({ group: courseId, items: [data.id] }, state.groups);
    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: data.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...stateUpdated, groups: stateGroupUpdated, metadata: newMetadata };
  }),
  on(MaterialFolderActions.edit.success, (state, { input: { courseId }, data }) => {
    const dataSM: MaterialFolderSM = fromJsonToMaterialFolderSM(data);

    const stateUpdated = adapter.upsertOne(dataSM, state);

    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: data.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...stateUpdated, metadata: newMetadata };
  }),
  on(MaterialFolderActions.delete.success, (state, { input: { folderId, courseId }, data }) => {
    const currentGroup = state.groups.entities[courseId];
    const newGroup: GroupModel = {
      ...currentGroup,
      items: currentGroup.items.filter(id => id !== folderId)
    }

    const newGroups = groupAdapter.upsertOne(newGroup, state.groups)
    const newMetadata = metadataAdapter<number>().removeOne(
      `${MetadataType.Item}/${folderId}`,
      state.metadata
    );
    const stateUpdated = adapter.removeOne(folderId, state);

    return { ...stateUpdated, metadata: newMetadata, groups: newGroups };
  })
)

export function MaterialFolderReducer(state: State | undefined, action: Action) {
  return joinReducers<MaterialFolderSM, MaterialFolderState>(state, action, [
    reducer,
    basicReducer('MaterialFolder', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: materialFolderOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}
