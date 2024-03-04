import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Role } from 'src/app/models/role.model';
import { fromJsonToUser, User, UserJson } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserResolverService implements Resolve<Role> {
  constructor(private http: HttpClient, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Role> {

    return this.getUser().pipe(
      map((data: any) => {

        if (data.isAdmin && state.url === '/courses') {
          console.log('Redirecting to admin area');
          this.router.navigate(['/admin']);
        }
        return data;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status !== 0 && error.status !== 504) {
          console.log('Token is not valid!');

          // this.http.logout();

          this.router.navigate(['/login']);
        }
        return of(null);
      })
    );
  }

  getUser(): Observable<User> {
    return this.http.get<UserJson>('me').pipe(
      map(data => fromJsonToUser(data))
    );
  }
}
