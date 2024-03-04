import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { MaterialFolderSM } from "src/app/models/material-folder.model";
import { GroupState, groupAdapter } from "../shared/group/group";
import { MetadataState, metadataAdapter } from "../shared/metadata/metadata";
import { MaterialFolderOfflineState, materialFolderOfflineInitialState } from "./offline/material-folder.offline.state";


export interface MaterialFolderState extends EntityState<MaterialFolderSM> {
  groups: GroupState;
  metadata: MetadataState<number>;
  offline: MaterialFolderOfflineState;
}

export const folderAdapter: EntityAdapter<MaterialFolderSM> = createEntityAdapter<MaterialFolderSM>();

export const materialFolderInitialState: MaterialFolderState = folderAdapter.getInitialState({
  groups: groupAdapter.getInitialState(),
  metadata: metadataAdapter<number>().getInitialState(),
  offline: materialFolderOfflineInitialState,
});
