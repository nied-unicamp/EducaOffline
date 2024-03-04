import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap, map, withLatestFrom } from 'rxjs/operators';
import { ParticipationSM, UserAndRoleSM, UsersAndRoles } from 'src/app/models/participation.model';
import { RoleSM } from 'src/app/models/role.model';
import { UserSM } from 'src/app/models/user.model';
import { ParticipationApiService } from 'src/app/services/api/participation.api.service';
import { CourseActions } from '../course/course.actions';
import { RoleActions } from '../role/role.actions';
import { UserActions } from '../user/user.actions';
import { UserSelectors } from '../user/user.selector';
import { ParticipationActions } from './participation.actions';


@Injectable()
export class ParticipationEffects {

  loadOne = createEffect(() => this.actions$.pipe(
    ofType(ParticipationActions.fetchUserRole.request),
    concatMap(({ input }) => this.api.getRole(input.courseId, input.userId).pipe(
      map(data => ParticipationActions.fetchUserRole.success({ data, input })),
      catchError((error: any) => of(ParticipationActions.fetchUserRole.error({ error, input })))
    ))
  ));

  loadOneOk$ = createEffect(() => this.actions$.pipe(
    ofType(ParticipationActions.fetchUserRole.success),
    map(({ input, data }) => {

      const newParticipation = {
        courseId: input.courseId,
        roleId: data.id,
        userId: input.userId
      } as ParticipationSM;

      return [
        RoleActions.upsert({ roles: [data] }),
        ParticipationActions.basic.upsert.one({ data: newParticipation }),
      ];
    }),
    concatMap(actions => of(...actions))
  ));


  loadByCourse$ = createEffect(() => this.actions$.pipe(
    ofType(ParticipationActions.fetchAllUsersWithRoles.request),
    concatMap(({ input }) => this.api.getUserWithRoles(input.courseId).pipe(
      map(data => ParticipationActions.fetchAllUsersWithRoles.success({ data, input })),
      catchError((error: any) => of(ParticipationActions.fetchAllUsersWithRoles.error({ error, input })))
    ))
  ));

  loadByCourseOk$ = createEffect(() => this.actions$.pipe(
    ofType(ParticipationActions.fetchAllUsersWithRoles.success),
    flatMap(action => {
      const { users, roles, participation } = this.separateUserAndRoles(action.input.courseId, action.data);

      return [
        RoleActions.upsert({ roles }),
        UserActions.basic.upsert.many({ data: users }),
        ParticipationActions.basic.upsert.many({ data: participation }),
      ];
    })
  ));


  fetchRolesAndCourses$ = createEffect(() => this.actions$.pipe(
    ofType(ParticipationActions.fetchRolesAndCourses.request),
    concatMap(_ => this.api.getCoursesWithRoles().pipe(
      map(data => ParticipationActions.fetchRolesAndCourses.success({ data })),
      catchError((error: any) => of(ParticipationActions.fetchRolesAndCourses.error({ error })))
    ))
  ));

  fetchRolesAndCoursesOk$ = createEffect(() => this.actions$.pipe(
    ofType(ParticipationActions.fetchRolesAndCourses.success),
    withLatestFrom(this.store.select(UserSelectors.current)),
    flatMap(([{ data: { roles, courses, associations } }, user]) => {
      const participation: ParticipationSM[] = associations.map(a => {
        return { ...a, userId: user?.id };
      })

      return [
        RoleActions.upsert({ roles }),
        CourseActions.basic.upsert.many({ data: courses }),
        ParticipationActions.basic.upsert.many({ data: participation }),
      ];
    })
  ));

  constructor(private actions$: Actions, private api: ParticipationApiService, private store: Store) { }


  separateUserAndRoles(courseId: number, data: UserAndRoleSM[]): UsersAndRoles {
    const users: UserSM[] = [];
    const roles: RoleSM[] = [];

    const participation: ParticipationSM[] = data.map(item => {
      return {
        courseId,
        roleId: item.role.id,
        userId: item.user.id
      }
    });

    data.forEach(item => {
      users.push(item.user);

      if (!roles.find(r => item.role.id === r.id)) {
        roles.push(item.role)
      }
    });

    return { users, roles, participation };
  }
}
