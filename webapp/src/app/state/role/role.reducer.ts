import { Action, createReducer, on } from '@ngrx/store';
import { LoginActions } from '../login/login.actions';
import { RoleActions } from './role.actions';
import { roleAdapter as adapter, roleInitialState as initialState, RoleState as State } from './role.state';

const roleReducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(RoleActions.upsert, (state, { roles }) => {
    return adapter.upsertMany(roles, state);
  }),
  // on(RoleActions.fetchOne.success, (state, { id, data }) => {
  //   return adapter.upsertOne(data, state);
  // }),
  on(RoleActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  })
);

export function RoleReducer(state: State | undefined, action: Action) {
  return roleReducer(state, action);
}
