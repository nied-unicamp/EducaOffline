import { combineReducers } from '@ngrx/store';
import { arrayReducer } from '../shared/template.reducers';
import { CourseKeyOfflineState } from './course-key.offline.state';

export const courseKeyOfflineReducer = combineReducers<CourseKeyOfflineState>({
  requested: combineReducers({
    keys: arrayReducer<string>('CourseKey / Offline / Requested / Keys'),
    courseIds: arrayReducer<number>('CourseKey / Offline / Requested / CourseIds'),
  }),
});
