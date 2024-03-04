import { Activity, ActivityJson } from 'src/app/models/activity.model';
import { Course, CourseJson } from './course.model';
import { LastModified, LastModifiedJson } from './index';

export interface GradesConfigJson extends LastModifiedJson {
  id?: number;
  course?: CourseJson;
  defaultWeight?: number;
  finalGradesReleased?: string;
  gradedActivities?: ActivityJson[];
  notGradedActivities?: ActivityJson[];
  useArithmeticMean?: boolean;
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
