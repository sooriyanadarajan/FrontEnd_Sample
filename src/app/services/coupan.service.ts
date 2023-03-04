import { Injectable } from "@angular/core";
import { HttpService } from '../services/http.service';
import { Constants } from '../shared/constant/constant';
import { Url } from '../shared/constant/url';

@Injectable({providedIn:"root"})
export class CoupanService{

    constructor(private http:HttpService){}


    listCoupan(val){
        return this.http.post(Url.baseUrl + Constants.listAllCoupan,val);
    }

    createCoupan(val){
        return this.http.post(Url.baseUrl + Constants.createCoupan,val);
    }


    updateCoupan(val){
        return this.http.patch(Url.baseUrl + Constants.updateCoupan,val);
    }

    deleteCoupan(id){
        return this.http.delete(Url.baseUrl + Constants.deleteCoupan+id);
    }

    changeCoupanStatus(id){
        return this.http.get(Url.baseUrl + Constants.changeCoupanStatus+id);
    }

}