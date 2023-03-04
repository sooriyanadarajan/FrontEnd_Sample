import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NzMarks } from 'ng-zorro-antd/slider';
import {
  FormGroup,
  FormBuilder,
  Validators, FormControl
} from "@angular/forms";
import { NotifyService } from '../../../../services/notification.service';
import { FututreService } from '../../../../services/fututre.service';
import { UserService } from '../../../../services/user.service';
import { SpotService } from '../../../../services/spot.service';
import { finalize } from "rxjs/operators";
import { SocketService } from '../../../../services/socket.service';
declare const TradingView: any;
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-future',
  templateUrl: './future.component.html',
  styleUrls: ['./future.component.scss']
})
export class FutureComponent implements OnInit {
  subscriptions: Subscription[] = [];
  userId;
  public noti: Array<any> = [];
  public noticount: number;
  public switchValue: boolean = false;
  public switchValue1: boolean = false;
  public switchValue2: boolean = false;
  public isShown: boolean = false;
  public isVisible: boolean = false;
  public addisVisible: boolean = false;
  public EditisVisible: boolean = false;
  public isQrVisible: boolean = false;
  public botId: any;
  public copied = 'Copied';
  public BOTList = [];
  public paymentYear;
  public botResult;
  public price;
  public address;
  public paymentType;
  public couponCode;
  public botPaymentDetail;

  tabs = [1];
  marks: NzMarks = {
    0: "",
    25: "",
    50: "",
    75: "",
    100: "",
  }

  constructor(
    private cdref: ChangeDetectorRef,
    private notify: NotifyService,
    private fb: FormBuilder,
    private futuresService: FututreService,
    private http: UserService,
    private spotService: SpotService,
    private socket: SocketService,
    private router: ActivatedRoute,
    private el: ElementRef
  ) { }


  coinList;
  coinSelectedValue = 'BTCUSDT';
  balance = 0;
  tempBalance = 0;

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this.router.params.subscribe((routeParams) => {
      this.userId = routeParams.id;
      this.socket.connect(this.userId);
    });
    this.getBotList();
    this.getAddBot();
    this.hamMenu(window);
    this.getUser().then(()=>{
      this.PairChange(this.coinSelectedValue);
    });

    this.addMarginForm = this.fb.group({
      amount: [null,
        [Validators.min(0.01),
        Validators.required]],
    });

    this.removeMarginForm = this.fb.group({
      amount: [null, [Validators.required]],
    });

    this.botEditForm = this.fb.group({
      botstopLossValue: new FormControl(),
      botQuantity: new FormControl(Validators.required, Validators.min(1)),
      position: new FormControl(),
      type: new FormControl()
    })

    this.hamMenu(window);
   this.socket.listen('active_position').subscribe((data: any) => {
      this.balance = 0;
      this.positionData = [];
      this.positionData = data;
      this.positionData = [...this.positionData];
      this.positionData.forEach(element => {
        if (element.marginType == 'cross' || element.marginType == 'Cross') {
          this.balance = Number((parseFloat(element.entryPrice) * parseFloat(element.positionAmt)) / parseFloat(element.leverage)) + this.balance;
        } else {
          this.balance = element.isolatedMargin + this.balance;
        }
      });
      this.userDetail.availableBalance = this.tempBalance == 0 ? this.userDetail.availableBalance - this.balance :  this.tempBalance - this.balance;
      this.positionData.forEach(element => {
        if (element.symbol == this.coinSelectedValue) {
          this.isFound = true;
          this.disable = true;
        } else {
          this.disable = false;
          this.isFound = false;
        }
        if (element.marginType == 'cross') {
          element.crossMarginRatio = Number((parseFloat(element.entryPrice) / parseFloat(element.positionAmt)) * parseFloat(element.leverage));
        }
        if (this.positionData.length > 0 || this.openOrderHistory.length > 0) {
          this.disable = true
        } else {
          this.disable = false;
        }
        this.getPosition();
        this.tradePairData.forEach(trade => {
          if (trade.symbol == element.symbol) {
            element.coinPrecision = trade.quantityPrecision;
            element.pricePrecision = trade.pricePrecision;
            element.positionAmt = Number(element.positionAmt)
            if ((+element.positionAmt) > 0) {
              element.closePrice = Number(((+element.entryPrice / 100) * 1) + (+element.entryPrice)).toFixed(this.pricePrecision);
            } else {
              element.closePrice = Number((+element.entryPrice) - ((+element.entryPrice / 100) * 1)).toFixed(this.pricePrecision);
            }
          }
        });
      });
    })

    this.socket.listen('remove_fx_open_order').subscribe((data: any) => {
      let id = data.orderId;
      this.closeOrderId = null;
      let changeTrade = this.openOrderHistory.filter((trade: any) => {
        return trade.orderId !== id;
      })
      this.openOrderHistory = changeTrade;
      if (this.positionData.length > 0 || this.openOrderHistory.length > 0) {
        this.disable = true
      } else {
        this.disable = false
      }
    });
    this.socket.listen('add_fx_open_order').subscribe((data: any) => {
      let id = data._id;
      let con = false;
      this.openOrderHistory.forEach((trade: any) => {
        if (trade._id == id) {
          con = true;
          trade = data;
        }
      })

      if(con == false){
        this.openOrderHistory.push(data)
      }

      if (this.positionData.length > 0 || this.openOrderHistory.length > 0) {
        this.disable = true
      } else {
        this.disable = false;
      }
    })

    this.socket.listen('update_balance_and_position').subscribe((data: any) => {
      this.tempBalance = data.B[0].cw;
    })
    this.socket.listen('update_leverage').subscribe((data: any) => {
      if (this.coinSelectedValue == data.s) {
        this.selected.leverage = data.l;
      }
    })

    this.buyformGroup();
    this.sellformGroup();
    this.GetMarkPrice(this.coinSelectedValue);
    // setTimeout(() => {
     
    // }, 1000);
    this.Step2validateForm = this.fb.group({
    });
   }


  ngOnDestroy() {
    this.socket.disconnect();
    this.subscriptions.forEach((item) => item.unsubscribe());
   }

  showModalsubscribe(id): void {
    this.EditisVisible = true;
    this.addisVisible = false;
    this.botId = id
  }
  showModal(): void {
    this.isVisible = true;

  }
  showBotListModal(): void {
    this.addisVisible = true;
  }
  handleCancelbot(): void {
    this.addisVisible = false;
    this.EditisVisible = false;
  }
  handleOkbot(): void {
    this.addisVisible = true;
    this.editbotisVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
    this.isQrVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.editbotisVisible = false;
    this.EditisVisible = false;
    this.isQrVisible = false;

    // this.isModalVisible = false;
    this.EditisVisible = false;
    this.isQrVisible = false;
    // this.isEditBot = false;
    // this.sellmodelisVisible = false;
    this.paymentYear = null;
    this.paymentType = null;
    this.couponCode = null;
  }
  isForm = true;
  styleId = 1;
  changeForm(val, id) {
    this.isForm = val;
    this.styleId = id;
  }


  hamMenu(event) {
    const width = event.innerWidth;
    (width <= 1025) ? this.isShown = true : this.isShown = false;
  }


  formatter(value: number): string {
    return `${value}%`;
  }

  //Get Current Market Price
  currentMarketPrice = 0;
  getCurrentPrice(val) {
    this.spotService.currentPrice(val).subscribe((res) => {
      if (res['success']) {
        this.buyForm.controls['price'].setValue(parseFloat(res['data']['price']).toFixed(this.pricePrecision));
        this.sellForm.controls['price'].setValue(parseFloat(res['data']['price']).toFixed(this.pricePrecision));
        setTimeout(() => {
          if (this.isForm) {
            this.ProcessCostMaxBuy(this.buyForm, this.marketData.mark);
          }
        }, 1000);
      }
    })
  }


  stopCurrentPrice(){
    this.getCurrentPrice(this.coinSelectedValue);
   }

  getSignalResult(val) {
    // this.http.signalResult(val).subscribe((res) => {
    //   if (res['success']) {
    //     this.botResult = res['data']
    //   }
    // })
  }
  isLoading = false
  subscribeBOT() {
    this.isLoading = true;
    let val = {
      bot_id: this.botId._id,
      months: this.paymentYear,
      payment_type: this.paymentType,
      coupon: this.couponCode
    }
    Object.keys(val).forEach((key) => (val[key] == null || val[key] == 0) && delete val[key]);
    // this.http.subscribeBot(val).subscribe((res) => {
    //   if (res['success']) {
    //     this.notify.success(res['message']);
    //     this.isLoading = false;
    //     this.paymentYear = null;
    //     this.paymentType = null;
    //     this.couponCode = null;
    //     this.showQrModal(res['data'])
    //   } else {
    //     this.notify.error(res['message']);
    //     this.isLoading = false;
    //   }
    // }, (err) => {
    //   this.notify.error(err.error.message);
    //   this.isLoading = false;
    // })
  }
  showQrModal(val) {
    this.EditisVisible = false;
    this.addisVisible = false;
    this.isQrVisible = true;
    this.botPaymentDetail = val;
    this.price = this.botPaymentDetail.amount + ' ' + this.botPaymentDetail.payment_type;
    this.address = this.botPaymentDetail.address
  }
  cancelPayment(val) {
    // this.http.cancelPaymentBot(val).subscribe((res) => {
    //   if (res['success']) {
    //     this.notify.success(res['message']);
    //     this.handleCancel();
    //   } else {
    //     this.notify.error(res['message'])
    //   }
    // }, (err) => {
    //   this.notify.error(err.error.message)
    // })
  }
  disableTooltip() {
    this.copied = 'Copied'
    setTimeout(() => {
      this.copied = ''
    }, 1000);
  }

  //Buy 
  buyForm: FormGroup;

  buyformGroup() {
    this.buyForm = this.fb.group({
      price: [
        0,
        [Validators.required],
      ],
      quantity: [
        0,
        [Validators.required],
      ],
      type: ["LIMIT", [Validators.required]],
      stopType: ["STOP-LIMIT", []],
      percentage: [0, []],
      stopPrice: [0],
    });
    this.changeValidation(this.buyForm)
  }

  selected = {
    focused: false,
    coinPair: this.coinSelectedValue,
    baseCoin: "USDT",
    mainCoin: "BTC",
    balance: 0,
    cost: 0,
    maxBuy: 0,
    min: 0,
    maxSell: 0,
    leverage: 10,
    tempLeverage: 10,
    deleteOpenData: {
      indx: 0,
    },
    updatePrice: 0,
    aiBid: 50,
    aiAsk: 50,
    search: false,
  };


  loading = {
    buy: false,
    sell: false,
    marginload:false,
    botUpdateLoad:false,
    cancelOrderLoad:false
  };

  //current Market Data
  marketData = {
    mark: 0,
    markTemp: 0,
    "24hrChange": 0,
    "24hrChangePer": 0,
    "24hrHigh": 0,
    "24hrLow": 0,
    "24hrVolume": 0,
    fundingRate: 0,
    nextFundTime: 0,
    minQuan: 0.0001,
    minPrice: 0.0001,
    lastPrice: 20,
    avgPrice: 0,
    lastPriceTemp: 0,
  };

  ChangePercentage(type) {
    let quan;
    if (type == "BUY") {
      if (this.buyForm.value.type == "LIMIT") {
        quan = (
          ((this.selected.balance / 100) *
            this.buyForm.value.percentage *
            this.selected.leverage) /
          this.buyForm.value.price
        ).toFixed(6);
      } else {
        quan = (
          ((this.selected.balance / 100) *
            this.buyForm.value.percentage *
            this.selected.leverage) /
          this.marketData.lastPrice
        ).toFixed(6);
      }
      if (this.buyForm.value.percentage != 0) {
        this.buyForm.controls["quantity"].setValue(quan);
      }
    }
    else {
      if (this.sellForm.value.type == "LIMIT") {
        quan = (
          ((this.selected.balance / 100) *
            this.sellForm.value.percentage *
            this.selected.leverage) /
          this.sellForm.value.price
        ).toFixed(6);
      } else {
        quan = (
          ((this.selected.balance / 100) *
            this.sellForm.value.percentage *
            this.selected.leverage) /
          this.marketData.lastPrice
        ).toFixed(6);
      }
      this.buyForm.controls["quantity"].setValue(quan);
      {
        this.sellForm.controls["quantity"].setValue(quan);
      }
    }
  }


  quantity = 0;
  sellQuantity = 0;
  buyTotalValue = 0;
  TriggerCostBuy() {
    if (this.isForm) {
      this.ProcessCostMaxBuy(this.buyForm, this.marketData.mark);
      this.quantity = this.selected.maxBuy;
      this.buyForm.controls['quantity'].setValidators([
        Validators.max(this.selected.maxBuy),
        Validators.required,
      ]);
      this.buyForm.controls['quantity'].updateValueAndValidity();
      this.buyTotalValue = this.buyForm.value.quantity * this.buyForm.value.price;
    }

    if (!this.isForm) {
      this.ProcessCostMaxBuy(this.sellForm, this.marketData.mark);
      this.sellQuantity = this.selected.maxBuy;
      this.sellForm.controls['quantity'].setValidators([
        Validators.max(this.selected.maxBuy),
        Validators.required,
      ]);
      this.sellForm.controls['quantity'].updateValueAndValidity();
      this.buyTotalValue = this.sellForm.value.quantity * this.sellForm.value.price;
    }

    // if (this.editBotisVisible) {
    //     this.ProcessCostMaxBuy(
    //         { value: { type: "MARKET" } },
    //         this.marketData.mark
    //     );
    // }
  }


  changePrice(form) {
    form.controls["percentage"].setValue(0);
  }

  ProcessCostMaxBuy(form, curPrice) {
    if (
      form.value.type == "MARKET" ||
      (form.value.type == "STOP" && form.value.stopType == "STOP-MARKET")
    ) {
      this.selected.maxBuy = parseFloat(
        (
          (this.selected.balance * this.selected.leverage) /
          curPrice
        ).toFixed(this.pricePrecision)
      );
    } else {
      if (form.value.price > 0) {
        this.selected.maxBuy = parseFloat(
          (
            (this.selected.balance * this.selected.leverage) /
            form.value.price
          ).toFixed(this.coinPrecision)
        );
      } else {
        this.selected.maxBuy = 0;
      }
    }
    if (form.value.quantity > 0) {
      let val:any;
      val = (curPrice * form.value.quantity) / this.selected.leverage;
      val = parseFloat(val).toFixed(this.pricePrecision)
      this.selected.cost = val;
    } else {
      this.selected.cost = 0;
    }

  }

  isBuyLoad = false;
  async BuySubmit(val, position) {
    let buyType;
    if (this.buyForm.value.type == "STOP") {
      if (position == 'LONG') {
        if (this.buyForm.value.stopPrice < this.currentMarketPrice) {
          buyType = this.buyForm.value.stopType == "STOP-LIMIT" ? "TAKE_PROFIT" : "TAKE_PROFIT_MARKET";
        }
        if (this.buyForm.value.stopPrice >= this.currentMarketPrice) {
          buyType = this.buyForm.value.stopType == "STOP-LIMIT" ? 'STOP' : 'STOP_MARKET'
        }
      }

      if (position == 'SHORT') {
        if (this.buyForm.value.stopPrice < this.currentMarketPrice) {
          buyType = this.buyForm.value.stopType == "STOP-LIMIT" ? 'STOP' : 'STOP_MARKET'
        }
        if (this.buyForm.value.stopPrice >= this.currentMarketPrice) {
          buyType = this.buyForm.value.stopType == "STOP-LIMIT" ? "TAKE_PROFIT" : "TAKE_PROFIT_MARKET";
        }
      }

      if (position == null) {
        if (this.currentMarketPrice > this.buyForm.value.stopPrice) {
          buyType = this.buyForm.value.stopType == "STOP-LIMIT" ? "TAKE_PROFIT" : "TAKE_PROFIT_MARKET";
        }
        if (this.currentMarketPrice <= this.buyForm.value.stopPrice) {
          buyType = this.buyForm.value.stopType == "STOP-LIMIT" ? 'STOP' : 'STOP_MARKET'
        }
      }

    }
    else {
      buyType = this.buyForm.value.type
    }
    
    // if (position == null) {
    //   buyType = this.buyForm.value.type == "STOP" ? this.buyForm.value.stopType == "STOP-LIMIT" ? "STOP" : "STOP_MARKET" : this.buyForm.value.type
    // } else if (position != null) {
    // }
    if (this.buyForm.valid && this.buyForm.touched) {
      this.loading.buy = position == 'LONG' ? true : false;
      this.loading.sell = position == 'SHORT' ? true : false;
      this.isBuyLoad = position == null ? true : false;
      let payload = {
        symbol: this.selected.coinPair,
        side: val,
        positionSide: position,
        type: buyType,
        timeInForce: this.buyForm.value.type == "LIMIT" ? "GTC" : null,
        quantity: Number(parseFloat(this.buyForm.value.quantity).toFixed(this.coinPrecision)),
        price:
          this.buyForm.value.type == "MARKET"
            ? null : this.buyForm.value.stopType == "STOP-MARKET" ? null
              : Number(parseFloat(this.buyForm.value.price).toFixed(this.pricePrecision)),
        stopPrice:
          this.buyForm.value.type == "STOP"
            ? this.buyForm.value.stopPrice
            : null,
      };

      await Object.keys(payload).forEach((key) => (payload[key] == null) && delete payload[key]);
      let minimumValue = this.buyForm.value.quantity * this.buyForm.value.price;
    if (minimumValue >= 5) {
        await this.futuresService
          .createOrder(this.userId, payload)
          .pipe(
            finalize(() => {
              this.loading.buy = false;
            })
          )
          .subscribe(
            (data) => {
              if (data['success']) {
                this.notify.success(data["message"]);
                this.isBuyLoad = false;
                this.loading.buy = false;
                this.loading.sell = false;
                this.buyformGroup();
                this.coinSelectedValue = this.coinSelectedValue;
                this.getCurrentPrice(this.coinSelectedValue);
                this.getUser();

              } else {
                this.isBuyLoad = false;
                this.loading.buy = false;
                this.loading.sell = false;
                this.notify.error(data["message"]);
              }
            },
            (err) => {
              this.isBuyLoad = false;
              this.loading.buy = false;
              this.loading.sell = false;
              this.notify.error(err.error.message);
            }
          );
      } else {
        this.notify.error('Enter quantity worth of 5 USDT!');
        this.isBuyLoad = false;
        this.loading.buy = false;
        this.loading.sell = false;
      }

    }
  }


  //Sell
  sellForm: FormGroup;
  marksBuySell: NzMarks = {
    0: "",
    25: "",
    50: "",
    75: "",
    100: "",
  };
  sellformGroup() {
    this.sellForm = this.fb.group({
      price: [
        0,
        [Validators.required, Validators.min(0)],
      ],
      quantity: [
        '0.00',
        [Validators.required],
      ],
      type: ["LIMIT", [Validators.required]],
      stopType: ["STOP-LIMIT", []],
      percentage: [0],
      stopPrice: [0],
    });
    this.changeValidation(this.sellForm)
  }

  isSellLoad = false
  async SellSubmit(val, position) {
    let sellType;
    if( this.sellForm.value.type == "STOP"){
      if(position == 'LONG'){
         if(this.sellForm.value.stopPrice < this.currentMarketPrice ){
          sellType =  this.sellForm.value.stopType == "STOP-LIMIT" ? 'STOP':'STOP_MARKET'
        }
        if(this.sellForm.value.stopPrice  >= this.currentMarketPrice ){
          sellType = this.sellForm.value.stopType == "STOP-LIMIT" ? "TAKE_PROFIT" : "TAKE_PROFIT_MARKET";
        }
      }

      if(position == 'SHORT'){
        if( this.sellForm.value.stopPrice < this.currentMarketPrice ){
          sellType = this.sellForm.value.stopType == "STOP-LIMIT" ? "TAKE_PROFIT" : "TAKE_PROFIT_MARKET";
          }
        if(this.sellForm.value.stopPrice >= this.currentMarketPrice){
          sellType =  this.sellForm.value.stopType == "STOP-LIMIT" ? 'STOP':'STOP_MARKET';
        }
      }

      if(position == null){
        if( this.currentMarketPrice < this.sellForm.value.stopPrice ){
          sellType = this.sellForm.value.stopType == "STOP-LIMIT" ? "TAKE_PROFIT" : "TAKE_PROFIT_MARKET";
        }
        if(this.currentMarketPrice >= this.sellForm.value.stopPrice ){
          sellType =  this.sellForm.value.stopType == "STOP-LIMIT" ? 'STOP':'STOP_MARKET'
        }
      }
     
    }
    else{
      sellType =  this.sellForm.value.type 
    }
    

    if (this.sellForm.valid && this.sellForm.touched) {
      this.loading.buy = position == 'LONG' ? true : false;
      this.loading.sell = position == 'SHORT' ? true : false;
      this.isSellLoad = position == null ? true : false;
      let data = {
        symbol: this.selected.coinPair,
        side: val,
        positionSide: position,
        type:sellType,
        timeInForce: this.sellForm.value.type == "LIMIT" ? "GTC" : null,
        quantity: Number(parseFloat(this.sellForm.value.quantity).toFixed(this.coinPrecision)),
        price:
          this.sellForm.value.type == "MARKET"
            ? null : this.sellForm.value.stopType == "STOP-MARKET" ? null
              : Number(parseFloat(this.sellForm.value.price).toFixed(this.pricePrecision)),
        stopPrice:
          this.sellForm.value.type == "STOP"
            ? this.sellForm.value.stopPrice
            : null,
      }
      await Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
      let minimumValue = this.sellForm.value.quantity * this.sellForm.value.price;
      if (minimumValue >= 5) {

        await this.futuresService
          .createOrder(this.userId, data)
          .pipe(
            finalize(() => {
              this.loading.buy = false;
            })
          )
          .subscribe(
            (data) => {
              if (data['success']) {
                this.notify.success(data["message"]);
                this.loading.buy = false;
                this.loading.sell = false;
                this.isSellLoad = false;
                this.sellformGroup();
                this.getCurrentPrice(this.coinSelectedValue)
                this.selected.maxBuy = 0;
                this.selected.cost = 0;
                this.coinSelectedValue = this.coinSelectedValue;
                this.getUser();
              } else {
                this.loading.buy = false;
                this.loading.sell = false;
                this.isSellLoad = false;
                this.notify.error(data["message"]);
              }
            },
            (err) => {
              this.loading.buy = false;
              this.loading.sell = false;
              this.isSellLoad = false;
              this.notify.error(err.error.message);
            }
          );
      }
      else {
        this.loading.buy = false;
        this.loading.sell = false;
        this.isSellLoad = false;
        this.notify.error("Enter Quantity equal to 5USDT!");
      }
    }
  }


  //Leverage
  marksBot: NzMarks = {
    1: "",
    15: "",
    30: "",
    45: "",
    60: "",
  };

  coinLeverage;
  isLeaverageLoad = false;
  ChangeLeverage(e) {
    this.isLeaverageLoad = true;
    if (
      this.selected.tempLeverage > 0 &&
      this.selected.tempLeverage <= 60
    ) {
      this.selected.leverage = this.selected.tempLeverage;
      this.futuresService
        .changeLeverage(this.userId, {
          // userId: this.selectedBotData.userId,
          leverage: this.selected.leverage,
          symbol: this.coinSelectedValue,
        })
        .subscribe(
          (data) => {
            if(data['success']){
              this.notify.success(data['message']);
              this.isLeaverageLoad = false;
              this.selected.tempLeverage = data.data.leverage;
              this.handleCancel();
              this.ProcessCostMaxBuy(this.buyForm, this.marketData.mark);
            }else{
              this.notify.error(data['message']);
              this.isLeaverageLoad = false;
              this.GetLeverage();
              this.handleCancel();
            }
          },
          (err) => {
            this.isLeaverageLoad = true;
            this.notify.error(err.error.message);
             this.GetLeverage();
             this.handleCancel();
          }
        );
     } else {
      this.LeverageChangeValidate();
    }
  }

  LeverageChangeValidate() {
    if (this.selected.tempLeverage) {
      if (this.selected.tempLeverage <= 0) {
        this.selected.tempLeverage = 1;
      } else if (this.selected.tempLeverage > 60) {
        this.selected.tempLeverage = 60;
      } else {
        this.selected.tempLeverage = parseInt(
          this.selected.tempLeverage.toString()
        );
      }
    } else {
      this.selected.tempLeverage = 1;
    }
  }

  GetLeverage() {
    let levDetail = this.userDetail.positions.filter(t => t.symbol == this.coinSelectedValue);
    if (levDetail) {
      this.selected.leverage = levDetail[0].leverage;
      this.selected.tempLeverage = this.selected.leverage;
    }
  }

  //Coin List
  coinListOfOption = [
    "BTCUSDT",
    "ETHUSDT",
    "BCHUSDT",
    "XRPUSDT",
    "EOSUSDT",
    "LTCUSDT",
    "TRXUSDT",
    "ETCUSDT",
    "LINKUSDT",
    "XLMUSDT",
    "ADAUSDT",
    "XMRUSDT",
    "DASHUSDT",
    "XTZUSDT",
    "ZECUSDT",
    "BNBUSDT",
    "ATOMUSDT",
    "ONTUSDT",
    "IOTAUSDT",
    "BATUSDT",
    "VETUSDT",
    "NEOUSDT",
    "QTUMUSDT",
    "IOSTUSDT",
  ];

  // getCoins() {
  //   this.http.getCoins().subscribe((res: any) => {
  //     this.coinList = res.data;
  //   });
  // }

  PairChange(e) {
    this.disable = false;
    if (e && e == this.coinSelectedValue) {
      this.selected.coinPair = e;
      this.coinSelectedValue = e;
      this.selected.mainCoin = e.substr(0, e.length - 4);
      this.GetMarkPrice(e);
      this.TradingChart('light');
      this.GetLeverage();
      this.getPosition();
      this.getTradePair();
      this.getCurrentPrice(e)
      this.modeGet();
      this.tradePairData.forEach(element => {
        if (element.symbol == e) {
          this.selected.min = element.minQty;
        }
      });
      this.positionData.forEach(element => {
        if (element.symbol == this.coinSelectedValue) {
          this.disable = true;
        }
      });
      this.userDetail.positions.forEach(element => {
        if (element.symbol == this.coinSelectedValue) {
          this.marginType = element.isolated == false ? 'Cross' : 'Isolated';
          this.marginMode = this.marginType
        }
      });
    }
    this.selected.cost = 0;
    this.selected.maxBuy = 0;
    this.buyForm.controls['quantity'].setValidators([
      Validators.required,
    ]);
    this.sellForm.controls['quantity'].setValidators([
      Validators.required,
    ]);
    this.sellForm.controls['price'].setValue(0);
    this.buyForm.controls['price'].setValue(0);
    this.sellForm.controls['quantity'].setValue(0);
    this.buyForm.controls['quantity'].setValue(0);
    this.buyForm.controls['stopPrice'].setValue(0)
    this.sellForm.controls['stopPrice'].setValue(0)
  }

  //chart
  public myChart:Chart;
  TradingChart(theme) {
    /*------------------------------
  TradingView
  -------------------------------*/
  new TradingView.widget({
      container_id: "technical-analysis",
      autosize: true,
      symbol: this.selected.coinPair,
      interval: "1",
      timezone: "exchange",
      theme: theme ? "light" : "dark",
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
    });
    /*------------------------------
  TradingView -- two
  -------------------------------*/
    // new TradingView.widget({
    //   container_id: "technical-analysis-two",
    //   autosize: true,
    //   symbol: this.selected.coinPair,
    //   interval: "15",
    //   timezone: "exchange",
    //   theme: theme ? "light" : "dark",
    //   style: "1",
    //   studies: ["BB@tv-basicstudies"],
    //   toolbar_bg: "#f1f3f6",
    //   withdateranges: false,
    //   hide_side_toolbar: true,
    //   hide_top_toolbar: false,
    //   allow_symbol_change: true,
    //   save_image: false,
    //   show_popup_button: false,
    //   locale: "en",
    // });
    /*------------------------------
  TradingView -- three
  -------------------------------*/
    // new TradingView.widget({
    //   container_id: "technical-analysis-three",
    //   autosize: true,
    //   symbol: this.selected.coinPair,
    //   interval: "120",
    //   timezone: "exchange",
    //   theme: theme ? "light" : "dark",
    //   style: "1",
    //   studies: ["BB@tv-basicstudies"],
    //   toolbar_bg: "#f1f3f6",
    //   withdateranges: false,
    //   hide_side_toolbar: true,
    //   hide_top_toolbar: false,
    //   allow_symbol_change: true,
    //   save_image: false,
    //   show_popup_button: false,
    //   locale: "en",
    // });
    /*------------------------------
   TradingView -- four
   -------------------------------*/
    // new TradingView.widget({
    //   container_id: "technical-analysis-four",
    //   autosize: true,
    //   symbol: this.selected.coinPair,
    //   interval: "240",
    //   timezone: "exchange",
    //   theme: theme ? "light" : "dark",
    //   style: "1",
    //   studies: ["BB@tv-basicstudies"],
    //   toolbar_bg: "#f1f3f6",
    //   withdateranges: false,
    //   hide_side_toolbar: true,
    //   hide_top_toolbar: false,
    //   allow_symbol_change: true,
    //   save_image: false,
    //   show_popup_button: false,
    //   locale: "en",
    // });
  }

  //Margin Isolated
  marginChangeisVisible = false;
  marginType: any;
  marginMode = "Cross";
  showMarginChange(): void {
    this.marginChangeisVisible = true;
    this.positionData.forEach(element => {
      if (element.symbol == this.coinSelectedValue) {
        this.isFound = true
      }else{
        this.isFound = false;
      }
    });
  }
  marginLoad = false;
  ChangeMarginType() {
    this.marginLoad = true;
    let val = {
      symbol: this.coinSelectedValue,
      type: this.marginMode == 'Cross' ? 'CROSSED' : 'ISOLATED',
    }
    this.futuresService.changeMargin(this.userId,
      val
    ).subscribe((data) => {
      if (data['success']) {
        this.marginLoad = false;
        this.marginChangeisVisible = false;
        this.marginType = this.marginMode;
        this.notify.success(data["message"]);
      }
      else {
        this.marginChangeisVisible = false;
        this.notify.error(data["message"]);
        this.marginLoad = false;
        (err) => {
          this.notify.error(err);
          this.marginLoad = false;
        }
      }
    });
  }

  //Account detail
  userDetail: any;
  symbol: any;
  getUser() {
    return new Promise((resolve: any) => {
      this.subscriptions.push(
        this.futuresService.accountInfo(this.userId).subscribe(res => {
          if (res['success']) {
            this.userDetail = res['data'];
            this.selected.balance = this.userDetail.availableBalance;
            this.userDetail.positions.forEach(element => {
              if (element.symbol == this.coinSelectedValue) {
                this.marginType = element.isolated == false ? 'Cross' : 'Isolated';
                this.marginMode = this.marginType
              }
            })
          }
          resolve();
        })
      )
    });
  }

  //Market Price
  markPriceArr = [];
  UpdateMarkAndLast(pair) {
    this.futuresService
      .PairLastPrice(pair)
      .then((res) => res.json())
      .then((res) => {
        this.marketData.lastPrice = res.price;
      })
      .catch((err) => { });

    this.futuresService
      .PairMarkPrice(pair)
      .then((res) => res.json())
      .then((res) => {
        this.marketData.mark = res.markPrice;
          this.markPriceArr[pair] = res.markPrice;
      })
      .catch((err) => { });
  }

  //Crossmargin Data
  crossMarginRatio = {
    marginRatio: "0",
    maintenanceMargin: "0",
    marginBalance: 0,
    unpnl: 0,
  };

  GetMarginRate(val) {
    switch (true) {
      case val < 50: {
        return 0.4;
      }

      case val >= 50 && val < 250: {
        return 0.5;
      }

      case val >= 250 && val < 1000: {
        return 1;
      }

      case val >= 1000 && val < 5000: {
        return 2.5;
      }

      case val >= 5000 && val < 20000: {
        return 5;
      }

      case val >= 20000 && val < 50000: {
        return 10;
      }

      case val >= 50000 && val < 100000: {
        return 12.5;
      }

      case val >= 100000 && val < 2000000: {
        return 15;
      }

      case val >= 2000000: {
        return 25;
      }

      default: {
        return 0;
      }
    }
  }


  crossMarginBalance: any = 0;
  GetMarkPrice(pair) {
    this.futuresService.MarkPrice(pair).subscribe((data) => {
      const res = JSON.parse(data);
      if (res.stream && res.stream == "!markPrice@arr") {
        res.data.forEach(element => {
          if (this.coinSelectedValue == element.s) {
            this.marketData.mark = element.p;
            this.currentMarketPrice = this.marketData.mark;
            this.marketData.fundingRate = element.r * 100;
            this.marketData.nextFundTime = element.T;
          }
        });

        this.positionData.forEach((element) => {
          this.userDetail.positions.forEach(user => {
            if (element.symbol == user.symbol) {
              element.marginType = user.isolated == false ? 'Cross' : 'Isolated';
            }
          });
        })
        this.positionData.forEach((el) => {
          res.data.forEach((resData) => {
            if (this.selected.coinPair === resData.s) {
              this.markPriceArr[this.selected.coinPair] =
                resData.p;

              this.marketData.markTemp = this.marketData.mark;
              this.marketData.mark = resData.p;
              this.marketData.fundingRate = resData.r * 100;
              this.marketData.nextFundTime = resData.T;
            }
            if (resData.s === el.symbol) {
              if (el.positionSide == 'LONG' || el.positionAmt > 0) {
                el.pnl =
                  (resData.p - parseFloat(el.entryPrice)) *
                  Math.abs(el.positionAmt);
              } else {
                el.pnl =
                  ((parseFloat(el.entryPrice) - parseFloat(resData.p)) *
                    Math.abs(el.positionAmt));
              }
              let posVal = parseFloat(
                (Math.abs(el.positionAmt) * parseFloat(resData.p)).toFixed(6)
              );

              this.crossMarginRatio.unpnl = el.pnl;
              this.crossMarginRatio.marginBalance =
                this.selected.balance +
                this.crossMarginRatio.unpnl;
              this.crossMarginBalance = this.crossMarginRatio.marginBalance;
              this.crossMarginBalance = parseFloat(this.crossMarginBalance).toFixed(6)
              this.crossMarginRatio.maintenanceMargin = (
                (posVal * this.GetMarginRate(posVal)) /
                100
              ).toFixed(6);

              this.crossMarginRatio.marginRatio = ((parseFloat(this.crossMarginRatio.maintenanceMargin) / parseFloat(this.crossMarginBalance)) * 100).toFixed(6);
              Object.keys(this.crossMarginRatio).forEach(
                (key) => {
                  if (isNaN(this.crossMarginRatio[key])) {
                    this.crossMarginRatio[key] = 0;
                  }
                }
              );

              let initialMargin =
                (parseFloat(el.entryPrice) * Math.abs(el.positionAmt) /
                  parseInt(el.leverage));
              el.roe = ((el.pnl / initialMargin) * 100).toFixed(26);
              let markPrice = parseFloat(resData.p);
              el.markPrice = parseFloat(
                markPrice.toFixed(6)
              );
              if (!isFinite(el.roe)) {
                el.roe = 0;
              }
            }
          });

        });
      }
      if (
        res.stream &&
        res.stream ==
        this.selected.coinPair.toLowerCase() + "@miniTicker"
      ) {
        this.marketData.lastPriceTemp = this.marketData.lastPrice;
        this.marketData.lastPrice = res.data.c;
      }

      if (res && res.stream && res.stream == "!miniTicker@arr") {
        // this.latprice = res.data;

        // this.activeTrades.forEach((el) => {
        //     res.data.forEach((resData) => {
        //         if (resData.s === el.pair) {
        //             if (el.focused == true) {
        //             } else {
        //                 if (el.closevalue != null) {
        //                     if (this.latprice_status === true) {
        //                         el.closevalue = resData.c;
        //                         el.focused == false;
        //                     }
        //                 } else {
        //                     el.closevalue = resData.c;
        //                     el.focused == false;
        //                 }
        //             }
        //         }
        //     });
        // });
        // this.latprice_status = false;
      }

      if (
        res.stream &&
        res.stream == this.selected.coinPair.toLowerCase() + "@ticker"
      ) {
        this.marketData["24hrChange"] = res.data.p;
        this.marketData["24hrHigh"] = res.data.h;
        this.marketData["24hrLow"] = res.data.l;
        this.marketData["24hrVolume"] = res.data.v;
        this.marketData["24hrChangePer"] = res.data.P;
        this.marketData.avgPrice = res.data.w;
      }
    });
  }

  //Mode
  activeTrades = [];
  hedgeMode = false;
  disable = false;

  updatemode() {
    if (this.positionData.length <= 0 || this.openOrderHistory.length <= 0) {
      this.futuresService.changePosition(this.userId,
        {
          side: !this.hedgeMode
        }
      ).subscribe((data) => {
        if (data['success']) {
          this.hedgeMode = !this.hedgeMode;
          if (this.positionData.length > 0 || this.openOrderHistory.length > 0) {
            this.disable = true
          } else {
            this.disable = false;
          }

          if (this.hedgeMode) {
            this.titleContent = 'Open';
            this.selltitleContent = 'Close'
            // this.selected.min= this.
          } else {
            this.titleContent = 'Buy/Long';
            this.selltitleContent = 'Sell/Short'
          }
          this.notify.success(data['message']);
        }
        else {
          this.hedgeMode = this.hedgeMode;
          if (this.hedgeMode) {
            this.titleContent = 'Open';
            this.selltitleContent = 'Close'
          } else {
            this.titleContent = 'Buy/Long';
            this.selltitleContent = 'Sell/Short'
          }
          this.notify.error(data['message'])
        }
      });
    }
  }


  titleContent = 'Buy/Long';
  selltitleContent = 'Sell/Short'
  modeGet() {
    this.futuresService.getPosition(this.userId).subscribe((res) => {
      if (res['success']) {
        this.hedgeMode = res['data'].dualSidePosition;
        if (this.hedgeMode) {
          this.titleContent = 'Open';
          this.selltitleContent = 'Close'
        }
        if (this.positionData.length > 0 || this.openOrderHistory.length > 0) {
          this.disable = true
        } else {
          this.disable = false;
        }
      }
    });
  }


  //History
  positionData = [];
  isFound = false;
  getPosition() {
    this.futuresService.getActivePositon(this.userId).subscribe((res) => {
      if (res['success']) {
        this.positionData = res['data'];
        this.positionData.forEach(element => {
          if (element.symbol == this.coinSelectedValue) {
            this.isFound = true;
            this.disable = true;
          }
          if (element.marginType == 'cross') {
            element.crossMarginRatio = Number((parseFloat(element.entryPrice) * parseFloat(element.positionAmt)) / parseFloat(element.leverage));
          }
          this.tradePairData.forEach(trade => {
            if (trade.symbol == element.symbol) {
              element.coinPrecision = trade.quantityPrecision;
              element.pricePrecision = trade.pricePrecision;
              element.positionAmt = Number(element.positionAmt)
              if ((+element.positionAmt) > 0) {
                element.closePrice = Number(((+element.entryPrice / 100) * 1) + (+element.entryPrice)).toFixed(this.pricePrecision);
              } else {
                element.closePrice = Number((+element.entryPrice) - ((+element.entryPrice / 100) * 1)).toFixed(this.pricePrecision);
              }
            }
            // else{
            //   element.positionAmt = Number(element.positionAmt)
            //   if ((+element.positionAmt) > 0) {
            //     element.closePrice = Number(((+element.entryPrice / 100) * 1) + (+element.entryPrice)).toFixed(2);
            //   } else {
            //     element.closePrice = Number((+element.entryPrice) - ((+element.entryPrice / 100) * 1)).toFixed(2);
            //   }    
            // }
          });
        });
      }
    })
  }


  //Adjust margin
  isolatedMarginisVisible = false;
  isolatedData: any = {};
  addMarginForm: FormGroup;
  removeMarginForm: FormGroup;

  isolatedIndx;
  isolatedMargin(data, ind): void {
    this.isolatedMarginisVisible = true;
    this.isolatedData = data;
    this.isolatedIndx = ind;
  }

  modifyMargin(data, type, form) {
    this.loading.marginload = true;
    for (const i in form.controls) {
      form.controls[i].markAsDirty();
      form.controls[i].updateValueAndValidity();
    }
    if (form.valid) {
      let val = {
        symbol: this.coinSelectedValue,
        type: type,
        amount: form.value.amount,
        positionSide: this.hedgeMode ? data.positionSide : null
      }
      Object.keys(val).forEach((key) => (val[key] == null) && delete val[key]);

      this.futuresService.changeMarginValue(this.userId, val).subscribe((res) => {
        if (res['success']) {
          this.positionData[this.isolatedIndx].isolatedMargin = res['data'][this.isolatedIndx].isolatedMargin;
          this.positionData = this.positionData;
          form.reset();
          this.loading.marginload = false;
          this.isolatedMarginisVisible = false;
          this.notify.success(res["message"]);
        } else {
          this.loading.marginload = false;
          this.isolatedMarginisVisible = false;
          this.notify.error(res["message"]);
        }
      },
        (err) => {
          this.notify.error(err.error.message);
          this.loading.marginload = false;
        });
    }
  }

  // closeOrder(data) {
  //   this.futuresService.closeOrder({
  //     id: data._id,
  //     symbol: data.binanceResponse[0].symbol,
  //     side: data.binanceResponse[0].side,
  //     type: data.binanceResponse[0].origType,
  //     quantity: data.quantity
  //   }).subscribe((data) => {
  //     if (data["status"] == 200) {
  //       this.isolatedMarginisVisible = false;
  //       this.notify.success(data["message"]);
  //     } else {
  //       this.isolatedMarginisVisible = false;
  //       this.notify.error(data["message"]);
  //     }
  //   },
  //     (err) => {
  //       this.notify.error(err.error.message);
  //     });

  // }

  checkMarginValue() {
    if (this.addMarginForm.value.amount > this.selected.balance) {
      this.addMarginForm.controls['amount'].setErrors({ 'error': true });
    }
  }

  checkremoveMarginValue() {
    if (this.removeMarginForm.value.amount > (this.isolatedData.margin - ((this.isolatedData.entryprice * this.isolatedData.quantity) / this.selected.leverage)).toFixed(2)) {
      this.removeMarginForm.controls['amount'].setErrors({ 'error': true });
    }
  }

  tradeHistory = [];
  tempTradeHistory = [];
  totalHistoryCount = 0;
  tempTradeCount = 0;
  isPrevDisable = false;
  index = 1;
  size = 10

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

  productPrevious() {
    let val = this.tempTradeHistory.length % 10;
    if (val == 0) {
      this.tempTradeHistory = this.tempTradeHistory.slice(0, -10);
      let arr = this.tempTradeHistory;
      this.tradeHistory = arr.slice(-10)
    } else {
      this.tempTradeHistory = this.tempTradeHistory.slice(0, val * -1);
      let arr = this.tempTradeHistory;
      this.tradeHistory = arr.slice(-10)
    }
  }

  deleteTradeHistory(id) {
    this.futuresService.deleteTrade(id,this.userId).subscribe((res) => {
      if (res['success']) {
        this.tradeHistory = this.tradeHistory.filter(d => d._id !== id);
        this.tempTradeHistory = this.tempTradeHistory.filter(d => d._id !== id);
        this.totalHistoryCount = this.totalHistoryCount - 1;
        let val = this.tempTradeHistory.length % 10;
        if (val == 0) {
          this.productPrevious()
        }
        if(this.tempTradeHistory.length == 0){
          this.getTradeHistory(this.index,this.size);
        }
        this.notify.success(res['message'])
      } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  tradeExport() {
    const props = ['updatedAt', '_id', 'user_id', '__v', 'deleted'];
    props.forEach(element => {
      this.tempTradeHistory.forEach(key => {
        delete key[element];
      });
    });
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tempTradeHistory);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // XLSX.writeFile(wb, 'FXtrade.xlsx');
  }

  openOrderHistory = [];
  getOpenOrder() {
    this.futuresService.openOrderList(this.userId).subscribe((res) => {
      if (res['success']) {
        this.openOrderHistory = res['data'];
        if (this.positionData.length > 0 || this.openOrderHistory.length > 0) {
          this.disable = true
        } else {
          this.disable = false;
        }
      }
      // this.openOrderHistory.forEach(element =>{
      //   if(element.symbol == this.coinSelectedValue){
      //     this.disable = true;
      //   }
      // })
    })
  }

   cancelOrder(data, i) {
    let val = {
      symbol: data.symbol,
      origClientOrderId: data.clientOrderId
    }
    this.futuresService.cancelOpenOrder(this.userId, val).subscribe((res) => {
      if (res['success']) {
        this.openOrderHistory = this.openOrderHistory.filter(d => d.orderId !== data.orderId);
        this.notify.success(res['message']);
        if (this.positionData.length > 0 || this.openOrderHistory.length > 0) {
          this.disable = true
        } else {
          this.disable = false;
        }
        this.getUser();
      } else {
        this.notify.error(res['message']);
     }
      //end of switch
    },(err)=>{
      this.notify.error(err.error.message);
     })
  }

  //BOT

  activeBotList: any = [];
  targetVal = {
    total: 0,
    delete: 0,
    indx: 0,
    active: -1,
    old: 0,
    loading: -1,
  };

  getBotList() {
    this.futuresService.getBotList(this.userId).subscribe((res) => {
      if (res['success']) {
        this.activeBotList = res['data'];
      }
    });
  }
  getAddBot() {
    //  this.futuresService.botList(this.userId).subscribe((res)=>{
    //    if(res['success']){
    //      this.BOTList = res['data'];
    //    }
    //  })
  }

  ToggleBotTarget(indx) {
    if (this.targetVal.active == indx) {
      this.targetVal.active = -1;
      return;
    }
    this.targetVal.active = indx;
    this.getTargetControl(indx)
  }


  Step2validateForm!: FormGroup;

  targetTypeofCtrl: Array<{ id: number; controlInstance: string; value: number }> = [];
  triggerTypeofCtrl: Array<{ id: number; controlInstance: string; value: number }> = [];
  qtyOfControl: Array<{ id: number; controlInstance: string; value: number }> = [];
  targetCtrl: Array<{ id: number; controlInstance: string; value: number }> = [];

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.targetTypeofCtrl.length > 0 ? this.targetTypeofCtrl[this.targetTypeofCtrl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `targettype${id}`,
      value: null
    };
    const index = this.targetTypeofCtrl.push(control);

    this.triggerTypeCtrl();
    this.targetCtrlfield();
    this.qtyfield();
    this.Step2validateForm.addControl(
      this.targetTypeofCtrl[index - 1].controlInstance,
      new FormControl(null, [Validators.required])
    );
  }


  targetCtrlfield() {
    // if ( this.targetTypeofCtrl.length > 0)
    //     for (let i = 0; i < this.targetTypeofCtrl.length; i++) {
    const id = this.targetCtrl.length > 0 ? this.targetCtrl[this.targetCtrl.length - 1].id + 1 : 0;
    const index = this.targetCtrl.push({
      id: id,
      controlInstance: `target${id}`,
      value: 0
    })
    this.Step2validateForm.addControl(
      this.targetCtrl[index - 1].controlInstance,
      new FormControl(null, [Validators.min(1), Validators.required])
    );
    // }
  }


  triggerTypeCtrl() {
    // if ( this.targetTypeofCtrl.length > 0)
    //     for (let i = 0; i < this.targetTypeofCtrl.length; i++) {
    const id = this.triggerTypeofCtrl.length > 0 ? this.triggerTypeofCtrl[this.triggerTypeofCtrl.length - 1].id + 1 : 0;

    const index = this.triggerTypeofCtrl.push({
      id: id,
      controlInstance: `triggertype${id}`,
      value: null
    })
    this.Step2validateForm.addControl(
      this.triggerTypeofCtrl[index - 1].controlInstance,
      new FormControl(null, [Validators.required])
    );
    // }
  }


  qtyfield() {
    //  if (this.targetTypeofCtrl.length > 0)
    //     for (let i = 0; i < this.targetTypeofCtrl.length; i++) {
    const id = this.qtyOfControl.length > 0 ? this.qtyOfControl[this.qtyOfControl.length - 1].id + 1 : 0;

    const index = this.qtyOfControl.push({
      id: id,
      controlInstance: `qty${id}`,
      value: 0
    })
    this.Step2validateForm.addControl(
      this.qtyOfControl[index - 1].controlInstance,
      new FormControl(null, [Validators.min(1), Validators.max(100), Validators.pattern('^(0|\-?[1-9][0-9]*)$'), Validators.required])
    );
    // }
  }

  removeField(i: { id: number; controlInstance: string; value: number }, e: MouseEvent): void {
    e.preventDefault();
    if (this.targetTypeofCtrl.length > 0) {
      const index = this.targetTypeofCtrl.indexOf(i);
      this.targetTypeofCtrl.splice(index, 1);
      const index1 = this.targetCtrl.indexOf(i);
      this.targetCtrl.splice(index1, 1);
      const index2 = this.triggerTypeofCtrl.indexOf(i);
      this.triggerTypeofCtrl.splice(index2, 1);
      const index3 = this.qtyOfControl.indexOf(i);
      this.qtyOfControl.splice(index3, 1);
      this.Step2validateForm.removeControl(i.controlInstance);
    }
  }

  getTargetControl(indx) {
    this.targetTypeofCtrl = [];
    this.qtyOfControl = [];
    this.triggerTypeofCtrl = [];
    this.targetCtrl = [];
    this.activeBotList[indx].target.forEach((element, index) => {
      this.activeBotList[indx].target[index].isEdit = true;
      const targetTypeindex = this.targetTypeofCtrl.push({
        id: index,
        controlInstance: `targettype${index}`,
        value: element.targetType
      })
      const triggerTypeindex = this.triggerTypeofCtrl.push({
        id: index,
        controlInstance: `triggertype${index}`,
        value: element.triggerType
      })
      const qtyIndex = this.qtyOfControl.push({
        id: index,
        controlInstance: `qty${index}`,
        value: element.quantity
      })
      const targetIndex = this.targetCtrl.push({
        id: index,
        controlInstance: `target${index}`,
        value: element.target
      })
      this.Step2validateForm.addControl(
        this.targetTypeofCtrl[targetTypeindex - 1].controlInstance,
        new FormControl(this.targetTypeofCtrl[targetTypeindex - 1].value, [Validators.required])
      );
      this.Step2validateForm.addControl(
        this.targetCtrl[targetIndex - 1].controlInstance,
        new FormControl(this.targetCtrl[targetIndex - 1].value, [Validators.min(1)])
      );
      this.Step2validateForm.addControl(
        this.triggerTypeofCtrl[triggerTypeindex - 1].controlInstance,
        new FormControl(this.triggerTypeofCtrl[triggerTypeindex - 1].value, [Validators.required])
      );
      this.Step2validateForm.addControl(
        this.qtyOfControl[qtyIndex - 1].controlInstance,
        new FormControl(this.qtyOfControl[qtyIndex - 1].value, [Validators.min(1), Validators.max(100), Validators.pattern('^(0|\-?[1-9][0-9]*)$')])
      );
    });
  }

  targetUpdate(val, id, i, ind) {
    let data = {
      id: id,
      target_id: val,
      targetType: this.Step2validateForm.value[this.targetTypeofCtrl[i].controlInstance],
      triggerType: this.Step2validateForm.value[this.triggerTypeofCtrl[i].controlInstance],
      target: this.Step2validateForm.value[this.targetCtrl[i].controlInstance],
      quantity: this.Step2validateForm.value[this.qtyOfControl[i].controlInstance]
    }
    this.futuresService.updateTarget(this.userId, data).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.activeBotList[ind].target = res['data'].target;
        this.activeBotList[ind].target.forEach(element => {
          element.isEdit = true;
        });
        this.activeBotList = this.activeBotList;
      } else {
        this.notify.error(res['success'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  targetAdd(val, i, ind) {

    let data = {
      id: val,
      targetType: this.Step2validateForm.value[this.targetTypeofCtrl[i].controlInstance],
      triggerType: this.Step2validateForm.value[this.triggerTypeofCtrl[i].controlInstance],
      target: this.Step2validateForm.value[this.targetCtrl[i].controlInstance],
      quantity: this.Step2validateForm.value[this.qtyOfControl[i].controlInstance]
    }
    this.futuresService.addTarget(this.userId, data).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        //  this.getBotList();
        this.activeBotList[ind].target = res['data'].target;
        this.activeBotList[ind].target.forEach(element => {
          element.isEdit = true;
        });
        this.activeBotList = this.activeBotList;
      } else {
        this.notify.error(res['success'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  isAddShow = false;
  isWarning = false;
  calQuantity() {
    let val = 0;
    this.qtyOfControl.forEach(element => {
      val = val + this.Step2validateForm.value[element.controlInstance]
    });
    this.isWarning = val > 100 ? true : false;
    this.isAddShow = val >= 100 ? true : false;
  }

  async configUpdate(id, data, status, i) {
    let val = {
      id: id,
      auto_close: data,
      status: status == 'START' ? 'STOP' : status == 'null' ? null : 'START'
    }
    await Object.keys(val).forEach((key) => (val[key] == null) && delete val[key]);
    this.futuresService.updateConfigBot(this.userId, val).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.activeBotList[i].status = val.status == null ? this.activeBotList[i].status : val.status
      } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  targetDelete(targetid, id, i, ind, e) {
    let val = {
      id: id,
      target_id: targetid
    }
    this.futuresService.deleteTarget(this.userId, val).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.removeField(this.qtyOfControl[i], e)
        this.activeBotList[ind].target = res['data'].target;
        this.activeBotList[ind].target.forEach(element => {
          element.isEdit = true;
        });
        this.activeBotList = this.activeBotList;

      } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  botEditForm: FormGroup;
  botQuan = 0;
  botStopValue = 0;
  botstopSwitch = false;
  botLeverage = 0;
  botType = 'LIMIT';
  botPosition = 'LONG';
  botClose = false;
  editbotisVisible = false;
  editBotData: any;

  editBothandleOk(data) {
    this.editBotData = data;
    this.botQuan = data.quantity;
    this.botStopValue = data.stopLoss;
    this.botstopSwitch = data.stopLossEnable;
    this.botLeverage = data.leverage;
    this.botType = data.type;
    this.botPosition = data.positionSide;
    this.botClose = data.auto_close;
    this.editbotisVisible = true;
  }

  changeStopLoss() {
    if (this.botstopSwitch) {
      this.botEditForm.controls["botstopLossValue"].setValidators([
        Validators.min(0.1),
        Validators.max(50),
        Validators.required,
      ]);
    } else {
      this.botEditForm.controls['botstopLossValue'].clearValidators();
      this.botEditForm.controls['botstopLossValue'].updateValueAndValidity();
    }
  }

  botUpdate() {
    this.loading.botUpdateLoad = true;
    let val = {
      quantity: this.botQuan,
      leverage: this.botLeverage,
      type: this.botEditForm.value.type,
      positionSide: this.botEditForm.value.position,
      stopLossEnable: this.botstopSwitch,
      stopLoss: this.botEditForm.value.botstopLossValue,
      auto_close: this.botClose,
      id: this.editBotData._id
    }
    this.futuresService.updateConfigBot(this.userId, val).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.loading.botUpdateLoad = false
        this.getBotList();
        this.handleCancel();
      } else {
        this.notify.error(res['success']);
        this.loading.botUpdateLoad = false;
      }
    },(err)=>{
      this.notify.error(err.error.message);
      this.loading.botUpdateLoad = false
    })
  }


  closeOrder = {
    limit: false,
    market: false
  }
  closeOrderId:any;
  async closeLimit(val, type, price,ind) {
    this.closeOrder.limit = type == 'LIMIT' ? true : false;
    this.closeOrder.market = type == 'MARKET' ? true : false;
    this.closeOrderId = ind
    let payload = {
      symbol: val.symbol,
      side: val.positionAmt < 0 ? 'BUY' : 'SELL',
      positionSide: this.hedgeMode ? val.positionSide : null,
      type: type,
      timeInForce: type == "LIMIT" ? "GTC" : null,
      quantity: Math.abs(val.positionAmt),
      price: type == "LIMIT" ? Number(price) : null,
    };

    await Object.keys(payload).forEach((key) => (payload[key] == null) && delete payload[key]);
    await this.futuresService
      .createOrder(this.userId, payload)
      .pipe(
        finalize(() => {
          this.loading.buy = false;
        })
      )
      .subscribe(
        (data) => {
          if (data['success']) {
            if (this.positionData.length > 0 || this.openOrderHistory.length > 0) {
              this.disable = true
            } else {
              this.disable = false;
            }
            this.notify.success(data["message"]);
            this.getOpenOrder();
          } else {
              this.notify.error(data["message"]);
              this.closeOrder.limit = false;
            this.closeOrder.market = false;
          }
        },
        (err) => {
          this.notify.error(err.error.message);
          this.closeOrder.limit = false;
          this.closeOrder.market = false;
        }
      );
    //switch
    if (this.positionData.length <= 0) {
      this.hedgeMode = !this.hedgeMode;
    }
    this.disable = false;
    //end of switch
  }

  //Get trade pair
  tradePairData = [];
  coinPrecision;
  pricePrecision;
  getTradePair() {
    this.futuresService.tradePair().subscribe((res) => {
      if (res['success']) {
        this.tradePairData = res['data'];
        this.tradePairData.forEach(element => {
          if (element.symbol == this.coinSelectedValue) {
            this.coinPrecision = element.quantityPrecision;
            this.pricePrecision = element.pricePrecision;
            this.selected.min = element.minQty;
          }
        });
      }
    })
  }

  //Validation

  changeValidation(form) {
    if (form.value.type == 'STOP') {
      form.controls['stopPrice'].setValidators([Validators.required])
    } else {
      form.controls['stopPrice'].reset();
      form.controls['stopPrice'].clearValidators();
      form.controls['stopPrice'].updateValueAndValidity();
    }
    form.controls['percentage'].reset();
  }

  
}
