import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export enum ApiErrors {
  Offline = 'OfflineError',
  NotFound = 'NotFoundError',
  NotAuthenticated = 'NotAuthenticatedError',
  NotAuthorized = 'NotAuthorizedError',
  Internal = 'UnknownApiError',
  Error = 'Error',
}

export const getErrorType: (response: HttpErrorResponse) => ApiErrors = (response: HttpErrorResponse) => {
  if (!navigator.onLine) {
    return ApiErrors.Offline;
  }


  switch (response.status) {
    case 500:
      return ApiErrors.Internal;
    case 404:
      return ApiErrors.NotFound;
    case 401:
      if (response.error?.error_description === 'Full authentication is required to access this resource') {
        return ApiErrors.NotAuthenticated;
      } else {
        return ApiErrors.NotAuthorized;
      }
    case 0:
    case 504:
      return ApiErrors.Offline;
    default:
      return ApiErrors.Error;
  }
};

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError((response: any) => {

        if (response instanceof HttpErrorResponse) {
          console.log({ errorType: getErrorType(response), data: { request, response } });
        }

        return throwError(response);
      })
    );
  }
}
