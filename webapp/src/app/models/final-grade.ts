import { Convert } from './index';
import { fromJsonToUser, User, UserJson } from './user.model';

export interface FinalGradeJson {
  score?: string;
  user?: UserJson;
}

export interface FinalGrade {
  score?: string;
  user?: User;
}

export const fromJsonToFinalGrade: Convert<FinalGradeJson, FinalGrade> = (json: FinalGradeJson) => {
  return (!json) ? undefined : {
    ...json,
    user: fromJsonToUser(json?.user)
  };
}
