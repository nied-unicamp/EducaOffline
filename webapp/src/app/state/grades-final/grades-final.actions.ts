import { GradesFinalJson, GradesOverviewJson } from 'src/app/models/grades-final.model';
import { GradesUserOverviewJson } from 'src/app/models/grades-user-overview';
import { ActionTemplates } from '../shared/template.actions';
import { GradesFinalState } from './grades-final.state';


export const GradesFinalActions = {
  keyLoaded: ActionTemplates.keyLoaded<GradesFinalState>('GradesFinal'),

  getOverview: ActionTemplates.validated.withArgs<{ courseId: number }, GradesOverviewJson>('[ GradesFinal / API ] Get the overview'),
  getUserOverview: ActionTemplates.validated.withArgs<{ courseId: number, userId: number }, GradesUserOverviewJson>('[ GradesFinal / API ] Get the user overview'),


  fetchAll: ActionTemplates.validated.withArgs<{ courseId: number }, GradesFinalJson[]>('[ GradesFinal / API ] Load all finals grades'),
  fetch: ActionTemplates.validated.withArgs<{ courseId: number }, GradesFinalJson>('[ GradesFinal / API ] Load my final grades'),

  basic: ActionTemplates.basicActions('GradesFinal'),
};
