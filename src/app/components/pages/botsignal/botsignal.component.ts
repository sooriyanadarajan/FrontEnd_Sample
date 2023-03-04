import { Component, OnInit } from '@angular/core';
import { BotsignalService } from '../../../services/botsignal.service';
import { NotifyService } from '../../../services/notification.service';
import {  Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TradeService } from '../../../services/TradePair.service';
import { FututreService } from '../../../services/fututre.service';

@Component({
  selector: 'app-botsignal',
  templateUrl: './botsignal.component.html',
  styleUrls: ['./botsignal.component.scss']
})
export class BotsignalComponent implements OnInit {
  signalType = "SPOT";
  searchText = '';
  botSignalForm:FormGroup;
  page = 1;
  limit = 10;

  constructor(
    private botSignalService:BotsignalService,
    private notify:NotifyService,
    private fb:FormBuilder,
    private tradeService:TradeService,
    private futureService:FututreService
  ) { }

  ngOnInit(): void {
   this.botSignalForm = this.fb.group({
      // bottype:['SPOT',[Validators.required]],
      signalname:[null,[Validators.required]],
      symbol:[null,[Validators.required]],
      signaltype:[null,[Validators.required]]
    });
    this.typeChange();
  }

  isVisible = false;

handleCancel(){
  this.isVisible = false;
}

showModal() {
  this.isVisible = true;
}

  SearchTextChanged = new Subject<string>();
  isTableLoading = false;
  search() {
    this.SearchTextChanged.next(this.searchText);
  }
  
  //Spot signal
  tradePairList = [];
  getSpotTradePair(){
    this.tradeService.getSpotTradePair().subscribe((res)=>{
      if(res['success']){
        this.tradePairList = res['data'];
        this.tradePairList = this.tradePairList.filter(t=>t.status == true);
        }
    })
  }

  //FX Signal
  getFxTradePair(){
    this.tradeService.getFxTradePair().subscribe((res)=>{
      if(res['success']){
        this.tradePairList = res['data'];
        this.tradePairList = this.tradePairList.filter(t=>t.status == true);
      }
    })
  }

  typeChange(){
    if(this.signalType == 'SPOT'){
      this.getSpotTradePair();
      this.getSpotSignalList(this.page,this.limit);
      this.getAvailableBot('SPOT')
    }
    if(this.signalType == 'FX'){
      this.getFxTradePair();
      this.getFxSignalList(this.page,this.limit);
      this.getAvailableBot('FX')
    }
  }

  availabelBotList = []
  getAvailableBot(val){
    this.futureService.availableBots(val).subscribe((res)=>{
      if(res['success']){
        this.availabelBotList = res['data']
      }
    })
  }

  signalList:any = [];
  totalCount = 0;
  getSpotSignalList(page,limit){
    let val = {
      page:page,
      limit:limit
    }
    this.botSignalService.listSpotSignal(val).subscribe((res)=>{
      if(res['success']){
        this.signalList =  res['data']['list']
        this.totalCount = res['data']['count']
      //   this.SearchTextChanged.pipe(debounceTime(300)).subscribe((val) => {
      //     if (val == "" || val == null || val == undefined) {
      //       this.signalList = [...data];
      //       this.totalCount = this.signalList.length
      //       this.isTableLoading = false;
      //     } else {
      //       let tempdata = data;
      //       this.signalList = tempdata.filter((item) => {
      //         if (item.name) {
      //           if (item.name.toLowerCase().includes(val.toLowerCase()))
      //             return item.name.toLowerCase().includes(val.toLowerCase());
      //           this.isTableLoading = false;
      //         }
      //       });
      //       this.totalCount = this.signalList.length
      //     }
   
      // })
      }
    })
  }

  createSpotSignal(){
    let val = {
      order_type: this.botSignalForm.value.signaltype,
      signal_type: this.botSignalForm.value.symbol,
      pair:this.botSignalForm.value.signalname
    }
    this.botSignalService.createSpotSignal(val).subscribe((res)=>{
      if(res['success']){
        this.notify.success(res['message']);
        this.botSignalForm.reset();
        this.handleCancel();
        this.getSpotSignalList(this.page,this.limit);
      }else{
        this.notify.error(res['message'])
      }
    },(err)=>{
      this.notify.error(err.error.message)
    })
  }

  deleteSpotSignal(id){
    this.botSignalService.deleteSpotSignal(id).subscribe((res)=>{
      if(res['success']){
        this.notify.success(res['message']);
        this.signalList = this.signalList.filter(t=>(t._id != id))
      }else{
        this.notify.error(res['message'])
      }
    },(err)=>{
      this.notify.error(err.error.message)
    })
  }

   //FX signal
    getFxSignalList(page,limit){
      this.isTableLoading = true;
     this.signalList = []
     let val = {
       page:page,
       limit:limit
     }
     this.botSignalService.listFxSignal(val).subscribe((res)=>{
       if(res['success']){
         this.signalList =  res['data']['list'];
         let data = this.signalList;
         this.totalCount = res['data']['count'];
         this.isTableLoading = false;
      //    this.SearchTextChanged.pipe(debounceTime(300)).subscribe((val) => {
      //     if (val == "" || val == null || val == undefined) {
      //       this.signalList = [...data];
      //       this.isTableLoading = false;
      //     } else {
      //       let tempdata = data;
      //       this.signalList = tempdata.filter((item) => {
      //         if (item.name) {
      //           if (item.name.toLowerCase().includes(val.toLowerCase()))
      //             return item.name.toLowerCase().includes(val.toLowerCase());
      //           this.isTableLoading = false;
      //         }
      //       });
      //     }
   
      // })
       }})
   }
 
   createFxSignal(){
     let val = {
      order_type: this.botSignalForm.value.signaltype,
      signal_type: this.botSignalForm.value.symbol,
      pair:this.botSignalForm.value.signalname
     }
     this.botSignalService.createFxSignal(val).subscribe((res)=>{
       if(res['success']){
         this.notify.success(res['message']);
         this.handleCancel();
         this.botSignalForm.reset();
         this.getFxSignalList(this.page,this.limit);
       }else{
         this.notify.error(res['message'])
       }
     },(err)=>{
       this.notify.error(err.error.message)
     })
   }
 
   deleteFxSignal(id){
     this.botSignalService.deleteFxSignal(id).subscribe((res)=>{
       if(res['success']){
         this.notify.success(res['message']);
         this.signalList = this.signalList.filter(t=>(t._id != id))
       }else{
         this.notify.error(res['message'])
       }
     },(err)=>{
       this.notify.error(err.error.message)
     })
   }
}
