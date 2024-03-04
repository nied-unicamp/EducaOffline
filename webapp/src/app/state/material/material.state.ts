import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { MaterialSM } from 'src/app/models/material.model';
import { groupAdapter, GroupState } from '../shared/group/group';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';
import { materialOfflineInitialState, MaterialOfflineState } from './offline/material.offline.state';

export interface MaterialState extends EntityState<MaterialSM> {
  groups: GroupState;
  metadata: MetadataState<number>;
  offline: MaterialOfflineState;
  changingFoldersCount: number;
}

export const materialAdapter: EntityAdapter<MaterialSM> = createEntityAdapter<MaterialSM>();

export const materialInitialState: MaterialState = materialAdapter.getInitialState({
  groups: groupAdapter.getInitialState(),
  metadata: metadataAdapter<number>().getInitialState(),
  offline: materialOfflineInitialState,
  changingFoldersCount: 0,
});
