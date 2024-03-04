import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CourseSM } from 'src/app/models/course.model';
import { courseOfflineInitialState, CourseOfflineState } from './offline/course.offline.state';

export interface CourseState extends EntityState<CourseSM> {
  // additional entities state properties
  selectedId: number;
  offline: CourseOfflineState;
}

export const courseAdapter: EntityAdapter<CourseSM> = createEntityAdapter<CourseSM>();

export const CourseInitialState: CourseState = courseAdapter.getInitialState({
  // additional entity state properties
  selectedId: null,
  offline: courseOfflineInitialState
});
