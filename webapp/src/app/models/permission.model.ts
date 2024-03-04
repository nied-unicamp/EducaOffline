import { Convert } from './index';

export interface PermissionJson {
  id?: number;
  name?: string;
}

export interface Permission {
  id?: number;
  name?: string;
}

export const fromJsonToPermission: Convert<PermissionJson, Permission> = (json: PermissionJson) => {
  return (!json) ? undefined : {
    ...json
  };
}


export interface PermissionSM {
  id: number;
  name: string;
}
