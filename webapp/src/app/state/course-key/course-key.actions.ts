import { createAction, props } from '@ngrx/store';
import { CourseKeySM } from 'src/app/models/course-key.model';
import { CourseSM } from 'src/app/models/course.model';
import { ActionTemplates } from '../shared/template.actions';
import { CourseKeyState } from './course-key.state';

export const CourseKeyActions = {
  keyLoaded: ActionTemplates.keyLoaded<CourseKeyState>('CourseKey'),
  api: {
    fetchByKey: ActionTemplates.validated.withArgs<{ key: string }, CourseSM>('[ CourseKey / API ] Get course by key'),
    fetchByCourseId: ActionTemplates.validated.withArgs<{ courseId: number }, CourseKeySM>('[ CourseKey / API ] Get courseKey by courseId'),
  },
  basic: ActionTemplates.basicActions<CourseKeySM>('CourseKey'),
  offline: {
    requested: {
      courseIds: ActionTemplates.arrayActions<number>('CourseKey / Offline / Requested / CourseIds'),
      keys: ActionTemplates.arrayActions<string>('CourseKey / Offline / Requested / Keys'),
    },
    sync: {
      syncAll: createAction('[ CourseKey / Offline / Sync / All ] Sync all offline changes'),
      requested: {
        syncAll: createAction('[ CourseKey / Offline / Sync / Requested / All Requested ] Sync All'),
        byCourseId: createAction(
          '[ CourseKey / Offline / Sync / Requested / ByCourseId ] Sync requested courseKey by courseId',
          props<{ input: { courseId: number } }>()
        ),
        byKey: createAction(
          '[ CourseKey / Offline / Sync / Requested / ByKey ] Sync requested courseKey by key',
          props<{ input: { key: string } }>()
        ),
      },
    }
  }
};
