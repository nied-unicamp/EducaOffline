import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ParticipationSM } from 'src/app/models/participation.model';
import { ParticipationSelectors } from '../participation/participation.selector';
import { courseAdapter as adapter, CourseState as State } from './course.state';


//#region Selectors

// Feature selector
const selectCourseState = createFeatureSelector<State>('courses');


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// Id selector
const getSelectedCourseId = createSelector(
  selectCourseState,
  (state) => state.selectedId
)


// Composed selectors
const selectCourseIds = createSelector(
  selectCourseState,
  selectIds
);
const selectCourseEntities = createSelector(
  selectCourseState,
  selectEntities
);
const selectAllCourses = createSelector(
  selectCourseState,
  selectAll
);
const selectCourseTotal = createSelector(
  selectCourseState,
  selectTotal
);

// Get current
const selectCurrentCourse = createSelector(
  selectCourseEntities,
  getSelectedCourseId,
  (courseEntities, courseId) => courseEntities[courseId]
);

const selectById = (id: number) => createSelector(
  selectCourseEntities,
  (entities) => id ? entities[id] : null
);

const selectAllOfCurrentUser = createSelector(
  selectCourseEntities,
  ParticipationSelectors.ofCurrentUser,
  (courses, participation) => participation.map(p => courses[p.courseId])
)

const selectAllOfCurrentUserAndRoleId = (roleId: number) => createSelector(
  selectCourseEntities,
  ParticipationSelectors.ofCurrentUserAndRoleId(roleId),
  (courses, participation) => participation.map(p => courses[p.courseId])
)

const selectSyncEnabled = createSelector(
  selectAllCourses,
  courses => courses.filter(c => c.offlineSync?.enable) ?? []
)

//#endregion

export const CourseSelectors = {
  byId: selectById,
  state: selectCourseState,
  ids: selectCourseIds,
  entities: selectCourseEntities,
  all: selectAllCourses,
  total: selectCourseTotal,
  currentId: getSelectedCourseId,
  current: selectCurrentCourse,
  ofCurrentUser: selectAllOfCurrentUser,
  ofCurrentUserAndRoleId: selectAllOfCurrentUserAndRoleId,
  sync: {
    enabledList: selectSyncEnabled,
  }
};

const getCourseIds = (participation: ParticipationSM[]) => {
  const ids: number[] = [];

  participation.forEach(p => {
    if (!ids.includes(p.courseId)) {
      ids.push(p.courseId)
    }
  })

  ids.sort((a, b) => a - b);

  return ids;
}
