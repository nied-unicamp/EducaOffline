import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { nowString } from '..';
import { IdAndGroupId } from '../template.state';


export interface GroupModel {
  id: number;
  lastUpdate: string;
  items: number[];
}

export interface GroupState extends EntityState<GroupModel> {
}

export const groupAdapter: EntityAdapter<GroupModel> = createEntityAdapter<GroupModel>();

export const groupInitialState: GroupState = groupAdapter.getInitialState({});


export const groupAddAll = (args: { group: number, items: number[] }, state: GroupState) => {

  let baseState = state;

  if (state.ids.some(id => id === args.group)) {
    baseState = groupAdapter.removeOne(args.group, state);
  }

  return groupAdapter.addOne({ id: args.group, lastUpdate: nowString(), items: args.items }, baseState);
};

export const groupAddMany = (args: { group: number, items: number[] }, state: GroupState) => {
  let newGroup: GroupModel = null;


  // get items already in the group
  if (state.ids.some(id => id === args.group)) {
    const oldGroup = state.entities[args.group];
    newGroup = { ...oldGroup, items: [...oldGroup.items] };

    args.items.forEach(it => {
      if (!newGroup.items.some(i => it === i)) {
        newGroup.items.push(it);
      }
    });

  } else {
    newGroup = { id: args.group, lastUpdate: null, items: args.items };
  }

  return groupAdapter.upsertOne(newGroup, state);
};

export const groupRemoveMany = (ids: number[], state: GroupState) => {
  const toUpdate: GroupModel[] = [];

  // Search in all groups (Doing this way to not mutate state)
  state.ids.forEach(id => {
    const currentGroup = state.entities[id];
    const newGroup = { ...currentGroup, items: [...currentGroup.items] };

    let update = false;

    // Remove the desired item from the list
    newGroup.items.forEach((it, ind) => {
      if (ids.some(i => i === it)) {
        newGroup.items.splice(ind, 1);
        update = true;
      }
    });

    // Set the group to update if it is needed
    if (update) { toUpdate.push(newGroup); }
  });

  return groupAdapter.upsertMany(toUpdate, state);
};

// Selectors from the adapter
const selectors = groupAdapter.getSelectors();



export const GroupSelectors = (groupStateSelector: MemoizedSelector<any, GroupState, DefaultProjectorFn<GroupState>>) => {

  const selectGroupEntities = createSelector(
    groupStateSelector,
    selectors.selectEntities
  );

  const selectGroupItemsById = (id: number) => createSelector(
    selectGroupEntities,
    (entities) => id ? entities[id] : null
  )

  const selectGroupIds = createSelector(
    groupStateSelector,
    selectors.selectIds
  )

  const selectGroupAll = createSelector(
    groupStateSelector,
    selectors.selectAll
  );

  const selectGroupTotal = createSelector(
    groupStateSelector,
    selectors.selectTotal
  );

  const selectGroupIdByItemId = (itemId: number) => createSelector(
    selectGroupIds,
    selectGroupEntities,
    (ids, entities) => {
      const groupId = (<number[]>ids).find(id => entities[id].items.includes(itemId));

      return { id: itemId, groupId } as IdAndGroupId
    }
  )

  return {
    byId: selectGroupItemsById,
    ids: selectGroupIds,
    entities: selectGroupEntities,
    all: selectGroupAll,
    total: selectGroupTotal,
    getGroupIdFromItem: selectGroupIdByItemId
  };

};
