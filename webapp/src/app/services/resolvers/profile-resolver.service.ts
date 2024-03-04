import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { fromJsonToUser, User, UserJson } from 'src/app/models/user.model';
import { ProfileService } from 'src/app/modules/profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolverService implements Resolve<User> {

  constructor(private http: HttpClient, private profileService: ProfileService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<User> | User {
    const profileId = Number(route.paramMap.get('profileId'));

    return this.getProfile(profileId).pipe(
      map(data => {
        console.log(data);
        this.profileService.updateVisitedProfile(data);
        return data;
      }),
      catchError(() => {
        console.log('Could not get profile D=');

        // Return to own profile
        this.router.navigate(['profile']);

        return of(null);
      })
    );
  }

  getProfile(profileId: number): Observable<User> {
    const url = `users/${profileId}`;

    return this.http.get<UserJson>(url).pipe(
      map(data => fromJsonToUser(data))
    );
  }
}
