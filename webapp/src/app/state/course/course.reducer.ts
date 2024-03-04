import { Action, createReducer, on } from '@ngrx/store';
import { CourseSM } from 'src/app/models/course.model';
import { LoginActions } from '../login/login.actions';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { CourseActions as actions } from './course.actions';
import { courseAdapter as adapter, CourseInitialState as initialState, CourseState, CourseState as State } from './course.state';
import { courseOfflineReducer } from './offline/course.offline.reducer';

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(actions.keyLoaded, (state, { data }) => {
    return data ?? state;
  }),
  on(actions.selectId, (state, { id }) => {
    return { ...state, selectedId: id };
  }),
  on(actions.offlineSync.change, (state, { id, enabled }) => {
    return adapter.mapOne({
      id: id,
      map: (item) => ({
        ...item,
        offlineSync: {
          enable: enabled
        }
      })
    }, state);
  })
);

export function CourseReducer(state: State | undefined, action: Action) {
  return joinReducers<CourseSM, CourseState>(state, action, [
    reducer,
    basicReducer('Course', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: courseOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}
