import { createAction, props } from '@ngrx/store';
import { ActionTemplates } from '../../shared/template.actions';
import { IdAndGroupId } from '../../shared/template.state';
import { WallCommentSM } from 'src/app/models/wall-comment.model';

export const WallCommentOfflineActions = {
  meta: {
    addOfflineComment: createAction('[ WallComment / Created / Offline ] Add comment to upload later.',
    props<{
      comment: WallCommentSM,
      idAndGroup: IdAndGroupId
    }>()),
  },
  created: ActionTemplates.basicActions<IdAndGroupId>('WallComment / Offline / Created'),
  requested: {
    ids: ActionTemplates.arrayActions<IdAndGroupId>('WallComment / Offline / Requested / Ids'),
    groupIds: ActionTemplates.arrayActions<number>('WallComment / Offline / Requested / GroupIds'),
  },
  updated: {
    like: ActionTemplates.idAndGroup('WallComment / Offline / Updated / Like')
  },
  deleted: ActionTemplates.idAndGroup('WallComment / Offline / Deleted'),


  sync: {
    syncAll: createAction('[ WallComment / Offline / Sync / All ] Sync all offline changes'),
    created: {
      syncAll: createAction('[ WallComment / Offline / Sync / Created / All ] Sync All'),
      byId: createAction(
        '[ WallComment / Offline / Sync / Created / ById ] Sync by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    requested: {
      syncAll: createAction('[ WallComment / Offline / Sync / Requested / All Requested ] Sync All'),
      groupById: createAction(
        '[ WallComment / Offline / Sync / Requested / Groups by Id ] Sync a requested group',
        props<{ groupId: number }>()
      ),
    },
    updated: {
      syncAll: createAction('[ WallComment / Offline / Sync / Updated / All Updated ] Sync All'),
      like: createAction(
        '[ WallComment / Offline / Sync / Updated / By Id ] Sync a updated group',
        props<{ input: IdAndGroupId }>()
      ),
    },
    deleted: {
      syncAll: createAction('[ WallComment / Offline / Sync / Deleted / All ] Sync all'),
      byId: createAction(
        '[ WallComment / Offline / Sync / Deleted / ById ] Sync wallComment deleted offline',
        props<{ input: IdAndGroupId }>()
      ),
    }
  }
}
