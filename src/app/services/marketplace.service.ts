import { Injectable } from "@angular/core";

import { HttpService } from '../services/http.service';
import { Url } from '../shared/constant/url';
import { Constants } from '../shared/constant/constant';

@Injectable({providedIn:"root"})
export class MarketPlace{
    constructor(private http:HttpService){}


    listBots(val){
        return this.http.post(Url.baseUrl + Constants.listAllBots,val);
    }

    createBots(val){
        return this.http.post(Url.baseUrl + Constants.createBots,val);
    }

    updateBot(val){
        return this.http.patch(Url.baseUrl + Constants.updateBots,val);
    }

    deleteBots(id){
        return this.http.delete(Url.baseUrl + Constants.deleteBots+id);
    }

    changeBotStatus(id){
        return this.http.get(Url.baseUrl + Constants.changeBotStatus+id);
    }

    availableBots(val){
        return this.http.get(Url.baseUrl + Constants.availableBots + val)
    }
}