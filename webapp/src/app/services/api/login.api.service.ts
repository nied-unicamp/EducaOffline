import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LoginToken, UserLogin } from 'src/app/models/login.model';
import { RegisterFinish } from 'src/app/models/register';
import { UserSM } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  constructor(private http: HttpClient) { }

  forgotPassword(email: any): Observable<any> {
    const url = `register/forgotPassword`;

    return this.http.post(url, email).pipe(take(1));
  }

  changePassword(params: any): Observable<any> {
    const url = `register/redefinePassword`;

    return this.http.post(url, params).pipe(take(1));
  }

  registerFinish(register: RegisterFinish): Observable<any> {
    const url = `register/finish`;

    return this.http.post(url, register).pipe(take(1));
  }

  getMyProfile(): Observable<UserSM> {
    return this.http.get<UserSM>('me').pipe(take(1));
  }

  login(login: UserLogin): Observable<LoginToken> {
    return this.http.post<LoginToken>('login', login).pipe(take(1));
  }

  getConnectionStatus(): Observable<boolean> {
    const url = 'connection';
    const randomNumber = Math.floor(Math.random() * 100);
    return this.http.post<number>(url, randomNumber).pipe(map((x) => x === randomNumber), take(1));
  }
}
