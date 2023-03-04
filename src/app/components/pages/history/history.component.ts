import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../services/TradeDetails.service';
import { NotifyService } from '../../../services/notification.service';
import { FututreService } from '../../../services/fututre.service';
import { SpotService } from '../../../services/spot.service'
import { DashboardService } from '../../../services/dashboard.service'
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  //HeaderItem
  dashboardPayment:any = [];
  public SubscriptionAmount=0;
  public NumberSmarttrade=0;
  public NumberFxTrade=0;
  public ActiveSmartTrade=0;
  public ActiveFxTrade=0;
  isTableLoading = false;


  public tradeSide;
  public tabSet = 1;
  public copied = 'Copied';
  value = 100;

  //Table
  pageIndex = 1;
  pageSize = 10;


  //Table1
  pageIndex1 = 1;
  pageSize1 = 10;

  //Table2
  pageIndex2 = 1;
  pageSize2 = 10;

  //Activespottrade Table
  pageIndex3 = 1;
  pageSize3 = 10;

  //FxOpenPoisition Table
  pageIndex4 = 1;
  pageSize4 = 10;

  public paymentHistory = [];
  public paymentHistoryCount;

  public fxTrdeHistory = [];
  public fxTrdeHistoryCount;

  public spotTradeHistory = [];
  public spotTradeHistoryCount;

  
  public activeSpotTradeHistory = [];
  public activeSpotTradeHistoryCount;


  public fxOpenPosition=[];
  public fxOpenPositionCount;


  //Search
  searchTxt:any = ''

  searchSubscription(){
    if(this.searchTxt == '' || this.searchTxt == null || this.searchTxt == undefined){
      this.getPaymentHistory(1, this.pageSize)
    }
  }

  searchTrade:any = ''

  searchTradeSmart(){
    if(this.searchTrade == '' || this.searchTrade == null || this.searchTrade == undefined){
      this.getSpotTradeHistory(1, this.pageSize2)
    }
  }

  searchFX:any = ''

  searchNexfolioFX(){
    if(this.searchFX == '' || this.searchFX == null || this.searchFX == undefined){
      this.getFxTradeHistory(1, this.pageSize1)
    }
  }

  searchActiveTrade:any = ''
  searchActiveSpotTrade(){
    if(this.searchActiveTrade == '' || this.searchActiveTrade == null || this.searchActiveTrade == undefined){
      this.getActiveSpotTradeHistory(1, this.pageSize3)
    }
  }

  FxOpenPosition:any="";
  searchFxOpenPosition(){
    if(this.FxOpenPosition == '' || this.FxOpenPosition == null || this.FxOpenPosition == undefined){
      this.getFxOpenPosition(1, this.pageSize4);
    }
  }


  constructor(private payment: PaymentService, private notify: NotifyService, private future: FututreService, private spot: SpotService,
    private dashboardService:DashboardService) { }

  ngOnInit(): void {
    this.tradeSide = "TRADE";
    this.getPaymentHistory(this.pageIndex, this.pageSize);
    this.getDashboardPayment();
    this.getDashboardSmartTrade();
    this.getFxTrade();
  }

  getDashboardPayment(){
    this.dashboardService.getDashboardPayment().subscribe((res)=>{
      let payment=res['data'].payment;
      payment.forEach(item=>{
        this.SubscriptionAmount=this.SubscriptionAmount+item.price;
      })
    })
  }

  getDashboardSmartTrade(){
    this.dashboardService.getDashboardSmartTrade().subscribe(res=>{
      this.NumberSmarttrade=res['data'].total_trade;
      this.ActiveSmartTrade=res['data'].active_trade;
    })
  }

  getFxTrade(){
    this.dashboardService.getDashboardFx().subscribe(res=>{
      this.NumberFxTrade=res['data'].total_trade;
      this.ActiveFxTrade=res['data'].active_trade;
    })
  }

  change(e) {
    this.getPaymentHistory(1, parseInt(e));
    this.pageSize = parseInt(e);
  }


  change1(e) {
    this.getFxTradeHistory(1, parseInt(e));
    this.pageSize1 = parseInt(e);
  }

  change2(e) {
    this.getSpotTradeHistory(1, parseInt(e));
    this.pageSize2 = parseInt(e);
  }

  //ActiveSpotTrade Pagination Change
  change3(e){
    this.getActiveSpotTradeHistory(1, parseInt(e));
    this.pageSize3 = parseInt(e);
  }

  TabSetChange(e) {
    if (e.index == 0) {
      this.getPaymentHistory(this.pageIndex, this.pageSize);
    } else if (e.index == 1) {
      this.getSpotTradeHistory(this.pageIndex2, this.pageSize2);
    }else if(e.index==2){
      this.getActiveSpotTradeHistory(this.pageIndex3,this.pageSize3);
    }
    else if (e.index == 3) {
      this.getFxTradeHistory(this.pageIndex1, this.pageSize1);
    }else if(e.index==4){
      this.getFxOpenPosition(this.pageIndex4,this.pageSize4);
    } 
  }

  tabChange(e) {
    this.pageIndex2 = 1;
    this.pageSize2 = 10;
    if (e.index == 1) {
      this.tradeSide = "BUY";
      this.isTableLoading = true;
      let val = {
        page: this.pageIndex2,
        limit: this.pageSize2,
        tradeSide: "BUY"
      }
      this.payment.spotTradeHistory(val).subscribe(res => {
        if(res['success']){
          this.spotTradeHistory = res['data']['buysell'];
          this.spotTradeHistoryCount = res['data']['buysellCount'];
          this.isTableLoading = false;
        }
         })
    } else {
      this.tradeSide = "TRADE";
      this.isTableLoading = true;
      let val = {
        page: this.pageIndex2,
        limit: this.pageSize2,
        tradeSide: "TRADE"
      }
      this.payment.spotTradeHistory(val).subscribe(res => {
        if(res['success']){
          this.spotTradeHistory = res['data']['trade'];
          this.spotTradeHistoryCount = res['data']['tradeCount'];  
          this.isTableLoading = false
        }
       })
    }
  }

  getPaymentHistory(index, size) {
    this.isTableLoading = true;
    let val = {
      page: index,
      limit: size,
      key:this.searchTxt == ''?null:this.searchTxt
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.payment.listPaymentHistory(val).subscribe((res) => {
      if (res['success']) {
        this.paymentHistory = res['data']['list'];
        this.paymentHistoryCount = res['data']['count'];
        this.isTableLoading = false
      }else{
        this.isTableLoading = false
      }
    }, error => {
      this.notify.error(error.error.message);
      this.isTableLoading = false
    })
  }


  // getPaymentHistory1(index, size) {
  //   let val = {
  //     page: index,
  //     limit: size,
  //     key:this.searchTxt
  //   }
  //   this.payment.listPaymentHistory(val).subscribe((res) => {
  //     if (res['success']) {
  //       this.paymentHistory = res['data']['list'];
  //       this.paymentHistoryCount = res['data']['count'];
  //     }
  //   }, error => {
  //     this.notify.error(error.error.message);
  //   })
  // }


  getFxTradeHistory(index1, size1) {
    this.isTableLoading = true;
    let val = {
      page: index1,
      limit: size1,
      key:this.searchFX == ''?null:this.searchFX
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.payment.fxTradeHistory(val).subscribe((res) => {
      if(res['status'] == 200){
        this.fxTrdeHistory = res['data']['result'];
        this.fxTrdeHistoryCount = res['data']['count'];  
        this.isTableLoading = false;
      }
      }, error => {
      this.notify.error(error.error.message);
    })
  }

  // getFxTradeHistory1(index1, size1) {
  //   let val = {
  //     page: index1,
  //     limit: size1,
  //     key:this.searchFX
  //   }
  //   this.payment.fxTradeHistory(val).subscribe((res) => {
  //     this.fxTrdeHistory = res['data']['result'];
  //     this.fxTrdeHistoryCount = res['data']['count'];
  //   }, error => {
  //     this.notify.error(error.error.message);
  //   })
  // }

  getSpotTradeHistory(index2, size2) {
     this.isTableLoading = true;
    let val = {
      page: index2,
      limit: size2,
      tradeSide: this.tradeSide,
      key:this.searchTrade == ''?null:this.searchTrade,
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.payment.spotTradeHistory(val).subscribe(res => {
      if(res['success']){
        if(this.tradeSide == 'TRADE'){
          this.spotTradeHistory = res['data']['trade'];
          this.spotTradeHistoryCount = res['data']['tradeCount'];
          }else{
            this.spotTradeHistory = res['data']['buysell'];
            this.spotTradeHistoryCount = res['data']['buysellCount'];
          }
          this.isTableLoading = false;
      }
    
    })
  }
  // getSpotTradeHistory1(index2, size2) {
  //   let val = {
  //     page: index2,
  //     limit: size2,
  //     tradeSide: this.tradeSide,
  //     key:this.searchTrade,
  //   }
  //   this.payment.spotTradeHistory(val).subscribe(res => {
  //     if(this.tradeSide == 'TRADE'){
  //     this.spotTradeHistory = res['data']['trade'];
  //     this.spotTradeHistoryCount = res['data']['tradeCount'];
  //     }else{
  //       this.spotTradeHistory = res['data']['buysell'];
  //       this.spotTradeHistoryCount = res['data']['buysellCount'];
  //     }
  //   })
  // }


  getActiveSpotTradeHistory(index, size) {
    this.isTableLoading = true;
    let val = {
      page: index,
      limit: size,
      key:this.searchActiveTrade == ''? null : this.searchActiveTrade
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.payment.activeSpotTradeHistory(val).subscribe(res => {
      if(res['success']){
        this.activeSpotTradeHistory=res['data']['trade'];
        this.activeSpotTradeHistoryCount=res['data']['tradeCount'];
        this.isTableLoading = false;
      }
      })
  }

  // getActiveSpotTradeHistory1(index, size) {
  //   let val = {
  //     page: index,
  //     limit: size,
  //     key:this.searchActiveTrade
  //   }
  //   this.payment.activeSpotTradeHistory(val).subscribe(res => {
  //       this.activeSpotTradeHistory=res['data']['trade'];
  //       this.activeSpotTradeHistoryCount=res['data']['tradeCount'];
  //   })
  // }

  getFxOpenPosition(index,size){
    this.isTableLoading = true;
    let val = {
      page: index,
      limit: size,
      key:this.FxOpenPosition == ''? null : this.FxOpenPosition
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.payment.fxOpenPosition(val).subscribe(res => {
      if(res['status'] == 200){
        this.fxOpenPosition=res['data'].result;
        this.fxOpenPositionCount=res['data'].count;
        this.isTableLoading = false;
      }
     })
  }

  
  // getFxOpenPosition1(index,size){
  //   let val = {
  //     page: index,
  //     limit: size,
  //     key:this.FxOpenPosition
  //   }
  //   this.payment.fxOpenPosition(val).subscribe(res => {
  //       this.fxOpenPosition=res['data'].result;
  //       this.fxOpenPositionCount=res['data'].count;
  //   })
  // }


  deleteFxHistory(id, user_id) {
    this.future.deleteTrade(id, user_id).subscribe(res => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.fxTrdeHistory.filter(i => i._id !== id);
      }
    }, error => {
      this.notify.error(error.error.message);
    })
  }

  deleteSpotHistory(id, user_id) {
    this.spot.tradeDelete(id, user_id).subscribe(res => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.spotTradeHistory.filter(i => i._id !== id);
      }
    }, error => {
      this.notify.error(error.error.message);
    })
  }

  disableTooltip() {
    this.copied = 'Copied'
    setTimeout(() => {
      this.copied = ''
    }, 1000);
  }

}
