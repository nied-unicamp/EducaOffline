import { Action, createReducer, on } from '@ngrx/store';
import { LoginActions } from '../login/login.actions';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { ParticipationActions } from './participation.actions';
// eslint-disable-next-line max-len
import { participationAdapter, participationInitialState as initialState, ParticipationState as State } from './participation.state';


const participationReducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(ParticipationActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  })
);

export function ParticipationReducer(state: State | undefined, action: Action) {
  return joinReducers(state, action, [
    participationReducer,
    basicReducer('Participation', participationAdapter),
  ]);
}
