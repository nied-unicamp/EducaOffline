import { Action, createReducer, on } from '@ngrx/store';
import { toDateString } from '../shared';
import { LoginActions } from './login.actions';
import { loginInitialState as initialState, LoginState as State } from './login.state';

const loginReducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(LoginActions.login.success, (state, { data }) => {
    const validUntil = toDateString(new Date(new Date().getTime() + data.expires_in));
    return { ...state, token: { value: data.access_token, validUntil } };
  }),
  on(LoginActions.me.success, (state, { data }) => {
    return { ...state, userId: data.id, email: data.email, };
  }),
  on(LoginActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  }),
  on(LoginActions.setOffline, (state, { isOffline }) => {
    return { ...state, isOffline };
  })
);

export function LoginReducer(state: State | undefined, action: Action) {
  return loginReducer(state, action);
}
