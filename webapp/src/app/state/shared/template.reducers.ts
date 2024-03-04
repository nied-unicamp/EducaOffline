import { EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { ActionTemplates } from './template.actions';
import { IdAndGroupId, IdStringAndGroupId } from './template.state';

export const basicReducer = <MyEntity>(featureName: string, adapter: EntityAdapter<MyEntity>) => {
  const actions = ActionTemplates.basicActions<MyEntity>(featureName);
  const init = adapter.getInitialState();

  return createReducer(
    init,
    on(actions.upsert.many,
      (state, { data }) => adapter.upsertMany(data, state)),
    on(actions.upsert.one,
      (state, { data }) => adapter.upsertOne(data, state)),
    on(actions.update.many,
      (state, { data }) => adapter.updateMany(data, state)),
    on(actions.update.one,
      (state, { data }) => adapter.updateOne(data, state)),
    on(actions.add.all,
      (state, { data }) => adapter.setAll(data, state)),
    on(actions.add.one,
      (state, { data }) => adapter.addOne(data, state)),
    on(actions.add.many,
      (state, { data }) => adapter.addMany(data, state)),
    on(actions.remove.all,
      (state) => adapter.removeAll(state)),
    on(actions.remove.many,
      (state, { data }) => adapter.removeMany(data, state)),
    on(actions.remove.one,
      (state, { data }) => adapter.removeOne(data, state)),
  );
}

export const idAndGroupReducer = <MyEntity>(featureName: string, adapter: EntityAdapter<IdAndGroupId>) => {
  const actions = ActionTemplates.idAndGroup(featureName);
  const init = adapter.getInitialState();

  return createReducer(
    init,
    on(actions.add,
      (state, { data }) => adapter.addOne(data, state)),
    on(actions.remove,
      (state, { data }) => adapter.removeOne(<string>adapter.selectId(data), state)),
  );
}

export const idStringAndGroupReducer = <MyEntity>(featureName: string, adapter: EntityAdapter<IdStringAndGroupId>) => {
  const actions = ActionTemplates.idStringAndGroup(featureName);
  const init = adapter.getInitialState();

  return createReducer(
    init,
    on(actions.add,
      (state, { data }) => adapter.addOne(data, state)),
    on(actions.remove,
      (state, { data }) => adapter.removeOne(<string>adapter.selectId(data), state)),
  );
}



export const arrayReducer = <T extends string | number = number>(featureName: string) => createReducer<T[]>(
  [],
  on(ActionTemplates.arrayActions<T>(featureName).add.all, (state, { data }) => {
    return data;
  }),
  on(ActionTemplates.arrayActions<T>(featureName).add.one, (state, { data }) => {
    if (state.includes(data)) {
      return state;
    }
    return [...state, data];
  }),
  on(ActionTemplates.arrayActions<T>(featureName).add.many, (state, { data }) => {

    const newItems = data.filter(item => !state.includes(item));

    return [...state, ...newItems];
  }),
  on(ActionTemplates.arrayActions<T>(featureName).remove.all, (state) => {
    return [];
  }),
  on(ActionTemplates.arrayActions<T>(featureName).remove.one, (state, { data }) => {
    return [...state].filter(item => item !== data);
  }),
  on(ActionTemplates.arrayActions<T>(featureName).remove.many, (state, { data }) => {
    return [...state].filter(item => !data.includes(item));
  }),
);


export const toUpdate = <MyEntity>(adapter: EntityAdapter<MyEntity>) => {
  return {
    fromPartial: (partial: Partial<MyEntity>, id: string | number = undefined) => {
      return {
        id: id ?? adapter.selectId(partial as MyEntity),
        changes: partial
      } as Update<MyEntity>;
    },
    fromPartials: (partials: Partial<MyEntity>[]) => partials.map(partial => {
      return {
        id: adapter.selectId(partial as MyEntity),
        changes: partial
      } as Update<MyEntity>;
    }),
    fromEntity: (entity: MyEntity) => {
      return {
        id: adapter.selectId(entity),
        changes: entity
      } as Update<MyEntity>;
    },
    fromEntities: (entities: MyEntity[]) => entities.map(entity => {
      return {
        id: adapter.selectId(entity),
        changes: entity
      } as Update<MyEntity>;
    })
  };
};


export const joinReducers = <MyEntity, MyState extends EntityState<MyEntity>>(
  state: MyState,
  action: Action,
  reducers: (ActionReducer<MyState, Action> | ActionReducer<EntityState<MyEntity>, Action>)[]) => {
  return reducers.reduce((oldState, newReducer) => newReducer(oldState, action), state) as MyState;
};
