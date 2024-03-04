import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, race } from 'rxjs';
import { concatMap, delay, filter, map, take } from 'rxjs/operators';
import { LoginSelectors } from '../../state/login/login.selector';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private store: Store<any>;
  constructor(private injector: Injector) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.store = this.injector.get(Store);

    if (request.url.includes('v1/login')) {
      return next.handle(request);
    }

    const storeTimeout$ = of<string>(null).pipe(delay(5000));

    const token$ = this.store.select(LoginSelectors.token.value).pipe(
      filter(value => !!value)
    );




    return race([token$, storeTimeout$]).pipe(
      take(1),
      map(token => {
        if (token && token !== '') {
          return request.clone({
            headers: request.headers.append('Authorization', `Bearer ${token}`)
          });
        }
        return request;
      }),
      concatMap(req => next.handle(req))
    );
  }
}
