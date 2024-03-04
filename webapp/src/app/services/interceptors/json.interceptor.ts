import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class JsonInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (
      ['POST', 'PUT'].includes(request.method) &&
      ['picture', 'files', 'upload', 'download'].some(s => request.url.endsWith(s))
    ) {
      return next.handle(request);
    }

    return next.handle(request.clone({
      setHeaders: { 'Content-Type': 'application/json' }
    }));
  }
}
