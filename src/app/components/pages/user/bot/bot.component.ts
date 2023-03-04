import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators, FormControl
} from '@angular/forms';
import { SpotService } from '../../../../services/spot.service';
import { NotifyService } from '../../../../services/notification.service';
import { FututreService } from '../../../../services/fututre.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute } from '@angular/router';
import { NzMarks } from 'ng-zorro-antd/slider';
@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {
  userId;
  marksBot: NzMarks = {
    0: "",
    25: "",
    50: "",
    75: "",
    100: "",
  };
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
  botprofitEditForm:FormGroup;
  stopLossEditForm:FormGroup;
  isEditBot:boolean = false;
  editData;
  botType;
  isLoader = {
    isLimit: false,
    isMarket: false,
    isCancel: false,
    isStop: false,
    isManual: false,
    isEditBot: false
  }
  isModalVisible: boolean = false;
  public stopEditValue = 0;
  public activeStopVal = 0;
  public activeProfitVal = 0;
  public editPrice;

  constructor(
    private fb: FormBuilder,
    private spotService: SpotService,
    private notify: NotifyService,
    private futuresService:FututreService,
    private router:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.params.subscribe((routeParams) => {
      this.userId = routeParams.id;
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
    this.FxbotEditForm = this.fb.group({
      botstopLossValue: new FormControl(),
      botQuantity: new FormControl(Validators.required, Validators.min(1)),
      position: new FormControl(),
      type: new FormControl()
    })
    this.Step2validateForm = this.fb.group({
    });
    this.getConfigBot();
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
  
    usdtValue: any = 0
    getCurrentUsdtPrice() {
      this.spotService.currentPrice('BTCUSDT').subscribe((res) => {
        if (res['success']) {
          this.usdtValue = parseFloat(res['data']['price']).toFixed(6);
        }
      })
    }
    botStoplossCal(val) {
      let marketQuantity = 0;
      let quantity = this.editFund;
      // if (this.baseCoin == 'BTC') {
      //   marketQuantity = parseFloat(this.usdtValue) * quantity;
      //   this.buy_quan = marketQuantity - ((marketQuantity / 100) * val);
      // } else {
      //   this.buy_quan = quantity - ((quantity / 100) * val);
      // }
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
      this.expirydate =data.expiry;
      this.addcontrol();
    }
  
    handleCancel(): void {
      this.isModalVisible = false;
      this.isEditBot = false;
      this.editbotisVisible = false;
      this.isModalVisible = false;
      this.isEditBot = false;
      this.paymentYear = null;
      this.paymentType = null;
      this.couponCode = null;
    }

    expirydate;
  
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
          status: this.editData.status == 'EXPIRED' && new Date(this.expirydate) > new Date() ? 'STOP':this.editData.status,
          expiry: new Date(this.expirydate) > new Date() ? this.expirydate : ' '
        }
      }
      Object.keys(val).forEach((key) => (val[key] == null || val[key] == 0) && delete val[key]);
      if(new Date(this.expirydate) >= new Date()){
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
      }else{
        this.notify.error('Enter Correct Validity Date');
        this.isLoader.isEditBot = false;
      }
     
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


  //FUTURE TRADE
  activeBotList = [];
  FxbotEditForm: FormGroup;
  botQuan = 0;
  botStopValue = 0;
  botstopSwitch = false;
  botLeverage = 0;
  FxbotType = 'LIMIT';
  botPosition = 'LONG';
  botClose = false;
  editbotisVisible = false;
  fxeditBotData: any;
  targetVal = {
    total: 0,
    delete: 0,
    indx: 0,
    active: -1,
    old: 0,
    loading: -1,
  };

  changeStopLoss() {
    if (this.botstopSwitch) {
      this.FxbotEditForm.controls["botstopLossValue"].setValidators([
        Validators.min(0.1),
        Validators.max(50),
        Validators.required,
      ]);
    } else {
      this.FxbotEditForm.controls['botstopLossValue'].clearValidators();
      this.FxbotEditForm.controls['botstopLossValue'].updateValueAndValidity();
    }
  }

  botUpdate() {
    let val = {
      quantity: this.botQuan,
      leverage: this.botLeverage,
      type: this.FxbotEditForm.value.type,
      positionSide: this.FxbotEditForm.value.position,
      stopLossEnable: this.botstopSwitch,
      stopLoss: this.FxbotEditForm.value.botstopLossValue,
      auto_close: this.botClose,
      id: this.fxeditBotData._id
    }
    this.futuresService.updateConfigBot(this.userId,val).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.getBotList();
        this.handleCancel();
      } else {
        this.notify.error(res['success']);
      }
    })
  }

  getBotList() {
    this.futuresService.getBotList(this.userId).subscribe((res) => {
      if (res['success']) {
        this.activeBotList = res['data'];
      }
    });
  }

  
  async configUpdate(id, data, status, i) {
    let val = {
      id: id,
      auto_close: data,
      status: status == 'START' ? 'STOP' : status == 'null' ? null : 'START'
    }
    await Object.keys(val).forEach((key) => (val[key] == null) && delete val[key]);
    this.futuresService.updateConfigBot(this.userId,val).subscribe((res) => {
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

  
  editBothandleOk(data) {
    this.fxeditBotData = data;
    this.botQuan = data.quantity;
    this.botStopValue = data.stopLoss;
    this.botstopSwitch = data.stopLossEnable;
    this.botLeverage = data.leverage;
    this.FxbotType = data.type;
    this.botPosition = data.positionSide;
    this.botClose = data.auto_close;
    this.editbotisVisible = true;
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
    this.futuresService.updateTarget(this.userId,data).subscribe((res) => {
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
    this.futuresService.addTarget(this.userId,data).subscribe((res) => {
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

  targetDelete(targetid, id, i, ind, e) {
     let val = {
      id: id,
      target_id: targetid
    }
    this.futuresService.deleteTarget(this.userId,val).subscribe((res) => {
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

  //Add Bot
  public statuscustomOptions: OwlOptions = {
    loop: false,
    autoplay: false,
    dots: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 3,
      },
    },
    nav: true,
    navText: ['<span><img src="../../../assets/img/svg/chevron-left.svg"></span>', '<span><img src="../../../assets/img/svg/chevron-right.svg"></span>']
  };

  botAddType:any;
  showModalsubscribe(val): void {
    this.botAddType = val;
    this.getAllBotList(val);
    this.EditisVisible = true;
    this.addisVisible = false;
    this.paymentYear = null;
    this.paymentType = null;
    this.couponCode = null;
    this.botId = null;
  }

  handleCancelbot(): void {
    this.addisVisible = false;
    this.EditisVisible = false;
  }

  // handleOkbot(): void {
  //   this.getAllBotList();
  //   this.addisVisible = true;
  // }

  EditisVisible = false;
  public BOTList = [];
  public paymentType;
  public paymentYear;
  public couponCode;
  public botId;
  public isLoading: boolean = false;
  public botPaymentDetail;
  addisVisible =  false;
  subscribeBOT() {
    this.isLoading = true;
    let val = {
      id: this.botId._id,
      months: this.paymentYear,
      auto_sell: this.botId.auto_sell,
      symbol: this.botId.symbol
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.spotService.botAdd(val,this.userId).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.isLoading = false;
        this.paymentYear = null;
        this.paymentType = null;
        this.couponCode = null;
         this.getConfigBot();
         this.handleCancelbot();
        } else {
        this.notify.error(res['message']);
        this.isLoading = false;
      }
    }, (err) => {
      this.notify.error(err.error.message);
      this.isLoading = false;
    })
  }


  subscribeFXBOT() {
    this.isLoading = true;
    let val = {
      id: this.botId._id,
      months: this.paymentYear,
      auto_sell: this.botId.auto_sell,
      symbol: this.botId.symbol
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.futuresService.configFxBotAdd(val,this.userId).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.isLoading = false;
        this.paymentYear = null;
        this.paymentType = null;
        this.couponCode = null;
        this.getBotList();
         this.handleCancelbot();
        } else {
        this.notify.error(res['message']);
        this.isLoading = false;
      }
    }, (err) => {
      this.notify.error(err.error.message);
      this.isLoading = false;
    })
  }

  //All bot List
  botlistData = [];
  getAllBotList(val){
    this.futuresService.availableBots(val).subscribe((res)=>{
      if(res['success']){
        this.botlistData = res['data'];
      }
    })
  }

}
