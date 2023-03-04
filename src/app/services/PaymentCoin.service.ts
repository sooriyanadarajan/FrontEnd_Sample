import { Injectable } from "@angular/core";
import { HttpService } from '../services/http.service';
import { Constants } from '../shared/constant/constant';
import { Url } from '../shared/constant/url';

@Injectable({providedIn:"root"})
export class PaymentCoinService{
    constructor(private http:HttpService){}


    listPaymentCoin(){
        return this.http.get(Url.baseUrl + Constants.listPaymentCoin);
    }

    createPaymentCoin(val){
        return this.http.post(Url.baseUrl + Constants.createPaymentCoin,val);
    }

    updatePaymentCoin(val){
        return this.http.patch(Url.baseUrl + Constants.updatePaymentCoin,val);
    }

    deletePaymentCoin(id){
        return this.http.delete(Url.baseUrl + Constants.deletePaymentCoin+id);
    }

    changeStatus(id){
        return this.http.get(Url.baseUrl + Constants.statusPaymentCoin+id);
    }

}