import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Constants } from '../shared/constant/constant';
import { Url } from '../shared/constant/url';

@Injectable({
  providedIn: 'root'
})
export class SubadminService {

  constructor(
    private http:HttpService
  ) { }

  listSubAdmin(){
    return this.http.get(Url.baseUrl + Constants.listSubAdmin);
  }

  createSubAdmin(val){
    return this.http.post(Url.baseUrl + Constants.createSubAdmin , val)
  }

  updateSubAdmin(val){
    return this.http.patch(Url.baseUrl + Constants.updateSubAdmin ,val)
  }

  addSignalAccess(val){
    return this.http.post(Url.baseUrl + Constants.addSignalAccess, val)
  }

  removeSignalAccess(val){
    return this.http.post(Url.baseUrl + Constants.removeSignalAccess,val)
  }
}
