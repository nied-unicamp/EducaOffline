import { ActivityEvaluation, ActivityEvaluationJson } from './activity-evaluation.model';
import { ActivitySubmission, ActivitySubmissionJson } from './activity-submission.model';
import { Activity, ActivityJson } from './activity.model';
import { User, UserJson } from './user.model';


export interface ActivityItemJson {
  activity?: ActivityJson;
  user?: UserJson;
  submission?: ActivitySubmissionJson;
  evaluation?: ActivityEvaluationJson;
}

export interface ActivityItemLiteJson {
  activityId?: number;
  userId?: number;
  activitySubmission?: ActivitySubmissionJson;
  activityEvaluation?: ActivityEvaluationJson;
}

export interface ActivityItem {
  activity?: Activity;
  user?: User;
  submission?: ActivitySubmission;
  evaluation?: ActivityEvaluation;
}

export const fromItemLiteJsonToActivityItemSM: (json: ActivityItemLiteJson) => ActivityItemSM = (json: ActivityItemLiteJson) => {

  return {
    activityId: json.activityId,
    userId: json.userId,
    submissionId: json.activitySubmission?.id,
    evaluationId: json.activityEvaluation?.id
  };
}

export const fromJsonToActivityItemSM: (json: ActivityItemJson) => ActivityItemSM = (json: ActivityItemJson) => {

  return {
    activityId: json.activity.id,
    userId: json.user.id,
    submissionId: json.submission?.id,
    evaluationId: json.evaluation?.id
  };
}

export const fromJsonLiteToActivityItemSM: (json: ActivityItemLiteJson) => ActivityItemSM = (json: ActivityItemLiteJson) => {

  return {
    activityId: json.activityId,
    userId: json.userId,
    submissionId: json.activitySubmission?.id,
    evaluationId: json.activityEvaluation?.id
  };
}



export interface ActivityItemSM {
  activityId: number;
  userId: number;
  submissionId: number;
  evaluationId: number;
}
