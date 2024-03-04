import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserJson, UserSM } from 'src/app/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserApiService {

    constructor(private http: HttpClient) { }

    getUsers(): Observable<UserSM[]> {
        return this.http.get<UserSM[]>('users').pipe(take(1));
    }

    getUserByEmail(email: any): Observable<UserJson> {
        const url = `users/email/${email}`

        return this.http.get<UserJson>(url).pipe(take(1));
    } 
}
