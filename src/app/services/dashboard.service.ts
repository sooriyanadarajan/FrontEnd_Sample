import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Constants } from '../shared/constant/constant';
import { Url } from '../shared/constant/url';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpService) { }

  getDashboardUser(){
    return this.http.get(Url.baseUrl + Constants.dashboardUser)
  }

  getDashboardBot(){
    return this.http.get(Url.baseUrl + Constants.dashboardBot)
  }

  getDashboardPayment(){
    return this.http.get(Url.baseUrl + Constants.dashboardPayment)
  }

  getDashboardSmartTrade(){
    return this.http.get(Url.baseUrl + Constants.dashboardSmarttrade)
  }

  getDashboardFx(){
    return this.http.get(Url.baseUrl + Constants.dashboardFx)
  }
}
