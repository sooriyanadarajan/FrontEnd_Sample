import { Component, OnInit } from '@angular/core';
import { MarketPlace } from '../../../services/marketplace.service';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service'
import { NotifyService } from '../../../services/notification.service';
@Component({
  selector: 'app-marketbot',
  templateUrl: './marketbot.component.html',
  styleUrls: ['./marketbot.component.scss']
})
export class MarketbotComponent implements OnInit {

  public insertSwitchValue=false;
  public editSwitchValue;

  public addBot: FormGroup;
  public editBot: FormGroup;

  //Edit Signal
  public name;
  public type;
  public symbol;
  public price;
  public min;
  public max;
  public stat;
  public index;
  public description;
  public autosell;
  public rating;
  public _id;
  public bot_type;
  //Table
  pageIndex = 1;
  pageSize = 10;

  inputValue: string = 'ijfh846y438ufhuie';

  value = 100;
  listOfData = [];
  listCount = [];
  isVisible = false;
  isVisible2 = false;
  constructor(private market: MarketPlace, private fb: FormBuilder, private notify: NotifyService,
    private dashboardService:DashboardService) {
    this.editBot = this.fb.group({
      name: new FormControl(this.name, [Validators.required]),
      type: new FormControl(this.type, [Validators.required]),
      symbol: new FormControl(this.symbol, [Validators.required]),
      price: new FormControl(this.price, [Validators.required]),
      min: new FormControl(this.min, [Validators.required]),
      max: new FormControl(this.max, [Validators.required]),
      stat: new FormControl(this.stat, [Validators.required]),
      index: new FormControl(this.index, [Validators.required]),
      description: new FormControl(this.description, [Validators.required]),
      autosell: new FormControl(false),
      rating: new FormControl(this.rating, [Validators.required]),
      bot_type:new FormControl(this.bot_type,[Validators.required])
    })


  }


  ngOnInit(): void {
    this.getBotList(this.pageIndex, this.pageSize);
    this.getBotData();
    this.addBot = this.fb.group({
      name: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      symbol: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      min: new FormControl('', [Validators.required]),
      max: new FormControl('', [Validators.required]),
      stat: new FormControl('', [Validators.required]),
      index: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      autosell: new FormControl(this.insertSwitchValue),
      rating: new FormControl('', [Validators.required]),
      bot_type:new FormControl("SPOT",[Validators.required])
    })
  }

  get f() {
    return this.addBot.controls;
  }

  get editBotForm() {
    return this.editBot.controls;
  }

  
  stateChange(e){
    this.insertSwitchValue=e;
  }

  change(e){
    this.getBotList(1,parseInt(e));
    this.pageSize=parseInt(e);
 }

 isBot = {
   add:false,
   edit:false
 }
  addBotSubmit() {
    this.isBot.add = true;
    let val = {
      index: this.f.index.value,
      symbol: this.f.symbol.value,
      name: this.f.name.value,
      description: this.f.description.value,
      rating: this.f.rating.value,
      type: this.f.type.value,
      bot_type: this.f.bot_type.value,
      stat: this.f.stat.value,
      price: this.f.price.value,
      min: this.f.min.value,
      max: this.f.max.value,
      auto_sell:this.f.autosell.value
    }
    this.market.createBots(val).subscribe(res => {
      if(res['success']){
        this.notify.success(res['message']);
        this.isBot.add = false;
      }else{
        this.notify.error(res['message']);
        this.isBot.add = false;
      }
    
    },(error)=>{
      this.notify.error(error.error.message);
      this.isBot.add = false;
    });
    this.handleOk();
    this.ngOnInit();
  }

  deleteBot(id) {
    this.market.deleteBots(id).subscribe(res => {
      this.notify.success(res['message']);
      this.listOfData = this.listOfData.filter(item=> item._id != id);
    },error=>{
      this.notify.error(error.error.message);
    })
  }

  isTableLoading = false;
  getBotList(index, size) {
    this.isTableLoading = true;
    let val = {
      page: index,
      limit: size,
      key:this.searchTxt == ''?null:this.searchTxt
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.market.listBots(val).subscribe((res) => {
      if (res['success']) {
        this.listOfData = res['data']['list'];
        this.listCount = res['data']['count'];
        this.isTableLoading = false;
      }
    },error=>{
      this.notify.error(error.error.message);
    })
  }

  searchTxt:any = ''
  serarchList(){
    if(this.searchTxt == '' || this.searchTxt == null || this.searchTxt == undefined){
      this.getBotList(1, this.pageSize)
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  showModal2(id): void {
    this.isVisible2 = true;
        this.listOfData.forEach(element => {
          if (element._id === id) {
            this.name = element.name;
            this.type = element.type;
            this.symbol = element.symbol;
            this.price = element.price;
            this.min = element.min;
            this.max = element.max;
            this.stat = element.stat;
            this.index = element.index;
            this.description = element.description;
            this.autosell = element.auto_sell;
            this.rating = element.rating;
            this.bot_type=element.bot_type;
            this._id=element._id;
          }
    })

    this.editBot = this.fb.group({
      name: new FormControl(this.name, [Validators.required]),
      type: new FormControl(this.type, [Validators.required]),
      symbol: new FormControl(this.symbol, [Validators.required]),
      price: new FormControl(this.price, [Validators.required]),
      min: new FormControl(this.min, [Validators.required]),
      max: new FormControl(this.max, [Validators.required]),
      stat: new FormControl(this.stat, [Validators.required]),
      index: new FormControl(this.index, [Validators.required]),
      description: new FormControl(this.description, [Validators.required]),
      autosell: new FormControl(this.autosell),
      rating: new FormControl(this.rating, [Validators.required]),
      bot_type:new FormControl(this.bot_type,[Validators.required])
    })
  }


  updateBot(){  
    this.isBot.edit = true;
    let val={
      id:this._id,
      index:this.editBotForm.index.value,
      symbol:this.editBotForm.symbol.value,
      name:this.editBotForm.name.value,
      description:this.editBotForm.description.value,
      rating:this.editBotForm.rating.value,
      type:this.editBotForm.type.value,
      bot_type:this.editBotForm.bot_type.value,
      stat:this.editBotForm.stat.value,
      price:this.editBotForm.price.value,
      min:this.editBotForm.min.value,
      max:this.editBotForm.max.value,
      auto_sell:this.editBotForm.autosell.value
    }
    this.market.updateBot(val).subscribe(res=>{
      if(res['success']){
        this.notify.success(res['message']);
        this.getBotData();
        this.isBot.edit = false;
         this.isVisible2 = false;
      }else{
        this.notify.error(res['message']);
        this.isBot.edit = false;
      }
   
    },(error)=>{
      this.notify.error(error.error.message);
      this.isBot.edit = false;
    })
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisible2 = false;
  }

  //Fx trade data
  botData:any;
 inActiveBot = 0;
  getBotData(){
    this.dashboardService.getDashboardBot().subscribe((res)=>{
      if(res['success']){
        this.botData = res['data'];
        this.inActiveBot = (this.botData.count - Number(this.listCount))
      }
    })
  }



}
