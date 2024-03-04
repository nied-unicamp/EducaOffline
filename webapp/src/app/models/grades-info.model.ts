import { Convert } from '.';
import { Activity, ActivityJson } from './activity.model';


export interface GradesInfoJson {
  average?: number;
  evaluations?: number;
  activity?: ActivityJson;
  activityId?: number;
  submissions?: number;
}

export interface GradesInfoSM {
  activityId?: number;
  average?: number;
  submissions?: number;
  evaluations?: number;
}

export interface GradesInfo {
  activity: Activity;
  average?: number;
  submissions?: number;
  evaluations?: number;
}

export const fromJsonToGradesInfoSM: Convert<GradesInfoJson, GradesInfoSM> = (json: GradesInfoJson) => {
  return (!json) ? undefined : {
    ...json
  };
}
