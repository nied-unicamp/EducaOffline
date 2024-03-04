import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, race } from 'rxjs';
import { concatMap, delay, filter, map, take, tap } from 'rxjs/operators';
import { ParticipationApiService } from 'src/app/services/api/participation.api.service';
import { CourseActions } from 'src/app/state/course/course.actions';
import { ParticipationActions } from 'src/app/state/participation/participation.actions';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { UserSelectors } from 'src/app/state/user/user.selector';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private store: Store, private participationApi: ParticipationApiService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const courseId = Number(route.params['courseId']);
    this.store.dispatch(CourseActions.selectId({ id: courseId }));

    return this.isMember(courseId).pipe(
      tap(member => {
        if (!member) {
          console.log(`You are NOT a member of courseId=${courseId}. Cancelling navigation`);
        }
      })
    );
  }

  isMember(courseId: number): Observable<boolean> {
    const isAdmin$ = this.store.select(UserSelectors.current).pipe(
      map(user => user?.isAdmin),
      filter(isAdmin => isAdmin)
    )

    const validLocalRole$ = this.store.select(ParticipationAdvancedSelectors.current).pipe(
      map(p => !!p?.roleId),
      filter(ok => ok)
    )

    return race(
      isAdmin$,
      validLocalRole$,
      this.checkIfMemberUsingApi(courseId)
    ).pipe(take(1));
  }

  checkIfMemberUsingApi(courseId: number) {
    return of(false).pipe(
      delay(500),
      concatMap(_ => this.participationApi.getCoursesWithRoles().pipe(
        map(roles => {
          this.store.dispatch(ParticipationActions.fetchRolesAndCourses.success({ data: roles }));

          return roles?.associations?.some(value => value?.courseId == courseId && !!value?.roleId)
        })
      ))
    )
  }
}

