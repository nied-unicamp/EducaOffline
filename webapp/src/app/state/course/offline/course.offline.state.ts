import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { CourseSM } from 'src/app/models/course.model';
import { getArrayAdapter } from '../../shared/offline/offline.state';


/******************************* Created **********************************/
export interface CourseOfflineCreatedState {
  ids: number[];
}

export const courseOfflineCreatedAdapter = getArrayAdapter<number>();

export const courseOfflineCreatedInitialState: CourseOfflineCreatedState = {
  ids: courseOfflineCreatedAdapter.initialState()
};


/******************************* Requested **********************************/
export interface CourseOfflineRequestedState {
  ids: number[];
  all: boolean;
}

export const courseOfflineRequestedAdapter = getArrayAdapter<number>();

export const courseOfflineRequestedInitialState: CourseOfflineRequestedState = {
  ids: courseOfflineRequestedAdapter.initialState(),
  all: false,
};

/******************************* Updated **********************************/
export interface CourseOfflineUpdatedState extends EntityState<CourseSM> {
}

export const courseOfflineUpdatedAdapter = createEntityAdapter<CourseSM>({
  selectId: (course) => course.id
});

export const courseOfflineUpdatedInitialState: CourseOfflineUpdatedState = courseOfflineUpdatedAdapter.getInitialState();


/******************************* Deleted **********************************/
export interface CourseOfflineDeletedState extends EntityState<CourseSM> {
}

export const courseOfflineDeletedAdapter = createEntityAdapter<CourseSM>({
  selectId: (course) => course.id
});

export const courseOfflineDeletedInitialState: CourseOfflineDeletedState = courseOfflineDeletedAdapter.getInitialState();



/**************************************************************************/
/******************************* Offline **********************************/
/**************************************************************************/
export interface CourseOfflineState {
  created: CourseOfflineCreatedState;
  requested: CourseOfflineRequestedState;
  updated: CourseOfflineUpdatedState;
  deleted: CourseOfflineDeletedState;
}

export const courseOfflineInitialState: CourseOfflineState = {
  created: courseOfflineCreatedInitialState,
  requested: courseOfflineRequestedInitialState,
  updated: courseOfflineUpdatedInitialState,
  deleted: courseOfflineDeletedInitialState
};
