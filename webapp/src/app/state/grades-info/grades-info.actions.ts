import { GradesInfoJson, GradesInfoSM } from 'src/app/models/grades-info.model';
import { ActionTemplates } from '../shared/template.actions';
import { GradesInfoState } from './grades-info.state';


export const GradesInfoActions = {
  keyLoaded: ActionTemplates.keyLoaded<GradesInfoState>('GradesInfo'),

  getSummary: ActionTemplates.validated.withArgs<{ courseId: number }, GradesInfoJson[]>('[ GradesInfo / API ] Get summary'),

  basic: ActionTemplates.basicActions<GradesInfoSM, number>('GradesInfo'),
};
