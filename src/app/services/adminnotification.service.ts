import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Constants } from '../shared/constant/constant';
import { Url } from '../shared/constant/url';

@Injectable({
  providedIn: 'root'
})
export class AdminnotificationService {

  constructor(
    private http:HttpService
  ) { }

  sendNotification(val){
    return this.http.post(Url.baseUrl + Constants.sendNotification,val)
  }

  deleteNotification(val){
    return this.http.delete(Url.baseUrl + Constants.deleteAdminNotification + val)
  }

  listNotification(val){
    return this.http.post(Url.baseUrl + Constants.listNotification,val)
  }
}
