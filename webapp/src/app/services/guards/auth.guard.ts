import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, race } from 'rxjs';
import { delay, filter, map, take } from 'rxjs/operators';
import { AppService } from 'src/app/services/app.service';
import { LoginSelectors } from 'src/app/state/login/login.selector';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  private store: Store<any>;

  constructor(
    private router: Router,
    private appService: AppService,
    private injector: Injector
  ) {
    this.store = this.injector.get(Store);
  }

  canActivateChild = this.canActivate;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {


    const storeTimeout$ = of<boolean>(false).pipe(delay(100));

    const token$ = this.store.select(LoginSelectors.token.value).pipe(
      filter(value => !!value),
      map(_ => true)
    );

    return race([token$, storeTimeout$]).pipe(
      take(1),
      map(tokenIsPresent => {

        if (!tokenIsPresent) {
          console.log('Navigating to login');
          this.router.navigate(
            ['/login'],
            { queryParams: { returnUrl: state.url === '/courses' ? null : state.url } }
          );
        }

        return tokenIsPresent;
      }
      )
    );
  }
}
