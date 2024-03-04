import { GradesConfigForm, GradesConfigJson } from "src/app/models/grades-config.model";
import { ActionTemplates } from '../shared/template.actions';
import { GradesConfigState } from './grades-config.state';


export const GradesConfigActions = {
  keyLoaded: ActionTemplates.keyLoaded<GradesConfigState>('GradesConfig'),

  get: ActionTemplates.validated.withArgs<{ courseId: number }, GradesConfigJson>('[ GradesConfig / API ] Get an config'),
  editWeights: ActionTemplates.validated.withArgs<{ form: GradesConfigForm, courseId: number }, GradesConfigJson>('[ GradesConfig / API ] Create an config'),
  useArithmeticMean: ActionTemplates.validated.withArgs<{ courseId: number }, GradesConfigJson>('[ GradesConfig / API ] Edit an config'),

  basic: ActionTemplates.basicActions('GradesConfig'),
};
