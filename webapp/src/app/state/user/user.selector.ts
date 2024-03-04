import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoginSelectors } from '../login/login.selector';
import { userAdapter as adapter, UserState as State } from './user.state';


//#region Selectors

// Feature selector
const selectUserState = createFeatureSelector<State>('users');


// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// Composed selectors
const selectUserIds = createSelector(
  selectUserState,
  selectIds
);
const selectUserEntities = createSelector(
  selectUserState,
  selectEntities
);
const selectAllUsers = createSelector(
  selectUserState,
  selectAll
);
const selectUserTotal = createSelector(
  selectUserState,
  selectTotal
);

// Get current
const selectCurrentUser = createSelector(
  selectUserEntities,
  LoginSelectors.loggedUserId,
  (userEntities, userId) => userEntities[userId]
);


const selectById = (id: number) => createSelector(
  selectUserEntities,
  (entities) => id ? entities[id] : null
);

const selectByIds = (ids: number[]) => createSelector(
  selectUserEntities,
  (entities) => ids?.map(id => entities[id]) ?? []
);

const selectAdmin = createSelector(
  selectAllUsers,
  (users) => users.find(user => user.isAdmin)
)

//#endregion

export const UserSelectors = {
  byId: selectById,
  byIds: selectByIds,
  state: selectUserState,
  ids: selectUserIds,
  entities: selectUserEntities,
  all: selectAllUsers,
  total: selectUserTotal,
  current: selectCurrentUser,
  admin: selectAdmin
};
