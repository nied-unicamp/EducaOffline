import { ActivityEvaluationForm, ActivityEvaluationJson, ActivityEvaluationSM } from "src/app/models/activity-evaluation.model";
import { ActionTemplates } from '../shared/template.actions';
import { ActivityEvaluationState } from './activity-evaluation.state';
import { ActivityEvaluationOfflineActions } from "./offline/activity-evaluation.offline.actions";
import { IdAndGroupId } from "../shared/template.state";


export const ActivityEvaluationActions = {
  keyLoaded: ActionTemplates.keyLoaded<ActivityEvaluationState>('ActivityEvaluation'),

  get: ActionTemplates.validated.withArgs<{ courseId: number, activityId: number, submissionId: number }, ActivityEvaluationJson>('[ Activity Evaluation / API ] Get an evaluation'),
  create: ActionTemplates.validated.withArgs<{ form: ActivityEvaluationForm, courseId: number, activityId: number, userId: number }, ActivityEvaluationJson>('[ Activity Evaluation / API ] Create an evaluation'),
  edit: ActionTemplates.validated.withArgs<{ form: ActivityEvaluationForm, courseId: number, activityId: number, userId: number, evaluationId: number }, ActivityEvaluationJson>('[ Activity Evaluation / API ] Edit an evaluation'),

  basic: ActionTemplates.basicActions<ActivityEvaluationSM, number>('Activity Evaluation'),
  offline: ActivityEvaluationOfflineActions,
  addGroup: ActionTemplates.basicActions<{courseId: number, evaluationId: number}>('Activity Evaluation / Offline / Add Group')
};
