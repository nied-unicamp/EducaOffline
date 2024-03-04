import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { UserSelectors } from 'src/app/state/user/user.selector';

@Injectable()
export class AdminGuard implements CanActivate, CanLoad {

  constructor(
    private store: Store
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
    return this.isAdmin();
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAdmin();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAdmin();
  }

  private isAdmin(): Observable<boolean> {

    return this.store.select(UserSelectors.current).pipe(
      filter(user => user !== undefined),
      take(1),
      map(user => user?.isAdmin),
    );
  }
}
