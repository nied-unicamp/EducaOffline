import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { UserApiService } from './../../services/api/user.api.service';
import { UserActions } from './user.actions';
import { ProfileService } from 'src/app/modules/profile/profile.service';
import { Store } from '@ngrx/store';
import { LoginSelectors } from '../login/login.selector';
import { UserSM } from 'src/app/models/user.model';

@Injectable()
export class UserEffects {

  load$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.fetchAll.request),
    concatMap(_ => this.userApiService.getUsers().pipe(
      map(users => UserActions.fetchAll.success({ data: users })),
      catchError((error: any) => of(UserActions.fetchAll.error({ error })))
    ))
  ));

  editProfile$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.editProfile.request),
    concatMap(({ input }) => this.profileService.updateProfile(input.id, input.form).pipe(
      map(me => UserActions.editProfile.success({ input, data: me })),
      catchError((error: any) => of(UserActions.editProfile.error({ input, error })))
    ))
  ));

  editProfileError$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.editProfile.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([[{ input, error }, _], me]) => {
      const date = new Date();
      const info = { date: date.toISOString() };

      return UserActions.editProfile.offlineError({ input, error, info })
    })
  ));

  editProfileSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.editProfile.success),
    map(({ data }) => {

      const newUser: UserSM = {
        ...data,
        aboutMe: data.aboutMe ? data.aboutMe : ''
      }

      return UserActions.basic.upsert.one({
        data: newUser
      })
    })
  ))

  constructor(private actions$: Actions, private userApiService: UserApiService, private profileService: ProfileService, private store: Store) { }
}
