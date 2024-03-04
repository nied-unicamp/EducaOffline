import { ParticipationSM, RolesAndCourses, UserAndRoleSM } from 'src/app/models/participation.model';
import { RoleSM } from 'src/app/models/role.model';
import { ActionTemplates } from '../shared/template.actions';
import { ParticipationState } from './participation.state';


export const ParticipationActions = {
  keyLoaded: ActionTemplates.keyLoaded<ParticipationState>('Participation'),
  fetchUserRole: ActionTemplates.validated
    .withArgs<{ courseId: number, userId: number }, RoleSM>('[ Role / API ] Load all user role in course'),
  fetchAllUsersWithRoles: ActionTemplates.validated
    .withArgs<{ courseId: number }, UserAndRoleSM[]>('[ Role / API ] Load all roles'),
  fetchRolesAndCourses: ActionTemplates.validated.noArgs<RolesAndCourses>('[ Role / API ] Load roles and courses'),
  basic: ActionTemplates.basicActions<ParticipationSM>('Participation'),
};
