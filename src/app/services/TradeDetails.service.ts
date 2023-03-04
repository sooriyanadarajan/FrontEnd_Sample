import { Injectable } from "@angular/core";
import { HttpService } from './http.service';
import { Constants } from '../shared/constant/constant';
import { Url } from '../shared/constant/url';
import { NzThMeasureDirective } from "ng-zorro-antd/table";

@Injectable({providedIn:"root"})
export class PaymentService{
    constructor(private http:HttpService){}

    listPaymentHistory(val){
        return this.http.post(Url.baseUrl + Constants.paymentHistory,val);
    }

    fxTradeHistory(val){
        return this.http.post(Url.baseUrl + Constants.fxTradeHistory,val);
    }

    spotTradeHistory(val){
        return this.http.post(Url.baseUrl + Constants.spotHistory,val);
    }

    activeSpotTradeHistory(val){
        return this.http.post(Url.baseUrl + Constants.spotActiveTrade,val);
    }

    fxOpenPosition(val){
        return this.http.post(Url.baseUrl + Constants.fxOpenPosition,val);
    }
    
}