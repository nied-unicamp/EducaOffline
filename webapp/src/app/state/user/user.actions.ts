import { createAction, props } from '@ngrx/store';
import { User, UserJson, UserSM } from 'src/app/models/user.model';
import { ActionTemplates } from '../shared/template.actions';
import { UserState } from './user.state';
import { UserOfflineActions } from './offline/user.offline.actions';


export const UserActions = {
    keyLoaded: ActionTemplates.keyLoaded<UserState>('User'),
    fetchAll: ActionTemplates.validated.noArgs<UserSM[]>('[ User / API ] Load all users'),
    fetchOne: ActionTemplates.validated.withArgs<{ id: number }, UserSM>('[ User / API ] Load one user'),
    select: createAction('[User] Select', props<{ user: number }>()),
    basic: ActionTemplates.basicActions<UserSM, number>('User'),
    editProfile: ActionTemplates.validated.withArgs<{ id: number, form: User }, UserJson>('[ User / API ] Edit profile'),
    offline: UserOfflineActions
};
