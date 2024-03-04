import { createAction, props } from '@ngrx/store';
import { RoleSM } from 'src/app/models/role.model';
import { ActionTemplates } from '../shared/template.actions';
import { RoleState } from './role.state';



export const RoleActions = {
    keyLoaded: ActionTemplates.keyLoaded<RoleState>('Role'),
    // fetchOne: ActionTemplates.validated.withArgs<{ id: number }, Role>('[ Role / API ] Load one role'),
    upsert: createAction('[Role] Upsert', props<{ roles: RoleSM[] }>()),
};
