import { Activity, ActivityJson } from 'src/app/models/activity.model';
import { ActivityAverageGrade, ActivityAverageGradeJson } from './activity-average-grade';
import { ActivityItem, ActivityItemLiteJson } from './activity-item.model';
import { FinalGrade, FinalGradeJson } from './final-grade';

export interface GradesUserOverviewJson {
  activities?: ActivityJson[];
  grades?: ActivityItemLiteJson[];
  finalGrade?: FinalGradeJson;
  averageGrades?: ActivityAverageGradeJson[];
}

export interface GradesUserOverview {
  activities?: Activity[];
  grades?: ActivityItem[];
  finalGrade?: FinalGrade;
  averageGrades?: ActivityAverageGrade[];
}
