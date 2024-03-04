import { createAction, props } from '@ngrx/store';
import { ActivityForm, ActivityJson, EditFilesForm } from "src/app/models/activity.model";
import { FileUploadedJson } from 'src/app/models/file-uploaded.model';
import { ActionTemplates } from '../shared/template.actions';
import { ActivityState } from './activity.state';
import { ActivityOfflineActions } from './offline/activity.offline.actions';
import { ActivityWeight } from 'src/app/models/grades-config';


export const ActivityActions = {
  keyLoaded: ActionTemplates.keyLoaded<ActivityState>('Activity'),
  fetchAll: ActionTemplates.validated.withArgs<{ courseId: number }, ActivityJson[]>('[ Activity / API ] Load all activities from a course'),
  fetchOne: ActionTemplates.validated.withArgs<{ id: number, courseId: number }, ActivityJson>('[ Activity / API ] Load one activity'),

  create: ActionTemplates.validated.withArgs<{ form: ActivityForm, courseId: number }, ActivityJson>('[ Activity / API ] Create an activity'),
  edit: ActionTemplates.validated.withArgs<{ form: ActivityForm, id: number, courseId: number }, ActivityJson>('[ Activity / API ] Edit an activity'),

  filesSync: ActionTemplates.validated.withArgs<{ form: EditFilesForm, courseId: number, id: number }, FileUploadedJson[]>('[ Activity / API ] Sync activity files'),

  fromCurrentCourse: {
    fetchAll: ActionTemplates.validated.noArgs<ActivityJson[]>('[ Activity / API ] Load all activities from current course'),
    fetchOne: ActionTemplates.validated.withArgs<{ id: number }, ActivityJson>('[ Activity / API ] Load one activity from current course'),
  },
  delete: ActionTemplates.validated.withArgs<{ id: number, courseId: number }, void>('[ Activity / API ] Delete one activity'),

  listFiles: ActionTemplates.validated.withArgs<{ id: number, courseId: number }, FileUploadedJson[]>('[ Activity / API ] Load file list for one activity'),

  releaseGrades: ActionTemplates.validated.withArgs<{ id: number, courseId: number }, ActivityJson>('[ Activity / API ] Release grade of activity'),

  updateWeights: createAction(
    '[ Activity / update / weight ] Update the gradeWeight on many activities',
    props<{ weights: ActivityWeight[] }>()
  ),

  offline: ActivityOfflineActions,
  select: createAction('[Activity] Select Id', props<{ id: number }>()),
  basic: ActionTemplates.basicActions('Activity'),
};
