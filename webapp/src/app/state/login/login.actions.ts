import { createAction, props } from '@ngrx/store';
import { LoginToken, UserForgotPasswordRequest, UserForgotPasswordResponse, UserLogin } from 'src/app/models/login.model';
import { UserSM } from 'src/app/models/user.model';
import { ActionTemplates } from '../shared/template.actions';
import { LoginState } from './login.state';

export const LoginActions = {

  keyLoaded: ActionTemplates.keyLoaded<LoginState>('Login'),
  setOffline: createAction(`[ Login ] Set offline state to`, props<{ isOffline: boolean }>()),
  loadFromCache: ActionTemplates.validated.noArgs('Load login info from cache'),
  me: ActionTemplates.validated.noArgs<UserSM>('[ Login / API ] Get my user'),
  login: ActionTemplates.validated.withArgs<{ login: UserLogin }, LoginToken>('[ Login / API ] Load one login'),
  forgotPassword: {
    request: ActionTemplates.validated.
      withArgs<{ forgot: UserForgotPasswordRequest }, void>('[ Login / API ] Forgot the password. Request a new one.'),
    changePassword: ActionTemplates.validated
      .withArgs<{ password: UserForgotPasswordResponse }, UserSM>('[ Login / API ] Change forgotten password'),
  },
  clear: createAction(`[ Login ] Clear local data`)
};
