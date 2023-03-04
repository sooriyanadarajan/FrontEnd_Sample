import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Url } from '../shared/constant/url';
import { Constants } from '../shared/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class SitesettingService {

  constructor(
    private http:HttpService
  ) { }

  createSetting(val){
    return this.http.post(Url.baseUrl + Constants.createSiteSetting , val)
  }

  siteSettingList(){
    return this.http.get(Url.baseUrl + Constants.siteSettingList)
  }

  updateSitesetting(val){
    return this.http.patch(Url.baseUrl + Constants.updateSiteSetting , val)
  }

  deleteSiteSetting(id){
    return this.http.delete(Url.baseUrl + Constants.deleteSiteSetting + id)
  }
}
