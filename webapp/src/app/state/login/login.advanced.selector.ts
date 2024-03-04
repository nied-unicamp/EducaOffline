import { createSelector } from '@ngrx/store';
import { LoginSelectors } from './login.selector';
import { LoginState } from './login.state';


const selectInfoAndToFilePath = createSelector(
  LoginSelectors.state,
  (login: LoginState, props: { path: string }) => `${login.apiUrl}${props.path}?access_token=${login.token.value}`
)

export const LoginAdvancedSelectors = {
  fileDownloadLink: selectInfoAndToFilePath
} as const;
