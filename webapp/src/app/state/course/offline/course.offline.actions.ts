import { createAction, props } from '@ngrx/store';
import { CourseSM } from 'src/app/models/course.model';
import { ActionTemplates } from '../../shared/template.actions';

export const CourseOfflineActions = {
  created: ActionTemplates.arrayActions<number>('Course / Offline / Created'),
  requested: {
    ids: ActionTemplates.arrayActions<number>('Course / Offline / Requested / Ids'),
    all: {
      add: createAction('[ Course / Offline / Requested / All ] Add request to all courses'),
      remove: createAction('[ Course / Offline / Requested / All ] Remove request to all courses'),
    }
  },
  updated: ActionTemplates.basicActions<CourseSM>('Course / Offline / Updated'),
  deleted: ActionTemplates.basicActions<CourseSM>('Course / Offline / Deleted'),
  sync: {
    syncAll: createAction('[ Course / Offline / Sync / All ] Sync all offline changes'),
    created: {
      syncAll: createAction('[ Course / Offline / Sync / Created / All ] Sync All'),
      byId: createAction(
        '[ Course / Offline / Sync / Created / ById ] Sync by id',
        props<{ input: { id: number } }>()
      ),
    },
    requested: {
      syncAll: createAction('[ Course / Offline / Sync / Requested / All Requested ] Sync All'),
      all: createAction('[ Course / Offline / Sync / Requested / All Requested ] Sync all ids'),
      ids: createAction('[ Course / Offline / Sync / Requested / Ids ] Get list of ids'),
      byId: createAction(
        '[ Course / Offline / Sync / Requested / ById ] Sync requested course by id',
        props<{ input: { id: number } }>()
      ),
    },
    updated: {
      syncAll: createAction('[ Course / Offline / Sync / Updated / All ] Sync all'),
      byId: createAction(
        '[ Course / Offline / Sync / Updated / ById ] Sync course modified offline',
        props<{ input: { id: number } }>()
      ),
    },
    deleted: {
      syncAll: createAction('[ Course / Offline / Sync / Deleted / All ] Sync all'),
      byId: createAction(
        '[ Course / Offline / Sync / Deleted / ById ] Sync course deleted offline',
        props<{ input: { id: number } }>()
      ),
    }
  }
}
