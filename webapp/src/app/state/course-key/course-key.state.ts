import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CourseKeySM } from 'src/app/models/course-key.model';
import { courseKeyOfflineInitialState, CourseKeyOfflineState } from './course-key.offline.state';

export interface CourseKeyState extends EntityState<CourseKeySM> {
  // additional entities state properties
  offline: CourseKeyOfflineState;
}

export const courseKeyAdapter: EntityAdapter<CourseKeySM> = createEntityAdapter<CourseKeySM>({
  selectId: (courseKey: CourseKeySM) => courseKey.key
});

export const CourseKeyInitialState: CourseKeyState = courseKeyAdapter.getInitialState({
  // additional entity state properties
  offline: courseKeyOfflineInitialState
});
