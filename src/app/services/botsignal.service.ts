import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Constants } from '../shared/constant/constant';
import { Url } from '../shared/constant/url';

@Injectable({
  providedIn: 'root'
})
export class BotsignalService {

  constructor(private http:HttpService) { }

  createSpotSignal(val){
    return this.http.post(Url.baseUrl + Constants.createSpotBotSignal,val)
  }

  createFxSignal(val){
    return this.http.post(Url.baseUrl + Constants.createFxBotSignal , val)
  }

  listSpotSignal(val){
    return this.http.post(Url.baseUrl + Constants.listSpotBotSignal,val)
  }

  listFxSignal(val){
    return this.http.post(Url.baseUrl + Constants.listFxBotSignal, val)
  }

  deleteSpotSignal(id){
    return this.http.delete(Url.baseUrl + Constants.deleteSpotBotSignal + id)
  }

  deleteFxSignal(id){
    return this.http.delete(Url.baseUrl + Constants.deleteFxBotSignal + id)
  }

  botList(){
    return this.http.get(Url.baseUrl + Constants.allBotlist)
  }
}
