import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Constants } from '../shared/constant/constant';
import { Url } from '../shared/constant/url';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpService) { }

  //All User
  getAllUser(val){
    return this.http.post(Url.baseUrl + Constants.allUser,val)
  }

  //View user
  viewUser(id){
    return this.http.get(Url.baseUrl + Constants.viewUser+'/' + id)
  }

  //Create User
  createUser(val){
    return this.http.post(Url.baseUrl + Constants.createUser,val)
  }

  //Update User
  updateUser(id,val){
    return this.http.patch(Url.baseUrl + Constants.updateUser+id,val)
  }

   //Trade Decision
   tradeDecision(id){
    return this.http.get(Url.baseUrl + Constants.tradeDecision + id)
  }

  tradeFXDecision(id){
    return this.http.get(Url.baseUrl + Constants.tradeFXDecision + id)
  }

  //Daily Profit
  dailyProfit(id){
    return this.http.get(Url.baseUrl + Constants.dailyProfilt+id)
  }

  dailyFXProfit(id){
    return this.http.get(Url.baseUrl + Constants.dailyFXProfilt+id)
  }

  //Signal Accuracy
  spotSignalAccuracy(id){
    return this.http.get(Url.baseUrl + Constants.signalAccuracy + id)
  }

  fxSignalAccuracy(id){
    return this.http.get(Url.baseUrl + Constants.fxsignalAccuracy + id)
  }

  //Current Assets

  getCurrentAssets(id){
    return this.http.get(Url.baseUrl + Constants.currentAssets+id)
  }

  //Wallet
  //All balance
  allBalance(id){
    return this.http.get(Url.baseUrl + Constants.allBalance+id)
  }

  //FX Balance
  fxAllBalance(id){
    return this.http.get(Url.baseUrl + Constants.fxAllBalance+id)
  }

  //SPOT Balance
  spotAllBalance(id){
    return this.http.get(Url.baseUrl + Constants.spotAllBalance+id)
  }

  //Wallet - Deposit
  //Deposit Address
  depositAddress(symbol,userid){
    return this.http.get(Url.baseUrl + Constants.depositAddress + symbol + '/'+userid)
  }

  depositHistory(userid) {
    return this.http.get(Url.baseUrl + Constants.depositHistory + userid);
  }

 
  //Withdraw
  //  withdraw(val) {
  //     return this.http.post(`${this.baseUrl}/transaction`, val);
  //   }

  //Convert
  walletConvert(val,userid) {
    return this.http.post(Url.baseUrl + Constants.convertOrder + userid,val )
  }

  convertHistory(userid) {
    return this.http.get(Url.baseUrl + Constants.convertHistory + userid)
  }


  //Transfer
  transferFund(val,userid){
    return this.http.post(Url.baseUrl + Constants.transferFund + userid,val )
  }

  transferHistory(val,userid){
    return this.http.post(Url.baseUrl + Constants.transferHistory + userid,val)
  }

  //Notifications
  //Get all notifications
  allNotification(id,page,limit){
    return this.http.get(Url.baseUrl + Constants.notification + id + `?limit=`+limit+`&page=`+page)
  }

  //Delete all notification

  deleteNotification(id){
    return this.http.delete(Url.baseUrl+Constants.deleteNotification+id)
  }

  //Activity Log
  activityLog(id,limit,page){
    return this.http.get(Url.baseUrl + Constants.activityLog + id + `?limit=`+limit+`&page=`+page)
  }

  deleteActivityLog(id){
    return this.http.delete(Url.baseUrl + Constants.deleteActivityLog + id)
  }

   //Authorized Devices
   //get Authorized Device
   authorizedDevice(id,limit,page){
    return this.http.get(Url.baseUrl + Constants.authorizedDevices + id + `?limit=`+limit+`&page=`+page)
  }

  //Remove Device
  removeDevice(deviceId){
    return this.http.delete(Url.baseUrl + Constants.removeDevice+deviceId)
  }

  //Subscription History
  subscriptionList(id,limit, page){
    return this.http.get(Url.baseUrl + Constants.userSubscription + id + `?limit=` + limit + `&page=` + page)
  }

  //Cancel Subscription 
  cancelSubscription(id,val){
    return this.http.delete(Url.baseUrl + Constants.cancelSubscription + val + `/` + id)
  }

  //Confirm Email
  confirmEmail(id){
    return this.http.get(Url.baseUrl + Constants.confirmEmail + id)
  }

  //Coin Holdings
  coinHolding(id){
    return this.http.get(Url.baseUrl + Constants.coinHolding + id)
  }

  //Update Authorized Device Status
  updateDeviceStatus(id){
    return this.http.patch(Url.baseUrl + Constants.updateDeviceStatus + id)
  }
}