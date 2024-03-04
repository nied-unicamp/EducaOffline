import {
  Convert, fromJsonToLastModified, fromJsonToLastModifiedSM, LastModified, LastModifiedJson, LastModifiedSM
} from '.';

export interface ActivityEvaluationJson extends LastModifiedJson {
  id: number;
  comment: string;
  score: number;
}

export interface ActivityEvaluation extends LastModified {
  id: number;
  comment: string;
  score: number;
}

export const fromJsonToActivitySubmission: Convert<ActivityEvaluationJson, ActivityEvaluation> = (json: ActivityEvaluationJson) => {
  return (!json) ? undefined : {
    ...json,
    ...fromJsonToLastModified(json),
  };
}

// TODO: Remove this
export const fromSMToActivityEvaluation: Convert<ActivityEvaluationSM, ActivityEvaluation> = (sm: ActivityEvaluationSM) => {
  return (!sm) ? undefined : {
    ...sm,
    // ...fromJsonToLastModified(sm),
    lastModifiedBy: null,
    lastModifiedDate: null
  } as ActivityEvaluation;
}


export const fromJsonToActivityEvaluationSM: (json: ActivityEvaluationJson) => ActivityEvaluationSM = (json: ActivityEvaluationJson) => {

  return {
    ...json,
    ...fromJsonToLastModifiedSM(json)
  };
}

export interface ActivityEvaluationForm {
  comment: string;
  score: number;
}

export interface ActivityEvaluationSM extends LastModifiedSM {
  id: number;
  comment: string;
  score: number;
}
