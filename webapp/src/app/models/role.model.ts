import { Convert, fromArray } from './index';
import { fromJsonToPermission, Permission, PermissionJson, PermissionSM } from './permission.model';

export interface RoleJson {
  id?: number;
  name?: string;
  permissions?: PermissionJson[];
}

export interface Role {
  id?: number;
  name?: string;
  permissions?: Permission[];
}

export const fromJsonToRole: Convert<RoleJson, Role> = (json: RoleJson) => {
  return (!json) ? undefined : {
    ...json,
    files: fromArray(fromJsonToPermission, json?.permissions),
  };
}


export interface RoleSM {
  id: number;
  name: string;
  permissions: PermissionSM[];
}


