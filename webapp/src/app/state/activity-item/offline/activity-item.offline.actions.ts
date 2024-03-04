import { createAction, props } from "@ngrx/store";
import { ActionTemplates } from "../../shared/template.actions";


export const activityItemOfflineActions = {
    requested: {
        groupIds: ActionTemplates.arrayActions<number>('ActivityItem / Offline / Requested / GroupIds'),
    },
    sync: {
        syncAll: createAction('[ ActivityItem / Offline / Sync / All ] Sync all offline changes'),
        requested: {
          syncAll: createAction('[ ActivityItem / Offline / Sync / Requested / All Requested ] Sync All'),
          groupById: createAction(
            '[ ActivityItem / Offline / Sync / Requested / Groups by Id ] Sync a requested group',
            props<{ input: { groupId: number } }>()
          ),
        }
    }
}