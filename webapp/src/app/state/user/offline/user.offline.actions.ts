import { createAction, props } from "@ngrx/store";
import { ActionTemplates } from "../../shared/template.actions";
import { UserSM } from "src/app/models/user.model";
import { IdAndGroupId } from "../../shared/template.state";

export const UserOfflineActions = {
    meta: {
        editOfflineProfile: createAction('[ User / Offline ] Save profile to upload later',
            props<{
                profile: UserSM,
                id: number
            }>()),
    },
    updated: ActionTemplates.basicActions('User / Offline / Updated'),
    sync: {
        syncAll: createAction('[ User / Offline / Sync / All ] Sync all offline changes'),
        updated: {
          syncAll: createAction('[ User / Offline / Sync / Updated / All Updated ] Sync All'),
          byId: createAction(
            '[ User / Offline / Sync / Updated / By Id ] Sync a updated item',
            props<{ input: number }>()
          ),
        }
      }
}