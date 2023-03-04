import { Component, OnInit } from '@angular/core';
import { SpotService } from '../../../../services/spot.service';
import { NotifyService } from '../../../../services/notification.service';
import { UserService } from '../../../../services/user.service';
import {  Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { FututreService } from '../../../../services/fututre.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [DatePipe]
})
export class HistoryComponent implements OnInit {

  userId;

   constructor(
    private spotService: SpotService,
    private notify: NotifyService,
    private userService:UserService,
    private fb: FormBuilder,
    private futuresService: FututreService,
    private http: HttpClient,
    private date: DatePipe,
    private router:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.params.subscribe((routeParams) => {
      this.userId = routeParams.id;
    });
    this.changeTrade('TRADE',this.index,this.limit,true);
    this.getspotAllBalance(this.userId);
  }

  
  //SMART TRADE HISTORY
  //Trade history list
  tradehistory= [];
  totalHistoryCount = 0;
  tempTradeHistory = [];
  tempTradeCount = 0;
  isPrevDisable = false;
  index = 1;
  limit = 10;
  historyType = 'TRADE';
  botType;
  botresultData;
  visibleviewresult: boolean = false;

  changeTrade(type, index,limit,status) {
    this.historyType = type;
    this.index = status == true && index != 1 ? 1: index;
     this.isPrevDisable = true;
    let val = {
      limit: limit,
      page: this.index,
      tradeSide: type == 'TRADE' ? type : null
    }
    Object.keys(val).forEach((key) => (val[key] == null || val[key] == 0) && delete val[key]);
    this.spotService.tradeHistory(this.userId,val).subscribe((data: any) => {
      if (data['success']) {
        if (type === 'TRADE') {
          this.tradehistory = data.data.trade;
          this.totalHistoryCount = data.data.tradeCount;
          this.tempTradeCount = this.tempTradeCount + this.tradehistory.length;
          this.isPrevDisable = false;
          this.tradehistory.forEach(element => {
            this.tempTradeHistory.push(element);
          });
        } else {
          this.tradehistory = data.data.buysell;
          this.totalHistoryCount = data.data.buysellCount;
          this.tempTradeCount = this.tempTradeCount + this.tradehistory.length;
          this.isPrevDisable = false;
          this.tradehistory.forEach(element => {
            this.tempTradeHistory.push(element)
          });
        }
      }
    })
  }

  //delete trade history
  deleteTradeDetail(data) {
    this.spotService.tradeDelete(data,this.userId).subscribe((res) => {
      if (res['success']) {
        this.tradehistory = this.tradehistory.filter(d => d._id !== data);
        this.tempTradeHistory = this.tempTradeHistory.filter(d => d._id !== data);
        this.totalHistoryCount = this.totalHistoryCount - 1;
        let val = this.tempTradeHistory.length % 3;
        this.notify.success(res['message']);
       } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  //Wallet History
   //Filters

  //Search or Sort
  statusList = ['Pending', 'Success', 'Cancelled']
  selectedCoin;
  selectedStatus;
  sortDate = null;
  searchTrxid;

  clearData() {
    this.selectedCoin = null;
    this.selectedStatus = null;
    this.sortDate = null;
    this.searchTrxid = null;
    this.depositHistory = this.tempDepositList;
    this.convertHistory = this.converttempList;
    this.transferHistory = this.transferTempHistory;
    // this.depositSearchResult();
  }

  //Date validation
  today = new Date();
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  };

  //Transaction history
  depositHistory: any = [];
  tempDepositList = [];
  depositSearchTextChanged = new Subject<string>();
  depositLoad = false;
  convertHistory = [];

  getDepositHistory() {
    this.depositLoad = true;
    this.userService.depositHistory(this.userId).subscribe((res) => {
      if (res['success']) {
        this.depositHistory = res['data'];
        this.tempDepositList = res['data'];

      }
    })
  }

  SearchDeposit(data) {
    this.depositSearchResult(this.searchTrxid,data)
  }

  depositSearchResult(val,data) {
      if (val == "" || val == null || val == undefined) {
        this.depositHistory = [...data];
        this.depositLoad = false;
      } else {
        let tempdata = data;
        this.depositHistory = tempdata.filter((item) => {
          if (item.txId) {
            if (item.txId.toLowerCase().includes(val.toLowerCase()))
              return item.txId.toLowerCase().includes(val.toLowerCase());
            this.depositLoad = false;
          }
        });
      }
   }

  //Convert 
  convertsearchTextChanged= new Subject<string>();
  convertsearchTrxid;
  converttempList = [];
  convertHis() {
    this.userService.convertHistory(this.userId).subscribe(res => {
      if (res['success']) {
        this.convertHistory = res['data'];
        this.converttempList = res['data']
        this.convertHistory = [...this.converttempList];
      }
    });
  }

  convertSearch() {
    if (this.searchTrxid == "") {
      this.convertHistory = [...this.converttempList];
      this.depositLoad = false;
    } else {
      let tempdata = this.converttempList;
      this.convertHistory = tempdata.filter((item) => {
        if (item.clientOrderId) {
          if (item.clientOrderId.toLowerCase().includes(this.searchTrxid.toLowerCase()))
            return item.clientOrderId.toLowerCase().includes(this.searchTrxid.toLowerCase());
          this.depositLoad = false;
        }
      });
    }
  }

  convertSearchResult() {
    this.convertsearchTextChanged.pipe(debounceTime(300)).subscribe((val) => {
     
    });
  }


  //Transfer History
  transferLoad = false;
  transferHistory = [];
  transferTempHistory: any = [];
  transfersearchTextChanged = new Subject<string>();
  getTransferHistory() {
    this.transferLoad = true;
    let val = {
      type: 'MAIN_UMFUTURE'
    }
    this.userService.transferHistory(val,this.userId).subscribe((res) => {
      if (res['success']) {
        this.transferHistory = res['data']['rows'];
        this.transferTempHistory = res['data']['rows'];
        this.transferLoad = false;
      }
    })
  }

  transferSearch(data) {
    this.transferSearchResult(this.searchTrxid,data)
  }

  transferSearchResult(val,data) {
     if (val == "" || val == null || val == undefined) {
      this.transferHistory = [...data];
      this.transferLoad = false;
    } else {
      let tempdata = data;
      this.transferHistory = tempdata.filter((item) => {
        if (item.tranId) {
          if (((item.tranId).toString()).toLowerCase().includes(val))
            return ((item.tranId).toString()).toLowerCase().includes(val);
          this.transferLoad = false;
        }
      });
    }
  }

  //Search
  depositFilter(coin, symbol) {
    let val = this.selectedStatus == 'Success' ? 1 : this.selectedStatus == 'Pending' ? 0 : this.selectedStatus == 'Cancelled' ? 6 : null;
    let val1;
    if ((coin == null || coin == undefined) && val != null) {
      val1 = {
        status: val,
      }
    }
    else if ((coin != null || coin != undefined) && val == null) {
      val1 = {
        coin: this.selectedCoin,
      }
    }
    else {
      if (this.selectedCoin == undefined   && val != null) {
        val1 = {
          status: val
        }
      } else if (this.selectedCoin != undefined && val != null) {
        val1 = {
          coin: this.selectedCoin,
          status: val
        }
      }
    }
    if (this.sortDate != undefined || this.sortDate != null) {
      let temparr;
      temparr = this.tempDepositList.filter(t => (this.date.transform(new Date(parseInt(t.insertTime)), 'yyyy/MM/dd') >= this.date.transform(this.sortDate[0], 'yyyy/MM/dd') && this.date.transform(new Date(parseInt(t.insertTime)), 'yyyy/MM/dd') <= this.date.transform(this.sortDate[1], 'yyyy/MM/dd')));
      this.depositHistory = temparr;
      if ((this.selectedStatus != null || this.selectedStatus != undefined) || (this.selectedCoin != null || this.selectedCoin != undefined)) {
        this.depositHistory = val1 != undefined ? this.findByTemplate(temparr, val1) : this.depositHistory;
        if (this.depositHistory.length > 0) {
          this.SearchDeposit(this.depositHistory);
        }
        // this.convertSearch();
        // this.depositHistory = this.findByTemplate(temparr, val1)
      }
    } else {
      let temparr = this.tempDepositList;
      this.depositHistory = val1 != undefined ? this.findByTemplate(temparr, val1) : this.depositHistory;
        if (this.depositHistory.length > 0) {
          this.SearchDeposit(this.depositHistory);
        }
        
    }
  }


  //Search
  transferFilter(coin) {
    let val = this.selectedStatus == 'Success' ? 'CONFIRMED' : this.selectedStatus == 'Pending' ? 0 : this.selectedStatus == 'Cancelled' ? 6 : null;
    let val1;
    if ((coin == null || coin == undefined) && val != null) {
      val1 = {
        status: val,
      }
    }
    else if ((coin != null || coin != undefined) && val == null) {
      val1 = {
        asset: this.selectedCoin,
      }
    }
    else {
      if (this.selectedCoin == undefined   && val != null) {
        val1 = {
          status: val
        }
      } else if (this.selectedCoin != undefined && val != null) {
        val1 = {
          asset: this.selectedCoin,
          status: val
        }
      }
    }
       if (this.sortDate != undefined || this.sortDate != null) {
      let temparr;
      temparr = this.transferTempHistory.filter(t => (this.date.transform(new Date(parseInt(t.timestamp)), 'yyyy/MM/dd') >= this.date.transform(this.sortDate[0], 'yyyy/MM/dd') && this.date.transform(new Date(parseInt(t.timestamp)), 'yyyy/MM/dd') <= this.date.transform(this.sortDate[1], 'yyyy/MM/dd')));
      this.transferHistory = temparr;
      if ((this.selectedStatus != null || this.selectedStatus != undefined) || (this.selectedCoin != null || this.selectedCoin != undefined)) {
        this.transferHistory = val1 != undefined ? this.findByTemplate(temparr, val1) : this.transferHistory;
        if (this.transferHistory.length > 0) {
          this.transferSearch(this.transferHistory);
        }
      }
    } else {
      let temparr = this.transferTempHistory;
      this.transferHistory = val1 != undefined ? this.findByTemplate(temparr, val1) : this.transferHistory;
      if (this.transferHistory.length > 0) {
        this.transferSearch(this.transferHistory);
      }
      }
  }



  convertFilter() {
    if (this.sortDate != undefined || this.sortDate != null) {
      let temparr;
      temparr = this.converttempList.filter(t => (this.date.transform(new Date(parseInt(t.transactTime)), 'yyyy/MM/dd') >= this.date.transform(this.sortDate[0], 'yyyy/MM/dd') && this.date.transform(new Date(parseInt(t.transactTime)), 'yyyy/MM/dd') <= this.date.transform(this.sortDate[1], 'yyyy/MM/dd')));
      this.convertHistory = temparr;
    } else if ((this.searchTrxid != null || this.searchTrxid != undefined) && (this.sortDate == undefined || this.sortDate == null)) {
      this.convertSearch();
    }
    else {
      this.convertHistory = this.converttempList;
      this.convertSearch();
    }
  }


  findByTemplate(listArray: Array<any>, template: any) {
    return listArray.filter(element => {
      return Object.keys(template).every(propertyName => element[propertyName] === template[propertyName]);
    });
  }

  //Subscription history
  public isVisible = false;
  public isShown = false;
  public subscriptionList = [];
  subscriptionCount = 0;
  public copied = 'Copied';
  public size = 8;

  getSubscriptionList(index,size) {
    this.userService.subscriptionList(this.userId,size,index).subscribe((res) => {
      if (res['success']) {
        this.subscriptionList = res['data']['history'];
        this.subscriptionCount = res['data']['totalHistory']
      }
    })
  }

  disableTooltip() {
    this.copied = 'Copied'
    setTimeout(() => {
      this.copied = ''
    }, 1000);
  }

  cancelPayment(val,i) {
    this.userService.cancelSubscription(this.userId,val).subscribe((res) => {
      if (res['success']) {
        this.subscriptionList[i].status = 'CANCELLED';
       this.subscriptionList = this.subscriptionList;
       this.notify.success(res['message']);
      
      } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  //Coin List
  coinList = [];
  getspotAllBalance(id){
    this.userService.allBalance(id).subscribe((res)=>{
      if(res['success']){
        this.coinList = res['data']
         }
    })
  }

  //FX trade history
  tradeHistory = [];
  getTradeHistory(index, limit) {
    this.isPrevDisable = true;
    let val = {
      limit: limit,
      page: index
    }
    Object.keys(val).forEach((key) => (val[key] == null || val[key] == 0) && delete val[key]);
    this.futuresService.tradeHistory(this.userId, val).subscribe((res) => {
      if (res['status'] == 200) {
        this.tradeHistory = res['data']['result'];
        this.totalHistoryCount = res['data']['count'];
        this.tempTradeCount = this.tempTradeCount + this.tradeHistory.length;
        this.isPrevDisable = false;
        this.tradeHistory.forEach(element => {
          this.tempTradeHistory.push(element)
        });
      }
    });
  }

  deleteTradeHistory(id) {
    this.futuresService.deleteTrade(id,this.userId).subscribe((res) => {
      if (res['success']) {
        this.tradeHistory = this.tradeHistory.filter(d => d._id !== id);
        this.tempTradeHistory = this.tempTradeHistory.filter(d => d._id !== id);
        this.totalHistoryCount = this.totalHistoryCount - 1;
        let val = this.tempTradeHistory.length % 10;
         this.notify.success(res['message'])
      } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

   //Export 
    //Export
  // withdrawExport() {
  //   let data;
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, 'withdraw.xlsx');

  // }

  depositListData: Array<{
    Sl_No: any; amount: any; coin: any; network: any; deposittime: any;
    address: any; trxId: any; status: any
  }> = []
  depositExport() {
    this.depositListData = [];
    let i = 0
    this.depositHistory.forEach(element => {
      i = i + 1;
      this.depositListData.push({
        Sl_No: i,
        amount: element.amount,
        coin: element.coin,
        network: element.network,
        deposittime: new Date(parseFloat(element.insertTime)),
        address: element.address,
        trxId: element.txId,
        status: element.status == 1 ? 'Completed' : 'Pending'
      })
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.depositListData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'deposit.xlsx');
  }

  convertData: Array<{
    Sl_No: any; symbol: any; clientorderid: any; transactiontime: any; quantity: any;
    executedQty: any; cummulativequoteqty: any; status: any; type: any; side: any
  }> = []
  convertExport() {
    this.convertData = [];
    let i = 0
    this.convertHistory.forEach(element => {
      i = i + 1;
      this.convertData.push({
        Sl_No: i,
        symbol: element.symbol,
        clientorderid: element.clientOrderId,
        transactiontime: new Date(parseInt(element.transactTime)),
        quantity: element.origQty,
        executedQty: element.executedQty,
        cummulativequoteqty: element.cummulativeQuoteQty,
        status: element.status,
        type: element.type,
        side: element.side
      })
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.convertData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'convert.xlsx');
  }

  tempdata: Array<{
    Sl_No: any; amount: any; coin: any;transferTime: any;
    trxId: any; status: any
  }> = []

  transferExport() {
    this.tempdata = [];
    let i = 0
    this.transferTempHistory.forEach(element => {
      i = i + 1;
      this.tempdata.push({
        Sl_No: i,
        amount: element.amount +  element.asset,
        coin: element.asset,
        transferTime: new Date(parseFloat(element.timestamp)),
        trxId: element.tranId,
        status: element.status
      })
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tempdata);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Transfer.xlsx');
  }
}
