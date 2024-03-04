import { Convert, fromStringToDate, stringDateToISOString } from '.';

export interface CourseForm {
  name?: string;
  subscriptionBegin?: Date;
  subscriptionEnd?: Date;
  startDate?: Date;
  endDate?: Date;
  info?: string;
  noMaxStudents?: number;
}

export interface CourseJson {
  id?: number;
  name?: string;
  subscriptionBegin?: string;
  subscriptionEnd?: string;
  startDate?: string;
  endDate?: string;
  info?: string;
  noMaxStudents?: number;
}

export interface Course {
  id?: number;
  name?: string;
  subscriptionBegin?: Date;
  subscriptionEnd?: Date;
  startDate?: Date;
  endDate?: Date;
  info?: string;
  noMaxStudents?: number;
  offlineSync: {
    enable: boolean;
    state: CourseFilesState;
    progress: number;
  }
}

export const fromJsonToCourseSM: Convert<CourseJson, CourseSM> = (json: CourseJson) => {
  return (!json) ? undefined : {
    ...json,
    startDate: stringDateToISOString(json?.startDate),
    endDate: stringDateToISOString(json?.endDate),
    subscriptionBegin: stringDateToISOString(json?.subscriptionBegin),
    subscriptionEnd: stringDateToISOString(json?.subscriptionEnd),
    offlineSync: {}
  };
}

export const fromJsonToCourse: Convert<CourseJson, Course> = (json: CourseJson) => {
  return (!json) ? undefined : {
    ...json,
    startDate: fromStringToDate(json?.startDate),
    endDate: fromStringToDate(json?.endDate),
    subscriptionBegin: fromStringToDate(json?.subscriptionBegin),
    subscriptionEnd: fromStringToDate(json?.subscriptionEnd),
  } as Course;
}


export enum CourseFilesState {
  NotPresentLocally = 'NotPresentLocally',
  NeedsToBeDownloaded = 'NeedsToBeDownloaded',
  IsDownloading = 'IsDownloading',
  Downloaded = 'Downloaded',
}

export interface CourseSM {
  id?: number;
  name?: string;
  subscriptionBegin?: string;
  subscriptionEnd?: string;
  startDate?: string;
  endDate?: string;
  info?: string;
  noMaxStudents?: number;
  offlineSync: {
    enable?: boolean;
  };
}
