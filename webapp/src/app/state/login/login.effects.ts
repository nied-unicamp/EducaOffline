import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, interval, of, race, zip } from 'rxjs';
import { catchError, concatMap, distinctUntilChanged, filter, finalize, map, skip, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { FileApiService } from 'src/app/services/api/file.api.service';
import { LoginApiService } from 'src/app/services/api/login.api.service';
import { SyncApiService } from 'src/app/services/api/sync.api.service';
import { SyncActions } from '../shared/sync/sync.actions';
import { SyncSelectors } from '../shared/sync/sync.selector';
import { keysToSync } from '../state';
import { UserActions } from '../user/user.actions';
import { LoginActions } from './login.actions';
import { loginInitialState } from './login.state';
import { environment } from 'src/environments/environment';
import { LoginSelectors } from './login.selector';

@Injectable()
export class LoginEffects {

  loadFromCache$ = createEffect(() => this.actions$.pipe(
    ofType(LoginActions.loadFromCache.request),
    tap(_ => this.store.dispatch(SyncActions.keys.loadOne.request({ input: { key: 'login' } }))),
    concatMap(_ => race(
      this.actions$.pipe(
        ofType(LoginActions.keyLoaded),
        map(({ data }) => data?.token),
      ),
      this.actions$.pipe(
        ofType(SyncActions.keys.loadOne.error),
        map(_ => undefined)
      )
    ).pipe(
      take(1)
    )),
    concatMap(token => !token?.value
      ? of([
        LoginActions.loadFromCache.error({ error: { message: 'No login info detected' } })
      ])
      : of(true).pipe(
        tap(_ => this.store.dispatch(SyncActions.keys.loadMany({ keys: keysToSync }))),
        concatMap(_ => this.store.select(SyncSelectors.load.pending).pipe(
          filter(pending => pending),
          take(1)
        )),
        concatMap(_ => this.store.select(SyncSelectors.load.pending).pipe(
          filter(pending => !pending),
          take(1)
        )),
        map(_ => [
          LoginActions.loadFromCache.success({ data: null })
        ])
      )
    ),
    concatMap(actions => of(...actions))
  ))




  clear$ = createEffect(() => this.actions$.pipe(
    ofType(LoginActions.clear),
    concatMap(_ => zip(
      this.storeBackup.clear(),
      this.filesBackup.clear(),
    ).pipe(
      finalize(() => {
        window.localStorage.clear()
        console.log('Logged out and cleared all local data! Adios!')
      })
    ))
  ), { dispatch: false });

    // criar um endpoint para enviar um OK quando tiver conexão com a internet
    // aumentar o interval 
  offline$ = createEffect(() => interval(4000).pipe(
    skip(3),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    switchMap(([_, current]) => this.api.getConnectionStatus().pipe(
      filter(isOnline => current != !isOnline),
      map(isOnline => LoginActions.setOffline({ isOffline: !isOnline })),
      catchError((error: any) => {
        if (current == true) { return EMPTY }
        return of(LoginActions.setOffline({ isOffline: true }))
    })
    ))
  ));


  login$ = createEffect(() => this.actions$.pipe(
    ofType(LoginActions.login.request),
    concatMap(({ input }) => this.api.login(input.login).pipe(
      map(token => [
        LoginActions.login.success({ input, data: token }),
        LoginActions.me.request()
      ]),
      catchError((error: any) => of([LoginActions.login.error({ error, input })]))
    )),
    concatMap(actions => of(...actions))
  ));

  me$ = createEffect(() => this.actions$.pipe(
    ofType(LoginActions.me.request),
    concatMap(_ => this.api.getMyProfile().pipe(
      map(me => LoginActions.me.success({ data: me })),
      catchError((error: any) => of(LoginActions.me.error({ error })))
    ))
  ));

  fireMe = createEffect(() => this.actions$.pipe(
    ofType(LoginActions.login.success),
    map(_ => LoginActions.me.request())
  ));

  myUser$ = createEffect(() => this.actions$.pipe(
    ofType(LoginActions.me.success),
    map(action => UserActions.basic.upsert.one({ data: action.data }))
  ));



  isExpired(token: typeof loginInitialState.token) {
    const expiresIn = new Date(token.validUntil);

    const valid = token.value?.length > 0 && expiresIn > new Date();

    return valid;
  }

  constructor(private actions$: Actions, private api: LoginApiService, private store: Store, private storeBackup: SyncApiService,
    private filesBackup: FileApiService) { }
}
