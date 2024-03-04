import { Action, createReducer, on } from '@ngrx/store';
import { LoginActions } from '../login/login.actions';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { UserActions } from './user.actions';
import { userAdapter as adapter, UserInitialState as initialState, UserState as State, UserState } from './user.state';
import { UserSM } from 'src/app/models/user.model';
import { userOfflineReducer } from './offline/user.offline.reducer';

const userReducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(UserActions.select, (state, { user }) => {
    return { ...state, selectedUserId: user };
  }),
  on(UserActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  }),
  on(UserActions.offline.meta.editOfflineProfile, (state, { id, profile }) => {

    const newState = adapter.upsertOne(profile, state);

    return newState;
  }),
);

export function UserReducer(state: State | undefined, action: Action) {
  return joinReducers<UserSM, UserState>(state, action, [
    userReducer,
    basicReducer('User', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: userOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}