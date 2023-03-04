import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Constants } from '../shared/constant/constant';
import { Url } from '../shared/constant/url';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpService, private cookie: CookieService) { }

  getToken() {
    // return this.cookie.get('token');
    return localStorage.getItem('isLoggedIn')
  }

  isLoggednIn() {
    const result = this.getToken();
    return (result == '' || result == null ? false : true);
  }

  login(val) {
    return this.http.post(Url.baseUrl + Constants.login, val)
  }

  logout() {
    return this.http.get(Url.baseUrl + Constants.logout)
  }


  gfVerify(val) {
    return this.http.post(Url.baseUrl + Constants.g2fVerify, val);
  }

  //Idle Time out
  inactivityTime() {
    var time;
    window.onload = resetTimer;
    // DOM Events
    document.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onmousedown = resetTimer; // touchscreen presses
    document.ontouchstart = resetTimer;
    document.onclick = resetTimer;     // touchpad clicks
    document.onkeydown = resetTimer;   // onkeypress is deprectaed
    document.addEventListener('scroll', resetTimer, true); // improved; see comments


    function logout() {
     if (localStorage.getItem('isPinLock') == 'true') {
        location.href = '/auth/lockscreen';
        localStorage.setItem('sessionExpired','true')
        localStorage.setItem('isLoggedIn', '');
      }
    }

    function resetTimer() {
      let setTime = localStorage.getItem('pinTime');
      clearTimeout(time);
      time = setTimeout(logout, 300000)
     }
  }

}
