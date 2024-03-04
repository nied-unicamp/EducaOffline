import { ActivityItemLiteJson } from './activity-item.model';
import { ActivityJson } from './activity.model';
import { Course } from './course.model';
import { FinalGradeJson } from './final-grade';
import { User, UserJson } from './user.model';

export interface GradesFinalJson {
  score?: string;
  user?: UserJson;
}

export interface GradesFinalSM {
  courseId?: number;
  userId?: number;
  score?: string;
}


export const fromJsonToGradesFinalSM: (json: GradesFinalJson & { courseId: number }) => GradesFinalSM = (json: GradesFinalJson & { courseId: number }) => {

  return {
    userId: json?.user?.id,
    courseId: json?.courseId,
    score: json?.score,
  };
}

export interface GradesFinal {
  course?: Course;
  user?: User;
  score?: string;
}

export interface GradesOverviewJson {
  finalGrades?: FinalGradeJson[];
  activities?: ActivityJson[];
  grades?: ActivityItemLiteJson[];
  averageGrades: ActivityAverageGradeJson[];
}

export interface GradesUserOverviewJson {
  activities?: ActivityJson[];
  grades?: ActivityItemLiteJson[];
  finalGrade?: FinalGradeJson;
  averageGrades?: ActivityAverageGradeJson[];
}

export interface ActivityAverageGradeJson {
  activityId?: number;
  average?: number;
}
