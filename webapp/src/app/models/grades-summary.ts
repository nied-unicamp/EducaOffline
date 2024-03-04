import { ActivityJson } from './activity.model';


export interface GradesSummaryJson {
  average?: number;
  evaluations?: number;
  activity?: ActivityJson;
  submissions?: number;
}
