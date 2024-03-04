import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LANGUAGE } from 'src/app/dev/languages';
import { RegisterStart } from 'src/app/models/register';

@Injectable()
export class RegisterService {

  static translationText = LANGUAGE.register;

  constructor(private http: HttpClient) { }


  registerStart(register: RegisterStart): Observable<any> {
    const url = 'register/start';

    return this.http.post(url, register);
  }
}
