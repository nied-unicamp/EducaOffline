import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgForage } from 'ngforage';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginSelectors } from '../state/login/login.selector';
import { UserSelectors } from '../state/user/user.selector';
import { FileApiService } from './api/file.api.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  token: string;
  baseUrl = environment.apiUrl;
  isAdmin: boolean;

  constructor(private http: HttpClient, private readonly ngf: NgForage, private store: Store, private fileStoreApi: FileApiService) {
    this.store.select(LoginSelectors.token.value).subscribe(token => this.token = token);
    this.store.select(UserSelectors.current).pipe(map(user => this.isAdmin = user.isAdmin))
  }
}
