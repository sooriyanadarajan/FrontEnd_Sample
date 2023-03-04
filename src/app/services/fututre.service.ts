import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Url } from '../shared/constant/url';
import { Constants } from '../shared/constant/constant';
import { HttpHeaders } from '@angular/common/http';
import { Subscription, Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FututreService {

  constructor(
    private http:HttpService,
    private httpclient:HttpClient
  ) { }

  //Create order
  createOrder(id,val){
    return this.http.post(Url.baseUrl + Constants.createFxOrder + id , val)
  }

  //Change Leverage
  changeLeverage(id,val){
    return this.http.post(Url.baseUrl + Constants.changeLeverage + id , val)
  }

  //Change Margin Type
  changeMargin(id, val){
    return this.http.post(Url.baseUrl + Constants.changeMarginType + id , val)
  }

  //Account Info
  accountInfo(id){
    return this.http.get(Url.baseUrl + Constants.accountInfo + id)
  }

  //Pair last and mark price
  PairLastPrice(pair) {
    return fetch(
      "https://fapi.binance.com/fapi/v1/ticker/price?symbol=" + pair,
      {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  }

  PairMarkPrice(pair) {
    return fetch(
      "https://fapi.binance.com/fapi/v1/premiumIndex?symbol=" + pair,
      {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  }

  //Mark price
  markPrice = false;
  mp: WebSocket;
  public markPriceSubs: Subscription;
  MarkPrice(pair) {
    this.markPrice = true;
    this.mp = new WebSocket(
      `wss://fstream.binance.com/stream?streams=${pair.toLowerCase()}@miniTicker/${pair.toLowerCase()}@ticker/${pair.toLowerCase()}@depth@500ms/${pair.toLowerCase()}@aggTrade/${pair.toLowerCase()}@markPrice/!markPrice@arr/!miniTicker@arr`
    );
    return (this.markPriceSubs = Observable.create((observer) => {
      this.mp.onopen = () => {
        // this.mp.send(JSON.stringify({
        //     method: "SUBSCRIBE",
        //     params: [pair.toLowerCase() + "@markPrice", pair.toLowerCase() + "@ticker", pair.toLowerCase() + "@miniTicker", pair.toLowerCase() + "@aggTrade"],
        //     id: 1
        // }))
      };
      this.mp.onmessage = (event) => {
        observer.next(event.data);
      };
    }));
  }

  //Change Position
  changePosition(id, val){
    return this.http.post(Url.baseUrl + Constants.changePosition + id , val)
  }

  //Get positon
  getPosition(id){
    return this.http.get(Url.baseUrl + Constants.getMode + id)
  }

  //Get active position
  getActivePositon(id){
    return this.http.get(Url.baseUrl + Constants.activePosition + id)
  }

  //Change Margin Value
  changeMarginValue(id,val){
    return this.http.post(Url.baseUrl + Constants.changeMarginValue + id , val)
  }

  //Trade History
  tradeHistory(id,val){
    return this.http.post(Url.baseUrl + Constants.tradeHistory + id , val)
  }

  //Delete Trade
  deleteTrade(id, val){
    return this.http.delete(Url.baseUrl + Constants.removeTrade + id + `/` + val);
  }

  //Open Order
  openOrderList(id){
    return this.http.get(Url.baseUrl + Constants.openOrders + id)
  }

  //cancel Open Oder
  cancelOpenOrder(id,val){
    return this.http.post(Url.baseUrl + Constants.cancelOder + id , val)
  }

  //Update Target
  updateTarget(id, val){
    return this.http.patch(Url.baseUrl + Constants.updateTarget + id , val)
  }

  //Add Targe
  addTarget(id, val){
    return this.http.post(Url.baseUrl + Constants.addTarget + id ,val)
  }

  //Update Config BOT
  updateConfigBot(id, val){
    return this.http.patch(Url.baseUrl + Constants.updateConfigBot + id , val)
  }

  //Delete Target
  deleteTarget(id, val){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: val.id,
        target_id:val.target_id
      },
    };
    return this.httpclient.delete(Url.baseUrl + Constants.deleteTarget + id , options)
  }

  //Trade pair list
  tradePair(){
    return this.http.get(Url.baseUrl + Constants.tradePair)
  }

  //Active Bot List
  getBotList(id){
    return this.http.get(Url.baseUrl + Constants.fxBotList + id)
  }

  botList(id){
    return this.http.get(Url.baseUrl + Constants.botList + id)
  }

  availableBots(val){
    return this.http.get(Url.baseUrl + Constants.availableBots + val)
  }

  configFxBotAdd(val,id){
    return this.http.post(Url.baseUrl + Constants.configBotFxAdd + id , val)
  }
}
