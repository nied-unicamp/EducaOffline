import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/services/app.service';

@Injectable()
export class CanLoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private appService: AppService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
    if (this.appService.isAdmin !== undefined) {
      let url = '/courses';
      console.log('Already logged =D');

      if (route.queryParams?.returnUrl) {
        url = route.queryParams?.returnUrl;
      }
      this.router.navigate([url]);

      return false;
    }
    return true;
  }
}
