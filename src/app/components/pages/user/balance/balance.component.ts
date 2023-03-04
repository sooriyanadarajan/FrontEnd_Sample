import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import {  Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NotifyService } from '../../../../services/notification.service';
import { HttpClient } from '@angular/common/http';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { DatePipe } from '@angular/common';
import { SocketService } from '../../../../services/socket.service';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
  providers: [DatePipe]
})
export class BalanceComponent implements OnInit {

  userId;

  constructor(
    private userService:UserService,
    private fb: FormBuilder,
    private http: HttpClient,
    private message:NotifyService,
    private date: DatePipe,
    private socket: SocketService,
    private router:ActivatedRoute
  ) { }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleone = false;
    this.isVisibletwo = false;
    this.withdrawAmt = 0;
    this.confirmVisible = false;
    this.balance = 0;
    this.finalWithdrawAmt = 0;
    this.percent = null;
    this.toCoinType = null;
    this.toCoinValue = 0;
    this.confirmTransfer = false;
    this.isTransferModel = false;
    this.transferAmt = 0;
  }

  ngOnInit(): void {
    // this.userId= localStorage.getItem('userId');
    this.router.params.subscribe((routeParams) => {
      this.userId = routeParams.id;
      this.socket.connect(this.userId);
    });
    this.getspotAllBalance(this.userId);
    this.socket.listen('update_wallet_balance').subscribe((data: any) => {
      data.forEach(element => {
       this.balanceList.forEach(item => {
         if(element.a == item.coin){
           item.free = element.f;
           item.locked = element.l;
          }
       });
         
     });
 });
  
}

ngOnDestroy(){
  this.socket.disconnect();
}
   //coinList
   coinList: any = [];
 

  //All balance
  balanceList:any = [];
  tempBalanceList = [];
  isTableLoad = false;
  searchTextChanged = new Subject<string>();
  searchText = "";
  getspotAllBalance(id){
    this.isTableLoad = true;
    this.userService.allBalance(id).subscribe((res)=>{
      if(res['success']){
        this.balanceList = res['data'];
        this.tempBalanceList = res['data'];
        this.coinList = res['data']
        this.balanceList = this.balanceList.sort((a, b) => b.free - a.free);
        this.isTableLoad = false;
      }
      this.searchTextChanged.pipe(debounceTime(300)).subscribe((val) => {
        if (val == "") {
          this.isTableLoad = false;
          this.balanceList = [...this.tempBalanceList];
        } else {
          this.balanceList = this.tempBalanceList.filter((item) => {
            if (item.coin) {
              this.isTableLoad = false;
              if (item.coin.toLowerCase().includes(val.toLowerCase()))
                return item.coin.toLowerCase().includes(val.toLowerCase());
            }
          });
        }
      });
    })
  }

  Search() {
    this.isTableLoad = true;
    this.searchTextChanged.next(this.searchText);
  }

  //Fx All Balance
  fxBalanceList:any = [];
  tempfxBalaneList = [];

  getFxAllBalance(id){
    this.userService.fxAllBalance(id).subscribe((res)=>{
      if(res['success']){
        this.fxBalanceList = res['data'];
        this.tempfxBalaneList = this.fxBalanceList;
      }
      this.searchTextChanged.pipe(debounceTime(300)).subscribe((val) => {
        if (val == "") {
          this.isTableLoad = false;
          this.fxBalanceList = [...this.tempfxBalaneList];
        } else {
          this.fxBalanceList = this.tempfxBalaneList.filter((item) => {
            if (item.asset) {
              this.isTableLoad = false;
              if (item.asset.toLowerCase().includes(val.toLowerCase()))
                return item.asset.toLowerCase().includes(val.toLowerCase());
            }
          });
        }
      });
    })
  }

  //SPOTAll Balance
  spotBalanceList:any = [];

  getSpotBalance(id){
    this.userService.spotAllBalance(id).subscribe((res)=>{
      if(res['success']){
        this.spotBalanceList = res['data']
      }
    })
  }


  isShown = false;
  isVisible = false;
  isVisibleone = false;
  isVisibletwo = false;
  confirmVisible = false;


    //Deposit
    depositForm: FormGroup;
    depositData;
    elementType: "url" | "canvas" | "img" = "url";
    isLoading = false;
    depositCoinName;
    showModalDeposit(data): void {
      this.depositCoinName = data;
      this.depositData = null;
      this.isLoading = true;
      this.userService.depositAddress(data,this.userId).subscribe((res) => {
        if (!res) {
          this.isLoading = false;
        }
        else {
          this.isLoading = false;
          this.depositData = res['data'];
        }
      })
      this.depositForm = this.fb.group({
        transaction_id: [null, [Validators.required]]
      });
      this.isVisibletwo = true;
    }
  
    //Withdraw
    balance = 0;
    fee = 0.5;
    finalWithdrawAmt = 0;
    withdrawData;
    withdrawForm: FormGroup;
    withdrawAmt:any = 0;
    percenttags = ['25', '50', '75', '100']
    percent;
  
    showModal(data): void {
      this.withdrawForm = this.fb.group({
        receiver_address: [null, [Validators.required]],
        tags: [null],
        amount: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*\.[0-9]{0,2}$')]]
      });
      this.withdrawData = data;
      this.isVisible = true;
      this.balance;
    }
  
   
    handleChange(data): void {
      this.withdrawAmt = ((this.balance / 100) * parseInt(data));
      this.finalWithdrawAmt = this.withdrawAmt - this.fee;
      this.withdrawAmt = parseFloat(this.withdrawAmt).toFixed(6)
      this.exchangeConversion();
    }
  
    Withdraw() {
      let val = {
        receiver_address: this.withdrawForm.value.receiver_address,
        tags: this.withdrawForm.value.tags,
        amount: this.withdrawForm.value.amount,
        fee: this.fee,
        finalamt: this.finalWithdrawAmt
      }
      // this.userService.walletWithdraw(val).subscribe((res) => {
      //   if (res['success']) {
      //     this.message.success(res['message']);
      //   }
      //   else {
      //     this.message.error(res['message']);
      //   }
      // }, (err) => {
      //   this.message.error(err.error.message)
      // })
    }
  
    //Convert
    convertForm: FormGroup;
    fromCoinType;
    fromCoinList;
    toCoinType;
    toCoinValue;
    isConvertLoad = false;
  
    showConfirm() {
      this.isVisibleone = false;
      this.confirmVisible = true
    }
  
    async showModalConvert(data) {
       this.isVisibleone = true;
      this.fromCoinType = data.coin;
      await this.http.get("assets/coinList.json").subscribe(data => {
        this.fromCoinList = data['data'];
      })
      this.toCoinType = this.fromCoinType == 'BTC' ? 'USDT' : 'BTC'
      this.balance = data.free;
      this.convertForm = this.fb.group({
        fromcoin: [null, [Validators.required, Validators.max(this.balance)]],
        tocoin: [null, [Validators.required]]
      });
      this.handleChange(100)
    
    }
  
    Convert() {
      this.isConvertLoad = true;
      let val = {
        symbol: this.fromCoinType == 'USDT' ? this.toCoinType + this.fromCoinType :
          this.fromCoinType + this.toCoinType,
        quantity: this.fromCoinType == 'USDT' ? this.convertForm.value.tocoin : this.convertForm.value.fromcoin,
        side: this.fromCoinType == 'USDT' ? 'BUY' : 'SELL'
      }
      this.userService.walletConvert(val,this.userId).subscribe((res) => {
        if (res['status'] == 200) {
          this.message.success(res['message']);
          this.isConvertLoad = false;
          this.getspotAllBalance(this.userId);
          this.handleCancel();
        }
        else {
          this.message.error(res['message']);
          this.isConvertLoad = false;
        }
      }, (err) => {
        this.message.error(err.error.message);
        this.isConvertLoad = false;
      })
    }
  
    minVal = 0;
    exchangeConversion() {
       if (this.fromCoinType != 'USDT') {
        this.http.get('https://api3.binance.com/api/v3/ticker/24hr?symbol=' + this.fromCoinType + this.toCoinType).subscribe((data: any) => {
          this.toCoinValue = this.withdrawAmt < 0 ? 0 : (data.lastPrice * this.withdrawAmt).toFixed(6);
        });
        }
      else  {
        this.http.get('https://api3.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT').subscribe((data: any) => {
          this.toCoinValue = this.withdrawAmt < 0 ? 1 : (this.withdrawAmt / data.lastPrice).toFixed(6);
        });
       }
      if(this.toCoinType == 'USDT'){
        this.minVal = 10;
        this.convertForm.controls['tocoin'].setValidators([Validators.required,Validators.min(10)]);
        this.convertForm.controls['tocoin'].markAsDirty();
         }else{
        this.minVal = 0.0002;
        this.convertForm.controls['tocoin'].setValidators([Validators.required,Validators.min(0.0002)]);
        this.convertForm.controls['tocoin'].markAsDirty();
        }
    }

    //Transfer
    isTransferModel=false;
    transferAmt:any = 0;
    transferForm:FormGroup;
    transferAsset;
    transferType = 'Spot';
    walletType = 'SPOT';

    showModalTransfer(data,type): void {
      this.walletType = type;
      this.isTransferModel = true;
      this.balance = this.walletType == 'SPOT'?data.free:data.walletBalance;
      this.transferAsset = this.walletType == 'SPOT'?data.coin:data.asset;
      this.transferForm = this.fb.group({
       transferAmt: [null, [Validators.required, Validators.max(this.balance),Validators.min(0.001)]],
       });
     }
   
     handleTransferChange(data): void {
        this.transferAmt = ((this.balance / 100) * parseInt(data));
        this.transferAmt = parseFloat(this.transferAmt).toFixed(6)
      }
   
      confirmTransfer = false;
      showTransferConfirm() {
       this.isTransferModel = false;
       this.confirmTransfer = true
     }
   
     Transfer(){
       let val ={
         type: this.transferType == 'Spot'?'MAIN_UMFUTURE':'UMFUTURE_MAIN',
         asset:this.transferAsset,
         amount:this.transferForm.value.transferAmt
       }
       this.userService.transferFund(val,this.userId).subscribe((res)=>{
         if(res['success']){
          this.message.success(res['message']);
          this.handleCancel();
         }else{
           this.message.error(res['message']);
           this.handleCancel();
         }
       },(err)=>{
         this.message.error(err.error.message);
         this.handleCancel();
       })
     }
   
     copied = 'Copied'
     disableTooltip() {
       this.copied = 'Copied'
       setTimeout(() => {
         this.copied = ''
       }, 1000);
     }
  
    //validation
    amountValidate() {
      this.withdrawAmt = this.withdrawAmt < 0 ? 1 : this.withdrawAmt
    }
  
    clearSearch() {
      this.searchText = "";
      // this.getCoinBalanceList();
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

}
