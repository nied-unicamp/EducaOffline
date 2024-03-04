import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { LoginData } from 'src/app/models/login-data';
import { RegisterFinish } from 'src/app/models/register';
import { LoginApiService } from 'src/app/services/api/login.api.service';
import { LoginActions } from 'src/app/state/login/login.actions';
import { LoginSelectors } from 'src/app/state/login/login.selector';

@Injectable()
export class LoginService {

  static translationText = LANGUAGE.login;

  constructor(private api: LoginApiService, private store: Store) {
    this.store.select(LoginSelectors.token.value)
  }

  login(loginData: LoginData) {
    return this.api.login(loginData).pipe(
      tap(value => this.store.dispatch(LoginActions.login.success({ input: { login: loginData }, data: value })))
    );
  }

  forgotPassword(email: string) {
    return this.api.forgotPassword(email)
  }

  changePassword(params: any) {
    return this.api.changePassword(params)
  }

  registerFinish(data: RegisterFinish) {
    return this.api.registerFinish(data)
  }

  getMyProfile() {
    return this.api.getMyProfile()
  }
}
