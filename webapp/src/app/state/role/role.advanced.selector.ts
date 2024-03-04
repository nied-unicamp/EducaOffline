import { createSelector } from '@ngrx/store';
import { ParticipationAdvancedSelectors } from '../participation/participation.advanced.selector';
import { RoleSelectors } from './role.selector';

const selectRoleId = (courseId: number) => createSelector(
  ParticipationAdvancedSelectors.ofCurrentUser.all,
  (participation) => participation.find(p => p.courseId === courseId)?.roleId
)

const selectRole = (courseId: number) => createSelector(
  RoleSelectors.entities,
  selectRoleId(courseId),
  (roles, roleId) => roleId ? roles[roleId] : undefined
)

export const RoleAdvancedSelectors = {
  byCourseId: {
    id: selectRoleId,
    role: selectRole
  }
}
