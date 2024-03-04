import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, Action } from "@ngrx/store";
import { ProfileService } from 'src/app/modules/profile/profile.service';
import { UserActions } from "../user.actions";
import { of } from 'rxjs';
import { concatMap, filter, map, take, tap, withLatestFrom } from "rxjs/operators";
import { CourseSelectors } from "../../course/course.selector";
import { AppState } from "../../state";
import { UserOfflineActions } from "./user.offline.actions";
import { UserSM } from "src/app/models/user.model";
import { LoginSelectors } from "../../login/login.selector";
import { userOfflineSelectors } from "./user.offline.selector";
import { OfflineRequestType } from "../../shared/offline/offline.state";
import { UserSelectors } from "../user.selector";

@Injectable()
export class UserOfflineEffects {

    editProfileOffline$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.editProfile.offlineError),
        map(({ input, info }) => {

          let currentUser: UserSM

          this.store.select(UserSelectors.byId(input.id)).pipe(
            tap(user => currentUser = user)
          ).subscribe()

          const newUserSM: UserSM = {
            ...currentUser,
            aboutMe: input.form.aboutMe,
            name: input.form.name,
            language: input.form.language
          }

          console.log(newUserSM)

          this.store.dispatch(UserActions.offline.updated.add.one({
            data: {
                id: input.id
            }
          }))
    
          return UserOfflineActions.meta.editOfflineProfile({
            id: input.form.id,
            profile: newUserSM
          })
        })
    ));

    // ------------------------------------------------
  // ------------------------------------------------
  // SYNC
  // ------------------------------------------------
  // ------------------------------------------------

  // Sync (CRUD) when changes to online
  autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
    filter(isOffline => !isOffline),
    withLatestFrom(this.store.select(userOfflineSelectors.nextAction)),
    filter(([_, type]) => type !== OfflineRequestType.None),
    map(_ => UserActions.offline.sync.syncAll())
  ))

  // Sync all basic operations (CRUD)
  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.offline.sync.syncAll),
    concatMap(_ => of(
        UserActions.offline.sync.updated.syncAll()
    ))
  ));

  // --------------------------------------------------------------
  //  Updated

  syncUpdatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.offline.sync.updated.syncAll),
    concatMap((_) => this.store.select(userOfflineSelectors.updated.ids).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        tap(console.log),
        map(id => UserActions.offline.sync.updated.byId({ input: id.id }))),
      ),
    ))
  ));

  syncUpdatedById$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.offline.sync.updated.byId),
    concatMap(({ input }) => this.store.select(UserSelectors.byId(input)).pipe(
      take(1),
      map(profile => {
        
        let editRequest: Action = UserActions.editProfile.request({
            input: {
              id: profile.id,
              form: profile
            }
          })

        return [
            UserActions.offline.updated.remove.one({ data: input }),
            editRequest
        ];
      })
    )),
    concatMap(actions => of(...actions))
  ));

    constructor(private actions$: Actions, private store: Store<AppState>, private profileService: ProfileService) {}
}