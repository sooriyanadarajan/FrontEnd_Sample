import { Injectable } from "@angular/core";
import { HttpService } from '../services/http.service';
import { Url } from '../shared/constant/url';
import { Constants } from '../shared/constant/constant';
@Injectable({providedIn:"root"})
export class SecurityService{
constructor(private http:HttpService){}

    changePassowrd(val:any){
        return this.http.post(Url.baseUrl + Constants.changePassword,val);
    }
    

    getG2F(){
        return this.http.get(Url.baseUrl + Constants.get2F);
    }


    changeG2F(val:any){
        return this.http.post(Url.baseUrl + Constants.changeG2FStatus,val);
    }

    getActiveLog(val:any){
        return this.http.post(Url.baseUrl + Constants.getActiveLog,val);
    }

    get2FAStatus(){
        return this.http.get(Url.baseUrl + Constants.activeStatus2FA);
    }

    //Update Pin
    updatePin(val){
        return this.http.post(Url.baseUrl + Constants.updatePin , val)
    }

    //Verify Pin
    verifyPin(val){
        return this.http.post(Url.baseUrl + Constants.verifyPin , val)
    }

    //Screen lock detail
    getScreenLock(){
        return this.http.get(Url.baseUrl + Constants.screenLock)
    }

}