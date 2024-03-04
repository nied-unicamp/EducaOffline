import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ParticipationSM } from 'src/app/models/participation.model';
import { CourseSelectors } from '../course/course.selector';
import { LoginSelectors } from '../login/login.selector';
import { ParticipationSelectors } from '../participation/participation.selector';
import { roleAdapter as adapter, RoleState as State } from './role.state';


//#region Selectors

// Feature selector
const selectRoleState = createFeatureSelector<State>('roles');


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();


// Composed selectors
const selectRoleIds = createSelector(
  selectRoleState,
  selectIds
);
const selectRoleEntities = createSelector(
  selectRoleState,
  selectEntities
);

const selectRoleById = (roleId: number) => createSelector(
  selectRoleEntities,
  (entities) => entities[roleId]
);

const selectRolesByIds = (ids: number[]) => createSelector(
  selectRoleEntities,
  (entities) => ids?.map(id => entities[id]) ?? []
);

const selectAllRoles = createSelector(
  selectRoleState,
  selectAll
);
const selectRoleTotal = createSelector(
  selectRoleState,
  selectTotal
);

// Get current Id
const selectCurrentParticipationId = createSelector(
  LoginSelectors.loggedUserId,
  CourseSelectors.currentId,
  (userId, courseId) => `${courseId}/${userId}`
);

// Get current
const selectCurrentParticipation = createSelector(
  ParticipationSelectors.entities,
  selectCurrentParticipationId,
  (participationEntities, participationId) => participationEntities[participationId]
);

// Get current Id
const selectCurrentRoleId = createSelector(
  selectCurrentParticipation,
  (participation) => participation?.roleId
);

// Get current
const selectCurrentRole = createSelector(
  selectRoleEntities,
  selectCurrentRoleId,
  (roleEntities, roleId) => roleId ? roleEntities[roleId] : null
);

const selectRolesOfCurrentUser = createSelector(
  selectRoleEntities,
  ParticipationSelectors.ofCurrentUser,
  (roles, participation) => getRoleIds(participation).map(id => roles[id])
)

//#endregion

export const RoleSelectors = {
  state: selectRoleState,
  ids: selectRoleIds,
  entities: selectRoleEntities,
  all: selectAllRoles,
  total: selectRoleTotal,
  currentId: selectCurrentRoleId,
  current: selectCurrentRole,
  ofCurrentUser: selectRolesOfCurrentUser,
  byId: selectRoleById,
  byIds: selectRolesByIds,
};

const getRoleIds = (participation: ParticipationSM[]) => {
  const ids: number[] = [];

  participation.forEach(p => {
    if (!ids.includes(p.roleId)) {
      ids.push(p.roleId)
    }
  })

  ids.sort((a, b) => a - b);

  return ids;
}
