import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { RoleSM } from 'src/app/models/role.model';

export interface RoleState extends EntityState<RoleSM> { }

export const roleAdapter: EntityAdapter<RoleSM> = createEntityAdapter<RoleSM>();

export const roleInitialState: RoleState = roleAdapter.getInitialState();
