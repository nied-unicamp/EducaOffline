import { createAction, props } from '@ngrx/store';

import { ActionTemplates } from '../../shared/template.actions';
import { IdAndGroupId } from '../../shared/template.state';
import { WallReplySM } from 'src/app/models/wall-comment.model';

export const WallReplyOfflineActions = {
  meta: {
    addOfflineReply: createAction('[ WallReply / Created / Offline ] Add reply to upload later.',
    props<{
      reply: WallReplySM,
      idAndGroup: IdAndGroupId
    }>()),
  },
  created: ActionTemplates.basicActions<IdAndGroupId>('WallReply / Offline / Created'),
  requested: {
    ids: ActionTemplates.arrayActions<IdAndGroupId>('WallReply / Offline / Requested / Ids'),
    groupIds: ActionTemplates.arrayActions<number>('WallReply / Offline / Requested / GroupIds'),
  },
  updated: {
    like: ActionTemplates.idAndGroup('WallReply / Offline / Updated / Like')
  },
  deleted: ActionTemplates.idAndGroup('WallReply / Offline / Deleted'),


  sync: {
    syncAll: createAction('[ WallReply / Offline / Sync / All ] Sync all offline changes'),
    created: {
      syncAll: createAction('[ WallReply / Offline / Sync / Created / All ] Sync All'),
      byId: createAction(
        '[ WallReply / Offline / Sync / Created / ById ] Sync by id',
        props<{ input: IdAndGroupId }>()
      ),
    },
    requested: {
      syncAll: createAction(
        '[ WallReply / Offline / Sync / Requested / All Requested ] Sync All',
    
      ),
      groupById: createAction(
        '[ WallReply / Offline / Sync / Requested / Groups by Id ] Sync a requested group',
        props<{ groupId: number }>()
      ),
    },
    updated: {
      syncAll: createAction('[ WallReply / Offline / Sync / Updated / All Updated ] Sync All'),
      like: createAction(
        '[ WallReply / Offline / Sync / Updated / By Id ] Sync a updated group',
        props<{ input: IdAndGroupId }>()
      ),
    },
    deleted: {
      syncAll: createAction('[ WallReply / Offline / Sync / Deleted / All ] Sync all'),
      byId: createAction(
        '[ WallReply / Offline / Sync / Deleted / ById ] Sync wallReply deleted offline',
        props<{ input: IdAndGroupId }>()
      ),
    }
  }
}
