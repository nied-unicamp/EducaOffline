import { createAction, props } from '@ngrx/store';
import { CourseSM } from 'src/app/models/course.model';
import { ActionTemplates } from '../shared/template.actions';
import { CourseState } from './course.state';
import { CourseOfflineActions } from './offline/course.offline.actions';

export const CourseActions = {
  keyLoaded: ActionTemplates.keyLoaded<CourseState>('Course'),
  api: {
    fetchAll: ActionTemplates.validated.noArgs<CourseSM[]>('[ Course / API ] Load all courses'),
    fetchOne: ActionTemplates.validated.withArgs<{ id: number }, CourseSM>('[ Course / API ] Load one course'),
    update: ActionTemplates.validated.withArgs<{ id: number, body: CourseSM }, CourseSM>('[ Course / API ] Update course'),
    create: ActionTemplates.validated.withArgs<{ body: CourseSM }, CourseSM>('[ Course / API ] Create course'),
    delete: ActionTemplates.validated.withArgs<{ id: number }, CourseSM>('[ Course / API ] Delete course')
  },

  offlineSync: {
    change: createAction('[ Course / Download files ] Enable/Disable', props<{ id: number, enabled: boolean }>()),
  },

  selectId: createAction('[ Course ] Select course id', props<{ id: number }>()),

  basic: ActionTemplates.basicActions<CourseSM>('Course'),
  offline: CourseOfflineActions
};

