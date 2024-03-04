import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { IdAndGroupId } from "../../shared/template.state";

/******************************* Updated **********************************/
export interface UserOfflineUpdatedState extends EntityState<number> {
}

export const userOfflineUpdatedAdapter = createEntityAdapter<number>({
    selectId: (item) => item
});
export const userOfflineUpdatedInitialState = userOfflineUpdatedAdapter.getInitialState();

export interface UserOfflineState {
    updated: UserOfflineUpdatedState;
}

export const userOfflineStateInitialState: UserOfflineState = {
    updated: userOfflineUpdatedInitialState
}