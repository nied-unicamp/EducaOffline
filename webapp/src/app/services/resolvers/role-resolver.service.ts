import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, concatMap, take, tap } from 'rxjs/operators';
import { Role } from 'src/app/models/role.model';
import { LoginSelectors } from 'src/app/state/login/login.selector';
import { ParticipationActions } from 'src/app/state/participation/participation.actions';
import { RoleActions } from 'src/app/state/role/role.actions';
import { RoleAdvancedSelectors } from 'src/app/state/role/role.advanced.selector';
import { ParticipationApiService } from '../api/participation.api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleResolverService implements Resolve<Role> {
  constructor(private store: Store, private participationApiService: ParticipationApiService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Role> {
    const courseId = Number(route.paramMap.get('courseId'));

    return this.store.select(RoleAdvancedSelectors.byCourseId.role(courseId)).pipe(
      take(1),
      tap({
        next: role => {
          if (!(role?.id)) {
            throw new Error('No role found');
          }
        }
      }),
      catchError(_ => {
        return this.store.select(LoginSelectors.loggedUserId).pipe(
          take(1),
          concatMap(userId => this.participationApiService.getRole(courseId, userId).pipe(
            tap(role => {
              this.store.dispatch(RoleActions.upsert({ roles: [role] }));
              this.store.dispatch(ParticipationActions.basic.upsert.one({ data: { courseId, userId, roleId: role.id } }));
            }),
            catchError((error: HttpErrorResponse) => {
              console.log('Error while resolving role.\nMaybe the user is not in the course!');
              console.log({ error });

              this.router.navigate(['/courses']);
              return EMPTY;
            })
          ))
        )
      })
    );
  }
}
