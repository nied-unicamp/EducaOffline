import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoginState as State } from './login.state';


//#region Selectors

// Feature selector
const selectLoginState = createFeatureSelector<State>('login');

// Id selector
const getIsOffline = (state: State) => state.isOffline;
const getEmail = (state: State) => state.email;
const getUserId = (state: State) => state.userId;
const getTokenValue = (state: State) => state.token ? state.token.value : null;
const getTokenValidUntil = (state: State) => state.token ? state.token.validUntil : null;
const getApiUrl = (state: State) => state.apiUrl;

// Composed selectors
const selectIsOffline = createSelector(
  selectLoginState,
  getIsOffline
);
const selectEmail = createSelector(
  selectLoginState,
  getEmail
);
const selectUserId = createSelector(
  selectLoginState,
  getUserId
);
const selectTokenValue = createSelector(
  selectLoginState,
  getTokenValue
);
const selectTokenValidUntil = createSelector(
  selectLoginState,
  getTokenValidUntil
);

const selectApiUrl = createSelector(
  selectLoginState,
  getApiUrl
)


//#endregion

export const LoginSelectors = {
  state: selectLoginState,
  email: selectEmail,
  loggedUserId: selectUserId,
  token: {
    value: selectTokenValue,
    validUntil: selectTokenValidUntil
  } as const,
  apiUrl: selectApiUrl,
  isOffline: selectIsOffline,
} as const;
