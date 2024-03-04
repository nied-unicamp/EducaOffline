import { Action, createReducer, on } from '@ngrx/store';
import { CourseKeySM } from 'src/app/models/course-key.model';
import { LoginActions } from '../login/login.actions';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { CourseKeyActions } from './course-key.actions';
import { courseKeyOfflineReducer } from './course-key.offline.reducer';
import { courseKeyAdapter, CourseKeyInitialState as initialState, CourseKeyState, CourseKeyState as State } from './course-key.state';

const courseKeyReducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(CourseKeyActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  })
);

export function CourseKeyReducer(state: State | undefined, action: Action) {
  return joinReducers<CourseKeySM, CourseKeyState>(state, action, [
    courseKeyReducer,
    basicReducer('CourseKey', courseKeyAdapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: courseKeyOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}
