import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UserSM } from 'src/app/models/user.model';
import { UserOfflineState, userOfflineStateInitialState } from './offline/user.offline.state';

export interface UserState extends EntityState<UserSM> {
    offline: UserOfflineState
}

export const userAdapter: EntityAdapter<UserSM> = createEntityAdapter<UserSM>();

export const UserInitialState: UserState = userAdapter.getInitialState({
    offline: userOfflineStateInitialState
});
