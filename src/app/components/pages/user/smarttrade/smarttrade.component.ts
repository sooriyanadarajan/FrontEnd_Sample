import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators, FormControl
} from '@angular/forms';
import { SpotService } from '../../../../services/spot.service';
import { NotifyService } from '../../../../services/notification.service';
import { SocketService } from '../../../../services/socket.service';
declare const TradingView: any;
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-smarttrade',
  templateUrl: './smarttrade.component.html',
  styleUrls: ['./smarttrade.component.scss']
})
export class SmarttradeComponent implements OnInit {
  subscriptions: Subscription[] = [];
  userId;

  //Modal
  isModalVisible: boolean = false;
  isEditBot:boolean = false;
  handleCancel(): void {
    this.isModalVisible = false;
    this.isEditBot = false;
  }

  //Buy Form
  buyForm: FormGroup;
  buyCoin = 'BTCUSDT'

  //Sell Form
  sellForm: FormGroup;
  sellCoin = 'BTCUSDT';

  //Active Trade Edit
  editLimitForm: FormGroup;
  stopLossEditForm: FormGroup;
  botprofitEditForm:FormGroup;

  //Edit config bot
  botEditForm: FormGroup;
  public configbotList = [];
   public editBotData;
  public editStopLoss: boolean = false;
  public editTrailing: boolean = false;
  public editStopLossValue;
  public editTrailingValue;
  public editstopvalue;
  public editFund;
  public editTakeProfit: boolean = false;
  public editProfitValue;
  bottrailingEditForm:FormGroup;
  id:any;

  constructor(
    private fb: FormBuilder,
    private spotService: SpotService,
    private notify: NotifyService,
    private cdref: ChangeDetectorRef,
    private socket: SocketService,
    private router:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.params.subscribe((routeParams) => {
      this.userId = routeParams.id;
      this.socket.connect(this.userId);
    });
    this.getAccountBalance();
    this.getActiveTradeList();
    this.buyForm = this.fb.group({
      fund: [null, [Validators.required]],
      price: [0],
      coinname: [this.buyCoin, [Validators.required]],
      type: ['LIMIT', [Validators.required]],
      percentage: [null],
      stoplossSwitch: [false],
      profitSwitch: [false]
    });

    this.sellForm = this.fb.group({
      fund: [null, [Validators.required]],
      price: [0],
      coinname: [this.sellCoin, [Validators.required]],
      type: ['LIMIT', [Validators.required]],
      percentage: [null],
    });
    this.editLimitForm = this.fb.group({
      editLimit: new FormControl('', [Validators.required, Validators.min(0)])
    });
    this.stopLossEditForm = this.fb.group({
      stopeditValue: new FormControl(0, [Validators.min(0.1), Validators.max(50), Validators.required])
    });
    this.botprofitEditForm = this.fb.group({
      profitValue: new FormControl(0, [Validators.required])
    });
    this.botEditForm = this.fb.group({
      stopLossValue: new FormControl(this.editStopLossValue),
      trailValue: new FormControl(this.editTrailingValue),
      autoValue: new FormControl(this.editProfitValue),
      fundValue: new FormControl(this.editFund, [Validators.required, Validators.min(10)])
    });
    this.bottrailingEditForm = this.fb.group({
      trailingValue: new FormControl(0, [Validators.min(0.1), Validators.max(5), Validators.required])
    })    

    //Socket
    this.socket.listen('active_trade').subscribe((data: any) => {
      this.activeTradeDataList = data;
     this.getAccountBalance();
    })

    this.socket.listen('current_price_spot_trade').subscribe((data: any) => {
      this.id = data._id;
      this.activeTradeDataList.forEach((trade: any) => {
        if (trade._id == this.id) {
          trade.profitPercentage = data.profitPercentage;
          trade.currentPrice = parseFloat(data.currentPrice).toFixed(this.quoteCoinPrecision);
          trade.entryPrice = parseFloat(trade.entryPrice).toFixed(this.quoteCoinPrecision)
          trade.profit = data.profit
        }
      })
    })

    this.socket.listen('new_active_spot_trade').subscribe((data: any) => {
      this.id = data._id;
      let con = false;
      this.activeTradeDataList.forEach((trade: any) => {
        if (trade._id == this.id) {
          con = true;
          trade = data;
        }
      })

      if(con == false){
        this.activeTradeDataList.push(data)
      }
    })

    this.socket.listen('remove_active_spot_trade').subscribe((data: any) => {
      let id = data._id;
      let changeTrade = this.activeTradeDataList.filter((trade: any) => {
        return trade._id !== id;
      })
      this.activeTradeDataList = changeTrade;
    })
    this.socket.listen('remove_spot_open_order').subscribe((data: any) => {
      let id = data.orderId;
      let changeTrade = this.openOrderDataList.filter((trade: any) => {
        return trade.orderId !== id;
      })
      this.openOrderDataList = changeTrade;
    });
    this.socket.listen('add_spot_open_order').subscribe((data: any) => {
      this.openOrderDataList.push(data);
      // this.GetOpenOrders();
    })
  }

  ngOnDestroy(){
    this.socket.disconnect();
    this.subscriptions.forEach((item) => item.unsubscribe());
  }

  //Grpah
  getGraph(val) {
    new TradingView.widget({
      container_id: "spot-analysiss",
      autosize: true,
      symbol: "BINANCE:" + val,
      interval: "5",
      timezone: "exchange",
      theme: "light",
      style: "1",
      studies: ["BB@tv-basicstudies"],
      toolbar_bg: "#f1f3f6",
      withdateranges: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      allow_symbol_change: true,
      save_image: false,
      show_popup_button: false,
      locale: "en",
    })
  }

  //CoinList 
  coinDataList = [];
  quoteCoin;
  baseCoin;
  quoteCoinPrecision = 6;
  baseCoinPrecision = 6;

  getCoinList() {
    this.spotService.coinList().subscribe((res) => {
      if (res['success']) {
        this.coinDataList = res['data'];
        this.coinDataList.forEach(element => {
          if (element.symbol == this.buyCoin) {
            this.quoteCoinPrecision = element.quoteAssetPrecision;
            this.baseCoinPrecision = element.baseAssetPrecision;
          }
        });
      }
    })
  }


  //Account Balance
  accountBalance: any = []
  getAccountBalance() {
    this.spotService.accountBalance(this.userId).subscribe((res) => {
      if (res['success']) {
        this.accountBalance = res['data']['balanceDetails'];
      }
    })
  }

  //Current Price
  currentPrice: any = 0;
  minPrice: any = 0;
  maxPrice: any = 0;
  getCurrentPrice(val) {
    return new Promise((resolve: any) => {
      this.subscriptions.push(
     
    this.spotService.currentPrice(val).subscribe((res) => {
      if (res['success']) {
        this.currentPrice = parseFloat(res['data']['price']).toFixed(this.quoteCoinPrecision);
        this.getGraph(this.buyCoin)
      }
      resolve();
    })
      )
  });
  }

  //CurrentUsdt Price
  usdtValue: any = 0
  getCurrentUsdtPrice() {
    this.spotService.currentPrice('BTCUSDT').subscribe((res) => {
      if (res['success']) {
        this.usdtValue = parseFloat(res['data']['price']).toFixed(this.quoteCoinPrecision);
      }
    })
  }

  //Current Usdt price of each coin
  eachUsdtValue: any = 0;
  getUsdtPrice(val) {
    this.spotService.currentPrice(val).subscribe((res) => {
      if (res['success']) {
        this.eachUsdtValue = parseFloat(res['data']['price']);
      }
    });
   }

  //Coin Change
  coinChange(val) {
    if (this.buyCoin.slice(-4) == 'USDT') {
      this.quoteCoin = 'USDT';
    } else {
      this.quoteCoin = 'BTC'
    }
    this.getCoinList();
    this.getCurrentPrice(this.buyCoin);
    if (this.quoteCoin == 'BTC') {
      this.getCurrentUsdtPrice();
    }
     setTimeout(() => {
      this.fundChange(val);
    }, 3000);
    this.getGraph(this.buyCoin)

  }

  //sell Coin Change
  result = false;
  sellCoinChange(val) {
    if (this.sellCoin.slice(-4) == 'USDT') {
      this.quoteCoin = 'USDT';
      this.baseCoin = this.sellCoin.slice(0, -4)
    } else {
      this.quoteCoin = 'BTC';
      this.baseCoin = this.sellCoin.slice(0, -3)
    }
    this.getCoinList();
    this.getCurrentPrice(this.sellCoin);
    if (this.quoteCoin == 'BTC') {
      let val = this.baseCoin + 'USDT'
       this.result = this.coinDataList.find(item => item.symbol === val) ? true : false;
      if (this.result) {
        this.getUsdtPrice(this.baseCoin + 'USDT');
      }
      if (!this.result) {
        this.getCurrentUsdtPrice();
      }
    }
    setTimeout(() => {
      this.fundChange(val);
    }, 3000);
    this.getGraph(this.sellCoin)
  }

  //Validation
  //Price Validation
  priceChange(form) {
    if (form == 'Buy') {
      this.minPrice = (this.currentPrice / 100) * 80;
      this.minPrice = parseFloat(this.minPrice).toFixed(this.baseCoinPrecision);
      this.maxPrice = this.currentPrice + ((this.currentPrice / 100) * 5);
      this.maxPrice = parseFloat(this.maxPrice).toFixed(this.baseCoinPrecision);
      this.buyForm.controls["price"].setValidators([
        Validators.min(this.minPrice),
        Validators.max(this.maxPrice),
        Validators.required,
      ]);
    }
    if (form == 'Sell') {
      this.minPrice = (parseFloat(this.currentPrice) - ((this.currentPrice / 100) * 5));
      this.minPrice = parseFloat(this.minPrice).toFixed(this.baseCoinPrecision);
      this.sellForm.controls["price"].setValidators([
        Validators.min(this.minPrice),
        Validators.required,
      ]);
    }
 
  }

  //Fund Validation
  minFund: any = 0;
  maxFund: any = 0;
  buyMaxFund:any =0;
  buyMinFund:any = 0;
  fundChange(form) {
    if (form == 'Buy') {
      this.accountBalance.forEach(element => {
        if (element.asset == this.quoteCoin) {
          this.buyMaxFund = element.free
        }
      });
      if (this.quoteCoin == 'BTC') {
        this.buyMinFund = 10.1 / this.usdtValue;
        this.buyMinFund = parseFloat(this.buyMinFund).toFixed(this.quoteCoinPrecision)
      } else {
        this.buyMinFund = 10.1
      }
      this.buyForm.controls["fund"].setValidators([
        Validators.min(this.buyMinFund),
        Validators.max(this.buyMaxFund),
        Validators.required,
      ]);
    }

    if (form == 'Sell') {
      this.maxFund = 0;
      this.minFund = 0;
      this.accountBalance.forEach(element => {
        if (element.asset == this.baseCoin) {
          this.maxFund = element.free
        }
      });
      if (this.quoteCoin == 'BTC') {
        if (this.result) {
          this.minFund = 10.1 / this.eachUsdtValue;
          this.minFund = parseFloat(this.minFund).toFixed(this.quoteCoinPrecision)
        }
        if (!this.result) {
          let currentVal = 10.1 / this.usdtValue;
          this.minFund = (currentVal / this.currentPrice) * 1;
          this.minFund = parseFloat(this.minFund).toFixed(this.quoteCoinPrecision)
        }
      } else {
        this.minFund = 10.1 / this.currentPrice;
        this.minFund = parseFloat(this.minFund).toFixed(this.quoteCoinPrecision)
      }
      this.sellForm.controls["fund"].setValidators([
        Validators.min(this.minFund),
        Validators.max(this.maxFund),
        Validators.required,
      ]);
    }
  }

  buyFundCalculation() {
    let val = (this.buyForm.value.percentage / 100) * this.buyMaxFund
    this.buyForm.controls['fund'].setValue(val);
  }

  sellFundCalculation() {
    let val = (this.sellForm.value.percentage / 100) * this.maxFund;
    this.sellFund = val;
    // this.sellForm.controls['fund'].setValue(val)
   }

  //Type Validation
  typeSideChange(val) {
    let form: any = val == 'Buy' ? this.buyForm : this.sellForm
    if (form.value.type == 'MARKET') {
      form.controls['price'].clearValidators();
      form.controls['price'].updateValueAndValidity();
    }
  }

  //Switch Validation
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  stopLossCondition = false;
  stopLossSwitch() {
    this.getCurrentUsdtPrice();
    if (this.stopLossCondition) {
      this.buyForm.addControl('stoplossVal', new FormControl());
      this.buyForm.controls['stoplossVal'].reset();
      this.buyForm.controls["stoplossVal"].setValidators([
        Validators.max(50),
        Validators.min(0.1),
        Validators.required,
      ]);
    } else {
      this.buyForm.removeControl('stoplossVal');
    }
  }

  buy_quan = 0;
  stoplossVal = 0;
  stoplossCal(val) {
    let marketQuantity = 0;
    let quantity = this.buyForm.value.fund;
    if (this.baseCoin == 'BTC') {
      marketQuantity = parseFloat(this.usdtValue) * quantity;
      this.buy_quan = marketQuantity - ((marketQuantity / 100) * val);
    } else {
      this.buy_quan = quantity - ((quantity / 100) * val);
    }
  }

  //Profit Switch
  profitCondition = false;
  profitSwitch() {
    if (this.profitCondition) {
      this.buyForm.addControl('profitVal', new FormControl(' '));
      this.buyForm.controls['profitVal'].reset();
      this.buyForm.controls["profitVal"].setValidators([
        Validators.min(0.1),
        Validators.required,
      ]);
    } else {
      this.buyForm.removeControl('profitVal');
    }
  }

  //Buy Submit
  isBuyLoading = false;
  BuySubmit() {
    this.isBuyLoading = true;
    let val = {
      symbol: this.buyCoin,
      side: 'BUY',
      fund: parseFloat(this.buyForm.value.fund).toFixed(this.quoteCoinPrecision),
      type: this.buyForm.value.type,
      timeInForce: this.buyForm.value.type == "LIMIT" ? "GTC" : null,
      price: this.buyForm.value.type == "LIMIT" ? this.buyForm.value.price : null,
      stopLossEnable: this.buyForm.value.stoplossSwitch,
      stopLoss: this.buyForm.value.stoplossVal,
      takeProfitEnable: this.buyForm.value.profitSwitch,
      takeProfit: this.buyForm.value.profitVal
    };
    Object.keys(val).forEach((key) => (val[key] == null || val[key] == 0) && delete val[key]);
    this.spotService.createOrder(val, this.userId).subscribe((res: any) => {
      if (res['success']) {
        this.getAccountBalance();
        this.accountBalance.forEach(element => {
          if(element.asset == this.quoteCoin){
           this.maxFund = element.free - this.buyForm.value.fund;
         }
       });
        this.notify.success(res['message']);
        this.buyForm.controls['fund'].reset();
        this.buyForm.controls['type'].setValue('LIMIT')
        this.stopLossCondition =  false;
        this.profitCondition = false;
        this.isBuyLoading = false;
      } else {
        this.notify.error(res['message']);
        this.isBuyLoading = false;
      }

    },
      (error) => {
        this.isBuyLoading = false;
        this.notify.error(error.error.message);
      }
    )
  }

  //Sell Submit
  isSellLoading = false;
  sellFund = 0;
  sellSubmit() {
    this.isSellLoading = true;
    let val = {
      symbol: this.sellCoin,
      side: 'SELL',
      quantity: parseFloat(this.sellForm.value.fund).toFixed(this.quoteCoinPrecision),
      type: this.sellForm.value.type,
      timeInForce: this.sellForm.value.type == "LIMIT" ? "GTC" : null,
      price: this.sellForm.value.type == "LIMIT" ? this.sellForm.value.price : null,
  };
    Object.keys(val).forEach((key) => (val[key] == null || val[key] == 0) && delete val[key]);
    this.spotService.createOrder(val, this.userId).subscribe((res: any) => {
      if (res['success']) {
        this.getAccountBalance();
        this.accountBalance.forEach(element => {
           if(element.asset == this.baseCoin){
            this.maxFund = element.free - this.sellFund;
          }
        });
        this.notify.success(res['message']);
        this.sellForm.controls['fund'].setValue(0);
        this.sellForm.controls['type'].setValue('LIMIT');
        this.isSellLoading = false;
      } else {
        this.notify.error(res['message']);
        this.isSellLoading = false;
      }

    },
      (error) => {
        this.isBuyLoading = false;
        this.notify.error(error.error.message);
      }
    )
  }

  //Active Trade
  activeTradeDataList = []
  getActiveTradeList(){
    this.spotService.activeTradeList(this.userId).subscribe((res)=>{
      if(res['success']){
        this.activeTradeDataList = res['data']
      }
    })
  }

  //Active trade Edit
  public stopEditValue = 0;
  public activeStopVal = 0;
  public activeProfitVal = 0;
  public editPrice;
  isLoader = {
    isLimit: false,
    isMarket: false,
    isCancel: false,
    isStop: false,
    isManual: false,
    isEditBot: false
  }

  //Active trade stoploss edit
  activeStopEdit(i) {
    this.activeStopVal = this.activeTradeDataList[i].stopLoss;
    this.activeTradeDataList[i].editStop = !this.activeTradeDataList[i].editStop;
  }

  cancelactiveStopEdit(i) {
    this.activeTradeDataList[i].editStop = !this.activeTradeDataList[i].editStop;
    this.activeStopVal = 0
  }

  //active trade take profit edit
  activeProfitEdit(i) {
    this.activeProfitVal = this.activeTradeDataList[i].takeProfit;
    this.activeTradeDataList[i].profitStop = !this.activeTradeDataList[i].profitStop;
  }

  cancelactiveProfitEdit(i) {
    this.activeTradeDataList[i].profitStop = !this.activeTradeDataList[i].profitStop;
    this.activeProfitVal = 0;

  }


  activeEditLimit(i) {
    this.activeTradeDataList[i].limitStop = !this.activeTradeDataList[i].limitStop;
  }
 
  cancelactiveLimitEdit(i) {
    this.editPrice = 0;
    this.activeTradeDataList[i].limitStop = !this.activeTradeDataList[i].limitStop;
  }

  editActiveStopLoss(val, id) {
    this.isLoader.isStop = true;
    let data
    if (val == 'STOP') {
      data = {
        stopLoss: this.stopLossEditForm.value.stopeditValue,
        id: id
      }
    }
    if (val == 'PROFIT') {
      data = {
        takeProfit: this.botprofitEditForm.value.profitValue,
        id: id
      }
    }

    this.spotService.editActiveTrade(this.userId,data).subscribe((res) => {
      if (res['success']) {
        this.isModalVisible = false;
        this.getActiveTradeList();
        this.notify.success(res['message']);
        this.isLoader.isStop = false;
      } else {
        this.isLoader.isStop = false;
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.isLoader.isStop = false;
      this.notify.error(err.error.message)
    })
  }

  //Mannual sell (Active Trade)
  editmarkType = 'LIMIT';
  editData;

  editActiveTrade(data, type) {
    this.editData = data;
    this.editPrice = parseFloat(data.currentPrice).toFixed(this.quoteCoinPrecision);
    this.editmarkType = type;
    if (type == 'MARKET') {
      this.manualSell();
    }
  }

  manualSell() {
    this.isLoader.isManual = true;
    let val = {
      type: this.editmarkType,
      price: this.editmarkType == 'LIMIT' ? parseFloat(this.editPrice).toFixed(this.quoteCoinPrecision) : null,
      id: this.editData._id
    }
    Object.keys(val).forEach((key) => (val[key] == null || val[key] == 0) && delete val[key]);
    this.spotService.mannualSell(this.userId,val).subscribe((res) => {
      if (res['success']) {
        this.isModalVisible = false;
        this.getActiveTradeList();
        this.isLoader.isManual = false;
        this.notify.success(res['message']);
      } else {
        this.isLoader.isManual = false;
        this.notify.error(res['message']);
      }
    }, (err) => {
      this.isLoader.isManual = false;
      this.notify  .error(err.error.message)
    })
  }

  //Cancel Active Order
  deleteActiveOrder(id) {
    this.isLoader.isCancel = true;
    this.spotService.cancelActiveOrder(this.userId,id).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
      
      } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  //OPEN ODER
  //open order list
  openOrderDataList = []
  GetOpenOrders() {
    this.spotService.openOder(this.userId).subscribe((data: any) => {
      if (data['success']) {
        this.openOrderDataList = data.originalData;
      }
    })
  }

  //Cancel Order
  cancelOrder(data) {
    let val = {
      symbol: data.symbol,
      orderId: data.orderId
    }
    this.spotService.cancelorder(this.userId,val).subscribe((res) => {
      if (res['success']) {
        this.openOrderDataList = this.openOrderDataList.filter(d => d.orderId !== data.orderId);
        this.getAccountBalance();
        this.notify.success(res['message']);
      } else {
        this.notify.error(res['message'])
      }
    })
  }

  //TRADE HISTORY
  //Trade history list
  tradehistory= [];
  totalHistoryCount = 0;
  tempTradeHistory = [];
  tempTradeCount = 0;
  isPrevDisable = false;
  index = 1;
  limit = 3;
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
        if(this.tempTradeHistory.length == 0){
          this.changeTrade(this.historyType,this.index,this.limit,false)
          }
       } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  //Config BOT
  addcontrol() {
    if (this.editTrailing) {
      this.botEditForm.controls["trailValue"].setValidators([
        Validators.min(0.1),
        Validators.max(5),
        Validators.required,
      ]);
    } else {
      this.botEditForm.controls['trailValue'].clearValidators();
      this.botEditForm.controls['trailValue'].updateValueAndValidity();
    }
    if (this.editStopLoss) {
      this.botEditForm.controls["stopLossValue"].setValidators([
        Validators.min(0.1),
        Validators.max(50),
        Validators.required,
      ]);
    } else {
      this.botEditForm.controls['stopLossValue'].clearValidators();
      this.botEditForm.controls['stopLossValue'].updateValueAndValidity();
    }
    if (this.editTakeProfit) {
      this.botEditForm.controls["autoValue"].setValidators([
        Validators.min(1),
        Validators.required,
      ]);
    } else {
      this.botEditForm.controls['autoValue'].clearValidators();
      this.botEditForm.controls['autoValue'].updateValueAndValidity();
    }
  }

  botStoplossCal(val) {
    let marketQuantity = 0;
    let quantity = this.editFund;
    if (this.baseCoin == 'BTC') {
      marketQuantity = parseFloat(this.usdtValue) * quantity;
      this.buy_quan = marketQuantity - ((marketQuantity / 100) * val);
    } else {
      this.buy_quan = quantity - ((quantity / 100) * val);
    }
  }

  async showEditBot(data) {
    this.isEditBot = true;
    this.editData = data;
    this.editStopLoss = data.stopLossEnable;
    this.editTrailing = data.trailingEnable;
    this.editTakeProfit = data.takeProfitEnable;
    this.editStopLossValue = data.stopLoss;
    this.editTrailingValue = data.trailingPercentage;
    this.editFund = data.fund;
    this.editProfitValue = data.takeProfit;
    this.botType = data.type;
    this.addcontrol();
  }

  editBotValue(data) {
    this.isLoader.isEditBot = true;
    let val;
    if (data != false) {
      val = {
        status: data.status == 'START' ? 'STOP' : 'START',
        id: data._id
      }
    } else {
      val = {
        id: this.editData._id,
        fund: this.editFund,
        type: this.botType,
        takeProfitEnable: this.editTakeProfit,
        takeProfit: this.editTakeProfit ? this.editProfitValue : null,
        trailingEnable: this.editTrailing,
        trailingPercentage: this.editTrailing ? this.editTrailingValue : null,
        stopLossEnable: this.editStopLoss,
        stopLoss: this.editStopLoss ? this.editStopLossValue : null,
        status: this.editData.status
      }
    }
    Object.keys(val).forEach((key) => (val[key] == null || val[key] == 0) && delete val[key]);
    this.spotService.botEdit(this.userId,val).subscribe((res) => {
      if (res['success']) {
        this.getConfigBot();
        this.isLoader.isEditBot = false;
        this.handleCancel();
        this.notify.success(res['message']);

      } else {
        this.isLoader.isEditBot = false;
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.isLoader.isEditBot = false;
      this.notify.error(err.error.message)
    })
  }

  //Bot stop edit
  openStopEdit(i) {
    this.stopEditValue = this.configbotList[i].stopLoss;
    this.configbotList[i].editStop = !this.configbotList[i].editStop;
  }
  
  cancelStopEdit(i) {
    this.configbotList[i].editStop = !this.configbotList[i].editStop;
    this.stopEditValue = 0;
  }

  editStop(data) {
    let val = {
      id: data._id,
      stopLoss: this.stopLossEditForm.value.stopeditValue,
    }
    this.spotService.botEdit(this.userId,val).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.getConfigBot();
        this.stopLossEditForm.reset();
        this.handleCancel();
      } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  //Bot Profit Edit
  openProfitEdit(i) {
    this.editProfitValue = this.configbotList[i].takeProfit;
    this.configbotList[i].editProfit = !this.configbotList[i].editProfit;
  }

  cancelProfitEdit(i) {
    this.configbotList[i].editProfit = !this.configbotList[i].editProfit;
    this.editProfitValue = 0;
  }

  editprofitvalue(data) {
    let val = {
      id: data._id,
      takeProfit: this.botprofitEditForm.value.profitValue,
    }
    this.spotService.botEdit(this.userId,val).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.getConfigBot();
        this.handleCancel();
      } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  // open_viewresult(val): void {
  //   this.botresultData = val;
  //   this.visibleviewresult = true;
  //   this.isViewResult = false;
  //   this.getSignalResult(val.bot_id);
  // }
 
  // close_viewresult(): void {
  //   this.visibleviewresult = false;
  //   this.isViewResult = true;
  // }
  
  //config bot list
  getConfigBot() {
    this.spotService.botList(this.userId).subscribe((res) => {
      if (res['success']) {
        let temp = [];
        res['data'].forEach((element) => {
          element.editTrailing = false;
          element.editProfit = false;
          temp.push(element);
        });
        this.configbotList = temp;
      }
    })
  }

}
