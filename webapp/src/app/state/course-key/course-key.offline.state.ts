import { getArrayAdapter } from '../shared/offline/offline.state';


/******************************* Requested **********************************/
export interface CourseKeyOfflineRequestedState {
  keys: string[];
  courseIds: number[];
}

export const courseKeyOfflineRequestedKeysAdapter = getArrayAdapter<string>();
export const courseKeyOfflineRequestedCourseIdsAdapter = getArrayAdapter<number>();

export const courseKeyOfflineRequestedInitialState: CourseKeyOfflineRequestedState = {
  keys: courseKeyOfflineRequestedKeysAdapter.initialState(),
  courseIds: courseKeyOfflineRequestedCourseIdsAdapter.initialState(),
};

/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface CourseKeyOfflineState {
  requested: CourseKeyOfflineRequestedState;
}

export const courseKeyOfflineInitialState: CourseKeyOfflineState = {
  requested: courseKeyOfflineRequestedInitialState,
};
