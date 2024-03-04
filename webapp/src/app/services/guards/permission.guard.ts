import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private router: Router, private sharedService: SharedService, private store: Store) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const permissionsNames: string[] = next.data.checkPermissions;

    console.log('permissionsNames', permissionsNames);

    const permissionObservableArray = permissionsNames.map(permission =>
      this.store.select(ParticipationAdvancedSelectors.hasPermission(permission)).pipe(

        tap(hasPermission => {
          console.log(`Permission ${permission} ${(hasPermission ? 'was' : 'was NOT')} given`);
        })
      )

    );




    return combineLatest(permissionObservableArray).pipe(
      map(p => p.every(item => !!item)),
      tap(allow => {
        if (!allow) {
          console.log('At least one permission was not satisfied. Cancelling navigation');

          if (!this.router.navigated) {
            // Navigating to upper level
            const url = state.url.split('/');
            url.pop();
            this.router.navigate([url.join('/')]);
          }
        }
      })
    )
  }
}
