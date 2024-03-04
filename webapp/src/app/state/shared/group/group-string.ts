import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { nowString } from '..';
import { IdStringAndGroupId } from '../template.state';


export interface GroupStringModel {
  id: number;
  lastUpdate: string;
  items: string[];
}

export interface GroupStringState extends EntityState<GroupStringModel> {
}

export const groupStringAdapter: EntityAdapter<GroupStringModel> = createEntityAdapter<GroupStringModel>();

export const groupStringInitialState: GroupStringState = groupStringAdapter.getInitialState({});


export const groupStringAddAll = (args: { group: number, items: string[] }, state: GroupStringState) => {

  let baseState = state;

  if (state.ids.some(id => id === args.group)) {
    baseState = groupStringAdapter.removeOne(args.group, state);
  }

  return groupStringAdapter.addOne({ id: args.group, lastUpdate: nowString(), items: args.items }, baseState);
};

export const groupStringAddMany = (args: { group: number, items: string[] }, state: GroupStringState) => {
  let newGroup: GroupStringModel = null;


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

  return groupStringAdapter.upsertOne(newGroup, state);
};

export const groupStringRemoveMany = (ids: string[], state: GroupStringState) => {
  const toUpdate: GroupStringModel[] = [];

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

  return groupStringAdapter.upsertMany(toUpdate, state);
};

// Selectors from the adapter
const selectors = groupStringAdapter.getSelectors();



export const GroupStringSelectors = (groupStateSelector: MemoizedSelector<any, GroupStringState, DefaultProjectorFn<GroupStringState>>) => {

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
    selectors.selectIds as (state: EntityState<GroupStringModel>) => number[]
  )

  const selectGroupAll = createSelector(
    groupStateSelector,
    selectors.selectAll
  );

  const selectGroupTotal = createSelector(
    groupStateSelector,
    selectors.selectTotal
  );

  const selectGroupIdByItemId = (itemId: string) => createSelector(
    selectGroupIds,
    selectGroupEntities,
    (ids, entities) => {
      const groupId = ids.find(id => entities[id].items.includes(itemId));

      return { id: itemId, groupId } as IdStringAndGroupId
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
