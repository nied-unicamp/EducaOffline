import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private appService: AppService;
  constructor(private injector: Injector) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!request.url.startsWith('http')) {
      this.appService = this.injector.get(AppService);

      request = request.clone({
        url: this.appService.baseUrl + request.url
      });
    }

    return next.handle(request);
  }
}
