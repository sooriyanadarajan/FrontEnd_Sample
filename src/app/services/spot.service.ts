import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Url } from '../shared/constant/url';
import { Constants } from '../shared/constant/constant';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SpotService {

  constructor(private http:HttpService){}

  //Coin List
  coinList(){
    return this.http.get(Url.baseUrl + Constants.coinList)
  }

  //Current Price
  currentPrice(coin){
    return this.http.get(Url.baseUrl + Constants.currentPrice + coin)
  }

  //Account Balance
  accountBalance(id){
    return this.http.get(Url.baseUrl + Constants.accountBalance+id)
  }

  //Buy Order
  createOrder(val,id){
    return this.http.post(Url.baseUrl + Constants.createOrder+id ,val)
  }

  //Active Trade History
  activeTradeList(id){
    return this.http.get(Url.baseUrl + Constants.activeTradeList + id)
  }

  //Edit Active Trade 
  editActiveTrade(id,val){
    return this.http.patch(Url.baseUrl + Constants.editActiveTrade + id ,val)
  }

  //Mannual sell
  mannualSell(id,val){
    return this.http.post(Url.baseUrl + Constants.manualSell + id , val)
  }

  //cancel Active Oder
  cancelActiveOrder(id,val){
    return this.http.delete(Url.baseUrl + Constants.canelActiveOrder + val +`/` + id)
  }

  //Open order History
  openOder(id){
    return this.http.get(Url.baseUrl + Constants.openTradeList + id)
  }

  //Cancel Open Oder
  cancelorder(id,val) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        symbol: val.symbol,
        orderId: val.orderId
      },
    };
    return this.http.deleteMethod(Url.baseUrl + Constants.cancelOpenOder + id , options)
  }

  //Trade History
  tradeHistory(id,val){
    return this.http.post(Url.baseUrl + Constants.spotTradeHistory + id , val)
  }

  //Trade delete
  tradeDelete(val,id){
    return this.http.delete(Url.baseUrl + Constants.deleteTrade + val + `/` + id)
  }

  //Configure BOT
  botEdit(id,val){
    return this.http.patch(Url.baseUrl + Constants.configBotEdit + id , val)
  }

  //configure bot list
  botList(id){
    return this.http.get(Url.baseUrl + Constants.configBotList +  id)
  }

  //Bot ADd
  botAdd(val,id){
    return this.http.post(Url.baseUrl + Constants.configBotAdd + id, val)
  }

}
