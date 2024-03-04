import { Convert } from '.';
import { CourseSM } from './course.model';
import { fromJsonToRole, Role, RoleJson, RoleSM } from './role.model';
import { fromJsonToUser, User, UserJson, UserSM } from './user.model';

export interface ParticipationSM {
  courseId: number;
  roleId: number;
  userId: number;
}

export interface UserAndRoleSM {
  user: UserSM;
  role: RoleSM;
}

export interface UsersAndRoles {
  users: UserSM[];
  roles: RoleSM[];
  participation: ParticipationSM[];
}


export interface UserAndRoleJson {
  role?: RoleJson;
  user?: UserJson;
}

export interface UserAndRole {
  role?: Role;
  user?: User;
}

export const fromJsonToUserAndRole: Convert<UserAndRoleJson, UserAndRole> = (json: UserAndRoleJson) => {
  return (!json) ? undefined : {
    ...json,
    role: fromJsonToRole(json?.role),
    user: fromJsonToUser(json?.user),
  };
}

export interface RolesAndCourses {
  roles?: RoleSM[];
  courses?: CourseSM[];
  associations?: { courseId: number, roleId: number }[];
}
