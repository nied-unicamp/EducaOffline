import { createEntityAdapter } from '@ngrx/entity';
import { GroupState } from './group/group';
import { IdType, MetadataState } from './metadata/metadata';


export interface IdAndGroupId {
  id: number;
  groupId: number;
}

export interface IdStringAndGroupId {
  id: string;
  groupId: number;
}

export const idAndGroupAdapter = createEntityAdapter<IdAndGroupId>({
  selectId: (item) => item.id
});

export const idStringAndGroupAdapter = createEntityAdapter<IdStringAndGroupId>({
  selectId: (item) => item.id
});

export interface StateWithGroup {
  groups: GroupState;
}

export interface StateWithMetadata<T = IdType> {
  metadata: MetadataState<T>;
}
