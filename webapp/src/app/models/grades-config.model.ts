import { Activity, ActivityJson } from 'src/app/models/activity.model';
import { Course, CourseJson } from './course.model';
import { fromJsonToLastModifiedSM, LastModified, LastModifiedJson, LastModifiedSM } from './index';

export interface GradesConfigJson extends LastModifiedJson {
  id?: number;
  course?: CourseJson;
  defaultWeight?: number;
  finalGradesReleased?: string;
  gradedActivities?: ActivityJson[];
  notGradedActivities?: ActivityJson[];
  useArithmeticMean?: boolean;
}


export interface GradesConfigSM extends LastModifiedSM {
  id?: number;
  courseId?: number;
  defaultWeight?: number;
  finalGradesReleased?: string;
  gradedActivities?: number[];
  notGradedActivities?: number[];
  useArithmeticMean?: boolean;
}

export const fromJsonToGradesConfigSM: (json: GradesConfigJson) => GradesConfigSM = (json: GradesConfigJson) => {

  return {
    id: json?.id,
    courseId: json?.course?.id,
    defaultWeight: json?.defaultWeight,
    finalGradesReleased: json?.finalGradesReleased,
    gradedActivities: json?.gradedActivities?.map(activity => activity.id),
    useArithmeticMean: json?.useArithmeticMean,
    ...fromJsonToLastModifiedSM(json)
  };
}


export interface GradesConfig extends LastModified {
  id?: number;
  course?: Course;
  defaultWeight?: number;
  finalGradesReleased?: Date;
  gradedActivities?: Activity[];
  notGradedActivities?: Activity[];
  useArithmeticMean?: boolean;
}

export interface ActivityWeight {
  activityId?: number;
  weight?: number;
}

export interface GradesConfigForm {
  defaultWeight?: number;
  weights?: ActivityWeight[];
}
