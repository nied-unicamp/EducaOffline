import { createSelector } from '@ngrx/store'
import { RoleSM } from 'src/app/models/role.model'
import { CourseSelectors } from '../course/course.selector'
import { LoginSelectors } from '../login/login.selector'
import { RoleSelectors } from '../role/role.selector'
import { UserSelectors } from '../user/user.selector'
import { ParticipationSelectors } from './participation.selector'


const selectFromCurrentCourse = createSelector(
  CourseSelectors.currentId,
  ParticipationSelectors.all,
  (courseId, participation) => participation.filter(p => p.courseId === Number(courseId)),
)

const selectUsersAndRolesFromCurrentCourse = createSelector(
  UserSelectors.entities,
  RoleSelectors.entities,
  selectFromCurrentCourse,
  (users, roles, participation) => participation.map(p => {
    return {
      user: users[p.userId],
      role: roles[p.roleId]
    }
  })
)

const selectAllRolesOfCourse = createSelector(
  RoleSelectors.entities,
  selectFromCurrentCourse,
  (roles, participation) => {
    // Remove Duplicates
    const roleIdsSet = (new Set(participation.map(p => p.roleId)));

    const result = [...roleIdsSet].map(roleId => roles[roleId]);

    // Move teacher position to first, if needed
    const teacherPosition = result.findIndex((role) => role.name === 'TEACHER');
    if (teacherPosition > 0) {
      const teacher = result[teacherPosition];
      result[teacherPosition] = result[0];
      result[0] = teacher;
    }

    return result;

  }
)

const selectFromCurrentUser = createSelector(
  LoginSelectors.loggedUserId,
  ParticipationSelectors.all,
  (userId, participation) => participation.filter(p => p.userId === Number(userId)),
)


const selectCoursesAndRolesForCurrentUser = createSelector(
  CourseSelectors.entities,
  RoleSelectors.entities,
  selectFromCurrentUser,
  (courses, roles, participation) => participation.map(p => {
    return {
      course: courses[p.courseId],
      role: roles[p.roleId]
    }
  })
)

const selectCurrent = createSelector(
  LoginSelectors.loggedUserId,
  CourseSelectors.currentId,
  ParticipationSelectors.all,
  (userId, courseId, participation) => participation.find(p => p.userId == userId && p.courseId == Number(courseId)),
)

const selectCurrentRole = createSelector(
  RoleSelectors.entities,
  selectCurrent,
  (roles, p) => p ? roles[p.roleId] : null
)

const selectCurrentRoleAndCheckPermission = (permission: string) => createSelector(
  selectCurrentRole,
  (role: RoleSM) => role?.permissions?.some(p => p.name === permission)
)



export const ParticipationAdvancedSelectors = {
  ofCurrentCourse: {
    all: selectFromCurrentCourse,
    uniqueRoles: selectAllRolesOfCourse,
    usersAndRoles: selectUsersAndRolesFromCurrentCourse,
  },
  ofCurrentUser: {
    all: selectFromCurrentUser,
    coursesAndRoles: selectCoursesAndRolesForCurrentUser,
  },
  current: selectCurrent,
  currentRole: selectCurrentRole,
  hasPermission: selectCurrentRoleAndCheckPermission
}
