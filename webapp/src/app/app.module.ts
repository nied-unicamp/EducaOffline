import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Actions, EffectsModule, ofType } from '@ngrx/effects';
import { NavigationActionTiming, RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Driver, NgForageConfig } from 'ngforage';
import { take } from 'rxjs/operators';
import { effects, metaReducers, reducers } from 'src/app/state';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoutesComponent } from './dev/routes.component';
import { LoginModule } from './modules/login/login.module';
import { MenuModule } from './modules/menu/menu.module';
import { RegisterModule } from './modules/register/register.module';
import { interceptors } from './services/interceptors';
import { LoginActions } from './state/login/login.actions';
import { AppState } from './state/state';
import { WallModule } from './modules/wall/wall.module';
import { NgxImageCompressorModule } from 'ngx-image-compressor';
@NgModule({
  imports: [
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    BrowserModule,
    RegisterModule,
    LoginModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenuModule,
    WallModule,
    NgxImageCompressorModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: false,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: false,
      },
    }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation,
      routerState: RouterState.Minimal,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 500,
      logOnly: environment.production,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [interceptors, {
    provide: APP_INITIALIZER,
    useFactory: (store: Store<AppState>, actions: Actions) => {
      return () => new Promise((resolve, reject) => {
        store.dispatch(LoginActions.loadFromCache.request());

        actions.pipe(
          ofType(LoginActions.loadFromCache.success, LoginActions.loadFromCache.error),
          take(1),
        ).subscribe(_ => {
          console.log('App Loaded!', new Date());
          resolve(null);
        })
      })
    },
    multi: true,
    deps: [Store, Actions]
  }],
  declarations: [AppComponent, RoutesComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  public constructor(ngfConfig: NgForageConfig, library: FaIconLibrary) {
    library.addIconPacks(fas, far);
    ngfConfig.configure({
      name: 'MyApp',
      driver: [
        // defaults to indexedDB -> webSQL -> localStorage
        Driver.INDEXED_DB,
        Driver.LOCAL_STORAGE,
      ],
    });
  }
}
