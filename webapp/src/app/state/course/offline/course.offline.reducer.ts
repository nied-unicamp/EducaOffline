import { combineReducers, createReducer, on } from '@ngrx/store';
import { CourseActions } from 'src/app/state/course/course.actions';
import { arrayReducer, basicReducer } from 'src/app/state/shared/template.reducers';
import { courseOfflineDeletedAdapter, CourseOfflineState, courseOfflineUpdatedAdapter } from './course.offline.state';

export const courseOfflineReducer = combineReducers<CourseOfflineState>({
  created: combineReducers({
    ids: arrayReducer<number>('Course / Offline / Created')
  }),
  requested: combineReducers({
    ids: arrayReducer('Course / Offline / Requested / Ids'),
    all: createReducer<boolean>(
      false,
      on(CourseActions.offline.requested.all.add, (_) => true),
      on(CourseActions.offline.requested.all.remove, (_) => false),
    )
  }),
  updated: basicReducer('Course / Offline / Updated', courseOfflineUpdatedAdapter),
  deleted: basicReducer('Course / Offline / Deleted', courseOfflineDeletedAdapter),
});
