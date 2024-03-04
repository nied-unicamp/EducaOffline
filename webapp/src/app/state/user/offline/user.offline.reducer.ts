import { combineReducers } from "@ngrx/store";
import { UserOfflineState, userOfflineUpdatedAdapter } from "./user.offline.state";
import { basicReducer, idAndGroupReducer } from "../../shared/template.reducers";


export const userOfflineReducer = combineReducers<UserOfflineState>({
    updated: basicReducer<number>('User / Offline / Updated', userOfflineUpdatedAdapter)
})