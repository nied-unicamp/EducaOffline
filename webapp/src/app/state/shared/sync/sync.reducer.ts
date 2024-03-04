import { Action, createReducer, on } from '@ngrx/store';
import { LoginActions } from '../../login/login.actions';
import { SyncActions } from './sync.actions';
import { SyncAdapter as adapter, SyncInitialState as initialState, SyncState as State } from './sync.state';

const syncReducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(SyncActions.upsertSync, (state, { sync }) => {
    return adapter.upsertOne(sync, state);
  }),
  on(SyncActions.keys.loadOne.request, (state, { input: { key } }) => {
    const { loading, error } = state.load;

    const newState: State = {
      ...state,
      load: {
        loading: loading.filter(c => c !== key).concat(key),
        error: error.filter(c => c !== key)
      }
    }
    return newState
  }),
  on(SyncActions.keys.loadOne.success, (state, { input: { key } }) => {
    const { loading, error } = state.load;

    const newState: State = {
      ...state,
      load: {
        loading: loading.filter(c => c !== key),
        error: error.filter(c => c !== key)
      }
    }

    return newState;
  }),
  on(SyncActions.keys.loadOne.error, (state, { input: { key } }) => {
    const { loading, error } = state.load;

    const newState: State = {
      ...state,
      load: {
        loading: loading.filter(c => c !== key),
        error: error.filter(c => c !== key).concat(key)
      }
    }

    return newState;
  }),
  on(SyncActions.keys.saveOne.success, (state, { input }) => {

    return {
      ...state,
      toSave: state.toSave.filter(item => item !== input.key)
    };
  }),
);

export function SyncReducer(state: State | undefined, action: Action) {
  return syncReducer(state, action);
}
