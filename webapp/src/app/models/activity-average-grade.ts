import { Convert } from './index';

export interface ActivityAverageGradeJson {
  activityId?: number;
  average?: number;
}

export interface ActivityAverageGrade {
  activityId?: number;
  average?: number;
}

export const fromJsonToActivityAverageGrade: Convert<ActivityAverageGradeJson, ActivityAverageGrade> = (json: ActivityAverageGradeJson) => {
  return (!json) ? undefined : {
    ...json,
  };
}
