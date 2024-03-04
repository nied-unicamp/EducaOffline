import { ActivitySubmissionForm, ActivitySubmissionJson, ActivitySubmissionSM } from "src/app/models/activity-submission.model";
import { ActionTemplates } from '../shared/template.actions';
import { ActivitySubmissionState } from './activity-submission.state';
import { FileUploadedJson } from "src/app/models/file-uploaded.model";
import { EditFilesForm } from "src/app/models/activity.model";
import { ActivitySubmissionOfflineActions } from "./offline/activity-submission.offline.actions";


export const ActivitySubmissionActions = {
  keyLoaded: ActionTemplates.keyLoaded<ActivitySubmissionState>('ActivitySubmission'),

  getMine: ActionTemplates.validated.withArgs<{ courseId: number, activityId: number }, ActivitySubmissionJson>('[ ActivitySubmission / API ] Get my submission'),
  getAll: ActionTemplates.validated.withArgs<{ courseId: number, activityId: number }, ActivitySubmissionJson[]>('[ ActivitySubmission / API ] Get all submissions'),
  create: ActionTemplates.validated.withArgs<{ form: ActivitySubmissionForm, courseId: number, activityId: number, userId: number }, ActivitySubmissionJson>('[ ActivitySubmission / API ] Create an submission'),
  edit: ActionTemplates.validated.withArgs<{ form: ActivitySubmissionForm, courseId: number, activityId: number, userId: number, submissionId: number }, ActivitySubmissionJson>('[ ActivitySubmission / API ] Edit an submission'),
  delete: ActionTemplates.validated.withArgs<{ courseId: number, activityId: number, submissionId: number }, void>('[ ActivitySubmission / API ] Delete an submission'),

  filesSync: ActionTemplates.validated.withArgs<{ form: EditFilesForm, courseId: number, submissionId: number, activityId: number }, FileUploadedJson[]>('[ ActivitySubmission / API ] Sync submission files'),
  listFiles: ActionTemplates.validated.withArgs<{ submissionId: number, courseId: number, activityId: number, userId: number }, FileUploadedJson[]>('[ ActivitySubmission / API ] Load file list for one submission'),
  deleteFile: ActionTemplates.validated.withArgs<{ fileName: string, fileId: string, courseId: number, activityId: number, submissionId: number }, void>('[ ActivitySubmission / API ] Delete one file submission'),

  basic: ActionTemplates.basicActions<ActivitySubmissionSM, number>('ActivitySubmission'),
  offline: ActivitySubmissionOfflineActions
};
