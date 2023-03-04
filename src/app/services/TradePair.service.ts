import { Injectable } from "@angular/core";
import { HttpService } from './http.service';
import { Constants } from '../shared/constant/constant';
import { Url } from '../shared/constant/url';

@Injectable({providedIn:"root"})
export class TradeService{

    constructor(private http:HttpService){}

    getSpotTradePair(){
        return this.http.get(Url.baseUrl + Constants.getSpotTradePair);
    }

    updateSpotTradePair(val:any){
        return this.http.patch(Url.baseUrl + Constants.updateSpotTradePair,val);
    }

    getFxTradePair(){
        return this.http.get(Url.baseUrl + Constants.getFxTradePair);
    }

    updateFxTradePair(val:any){
        return this.http.patch(Url.baseUrl + Constants.updateFxTradePair,val);
    }

    //Imports 
    importSpotPair(){
        return this.http.get(Url.baseUrl + Constants.importSmartTradePair)
    }

    importFxPair(){
        return this.http.get(Url.baseUrl + Constants.importFxTradePair)
    }

}