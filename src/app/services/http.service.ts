import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public headers: any;
  fileheader: { headers: HttpHeaders };

  constructor(
    private http: HttpClient,
    private router: Router,
     private message: NzMessageService
  ) { }

  SetHeader() {
    const headers = new HttpHeaders({
      // 'Access-Control-Allow-Origin': '*',
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("auth_token") ? localStorage.getItem("auth_token") : ""
    });
    this.headers = { headers: headers };

    const fileheader = new HttpHeaders({
      Authorization: localStorage.getItem("auth_token") ? localStorage.getItem("auth_token") : ""
    });
    this.fileheader = { headers: fileheader };

  }

  ClearCookie() {
    localStorage.clear();
    localStorage.removeItem("user");
    this.router.navigate(["/auth"]);
  }

  handleErrors = (err) => {
    if (err.status === 401) {
        // this.helper.LogOut();
    } else {
        // console.log(err);
        if (err?.error?.inputValid) err.error.message = err.error.errors[0];
        // this.message.error(err.error.message);
        return throwError(err);
    }
};

get(url, params: HttpParams = new HttpParams()): Observable<any> {
    this.SetHeader();
    return this.http
        .get(url, { headers: this.headers, params })
        .pipe(catchError(this.handleErrors));
}

getpublic(
    url,
    params: HttpParams = new HttpParams(),
    headers?
): Observable<any> {
    return this.http
        .get(url, { params, headers })
        .pipe(catchError(this.handleErrors));
}

post(
    url: string,
    body: Object = {},
    params: HttpParams = new HttpParams()
): Observable<any> {
    this.SetHeader();
    // console.log(this.headers);
    return this.http
        .post(url, body, { headers: this.headers, params })
        .pipe(catchError(this.handleErrors));
}

postpublic(
    url: string,
    body: Object = {},
    params: HttpParams = new HttpParams(),
    headers?
): Observable<any> {
    return this.http
        .post(url, body, { headers, params })
        .pipe(catchError(this.handleErrors));
}

put(url: string, body: Object = {}): Observable<any> {
    return this.http.put(url, body).pipe(catchError(this.handleErrors));
}

delete(
    url: string,
    body: Object = {},
    params: HttpParams = new HttpParams()
): Observable<any> {
    return this.http
        .delete(url, { headers: this.headers, params })
        .pipe(catchError(this.handleErrors));
}


deleteMethod(
  url: string,
  body: Object = {},
  params: HttpParams = new HttpParams()
): Observable<any> {
  this.SetHeader();
  return this.http
      .delete(url, body)
      .pipe(catchError(this.handleErrors));
}

patch(
  url: string,
  body: Object = {},
  params: HttpParams = new HttpParams()
): Observable<any> {
  this.SetHeader();
  return this.http
      .patch(url, body, { headers: this.headers, params })
      .pipe(catchError(this.handleErrors));
}
}
