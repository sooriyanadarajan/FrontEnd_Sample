import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../../services/notification.service';
import { TradeService } from '../../../services/TradePair.service';
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-fundprofit',
  templateUrl: './tradepair.component.html',
  styleUrls: ['./tradepair.component.scss']
})
export class FundprofitComponent implements OnInit {

  searchText = '';
  SearchTextChanged = new Subject<string>();
  isTableLoading = false;


  searchText1 = '';
  SearchTextChanged1 = new Subject<string>();
  isTableLoading1 = false;


  listOfData = [];
  listOfFxData = [];

   //Table
   pageIndex = 1;
   pageSize = 10;
  
  constructor(private notify:NotifyService,private trade:TradeService) {}

  ngOnInit() {
    this.getSpotTrade();
  }

  search() {
    this.SearchTextChanged.next(this.searchText);
  }

  search1() {
    this.SearchTextChanged1.next(this.searchText1);
  }



  getSpotTrade(){
    this.isTableLoading = true;
    this.trade.getSpotTradePair().subscribe(res => {
      this.listOfData = res['data'];
      let data  = this.listOfData;
      this.isTableLoading = false;
      this.SearchTextChanged.pipe(debounceTime(300)).subscribe((val) => {
        if (val == "" || val == null || val == undefined) {
          this.listOfData = [...data];
          this.isTableLoading = false;
        } else {
          let tempdata = data;
          this.listOfData = tempdata.filter((item) => {
            if (item.symbol) {
              if (item.symbol.toLowerCase().includes(val.toLowerCase()))
                return item.symbol.toLowerCase().includes(val.toLowerCase());
              this.isTableLoading = false;
            }
            if(item.baseAsset){
              if(item.baseAsset.toLowerCase().includes(val.toLowerCase()))
                return item.baseAsset.toLowerCase().includes(val.toLowerCase());
              this.isTableLoading = false;
            }
            if(item.quoteAsset){
              if(item.quoteAsset.toLowerCase().includes(val.toLowerCase()))
              return item.quoteAsset.toLowerCase().includes(val.toLowerCase());
              this.isTableLoading = false;
            }
          });
        }
 
    })
    })
  }

  
index = 0;
  tabChange(e) {
    this.index = e.index
    this.pageSize = 10;
    if(e.index == 0){
      this.getSpotTrade();
    }
    if (e.index == 1) {
      this.trade.getFxTradePair().subscribe(res => {
        this.listOfFxData = res['data'];
        let data  = this.listOfFxData;
        this.isTableLoading1 = false;
        this.SearchTextChanged1.pipe(debounceTime(300)).subscribe((val) => {
          if (val == "" || val == null || val == undefined) {
            this.listOfFxData = [...data];
            this.isTableLoading1 = false;
          } else {
            let tempdata = data;
            this.listOfFxData = tempdata.filter((item) => {
              if (item.symbol) {
                if (item.symbol.toLowerCase().includes(val.toLowerCase()))
                  return item.symbol.toLowerCase().includes(val.toLowerCase());
                this.isTableLoading1 = false;
              }
              if(item.baseAsset){
                if(item.baseAsset.toLowerCase().includes(val.toLowerCase()))
                  return item.baseAsset.toLowerCase().includes(val.toLowerCase());
                this.isTableLoading1 = false;
              }
              if(item.quoteAsset){
                if(item.quoteAsset.toLowerCase().includes(val.toLowerCase()))
                return item.quoteAsset.toLowerCase().includes(val.toLowerCase());
                this.isTableLoading1 = false;
              }
            });
          }
      })
      })
    }
  }

  editTradeStatus(i) {
    let val = {
      id: this.listOfData[i]._id,
      status: !this.listOfData[i].status
    }
    this.trade.updateSpotTradePair(val).subscribe(res => {
      this.notify.success(res['message']);
      this.listOfData[i].status = !this.listOfData[i].status;
    }, error => {
      this.notify.error(error.error.message);
    })
  }

  editTradeFxStatus(i) {
    let val = {
      id: this.listOfFxData[i]._id,
      status: !this.listOfFxData[i].status
    }
    this.trade.updateFxTradePair(val).subscribe(res => {
      this.notify.success(res['message']);
      this.listOfFxData[i].status = !this.listOfFxData[i].status;
    }, error => {
      this.notify.error(error.error.message);
    })
  }


  filter(e) {
    console.log(e);
  }

  change(e) {
    console.log(e);
  }

//Import trade pair
isLoading = {
  fx:false,
  spot:false
}
spotImport(){
  this.isLoading.spot = true;
  this.trade.importSpotPair().subscribe((res)=>{
    if(res['success']){
      this.notify.success(res['message']);
      this.isLoading.spot = false;
    }else{
      this.notify.error(res['message']);
      this.isLoading.spot = false;
    }
  },(err)=>{
    this.notify.error(err.error.message);
    this.isLoading.spot = false;
  });
}

fxImport(){
  this.isLoading.fx = true;
  this.trade.importFxPair().subscribe((res)=>{
    if(res['success']){
      this.notify.success(res['message']);
      this.isLoading.fx = false;
    }else{
      this.notify.error(res['message']);
      this.isLoading.fx = false;
    }
  },(err)=>{
    this.notify.error(err.error.message);
    this.isLoading.fx = false;
  });
}

}
