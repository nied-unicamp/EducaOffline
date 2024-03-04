import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectRouteParam } from '../router/router.selector';
import { courseKeyAdapter as adapter, CourseKeyState as State } from './course-key.state';


//#region Selectors

// Feature selector
const selectCourseKeyState = createFeatureSelector<State>('courseKeys');


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// Id selector
const getSelectedCourseKeyId = selectRouteParam('courseKeyId');


// Composed selectors
const selectCourseKeyIds = createSelector(
  selectCourseKeyState,
  selectIds
);
const selectCourseKeyEntities = createSelector(
  selectCourseKeyState,
  selectEntities
);
const selectAllCourseKeys = createSelector(
  selectCourseKeyState,
  selectAll
);
const selectCourseKeyTotal = createSelector(
  selectCourseKeyState,
  selectTotal
);

// Get current
const selectCurrentCourseKey = createSelector(
  selectCourseKeyEntities,
  getSelectedCourseKeyId,
  (courseKeyEntities, courseKeyId) => courseKeyEntities[courseKeyId]
);

const selectById = (id: string) => createSelector(
  selectCourseKeyEntities,
  (entities) => id ? entities[id] : null
);


//#endregion

export const CourseKeySelectors = {
  byId: selectById,
  state: selectCourseKeyState,
  ids: selectCourseKeyIds,
  entities: selectCourseKeyEntities,
  all: selectAllCourseKeys,
  total: selectCourseKeyTotal,
  currentId: getSelectedCourseKeyId,
  current: selectCurrentCourseKey,
};
