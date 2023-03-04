import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
/** Inject With Credentials into the request */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private route:Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      req = req.clone({
        withCredentials: true,
      });
      
      return next.handle(req) .pipe(
        catchError((error: HttpErrorResponse) => {
         if(error.status == 401){
            this.route.navigate(['auth/login']);
            localStorage.clear();
          }
           return throwError(error);
        })
      );
  }
}