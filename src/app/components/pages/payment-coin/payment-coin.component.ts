import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/services/notification.service';
import { PaymentCoinService } from 'src/app/services/PaymentCoin.service';
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-payment-coin',
  templateUrl: './payment-coin.component.html',
  styleUrls: ['./payment-coin.component.scss']
})
export class PaymentCoinComponent implements OnInit {


  //EditCoin
  public id;
  public name;
  public index;
  public symbol;
  public status;

  isVisible = false;
  isVisible2 = false;
  listOfData = [];
  listCount;

  //Table
  pageIndex = 1;
  pageSize = 10;
  value = 100;

  //Form
  addCoin: FormGroup;
  editCoin: FormGroup;

  //Search
  searchText = '';
  SearchTextChanged = new Subject<string>();
  isTableLoading = false;

  constructor(private paymentCoin: PaymentCoinService, private notify: NotifyService, private formBuilder: FormBuilder) {
    this.addCoin = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      index: new FormControl('', [Validators.required]),
      symbol: new FormControl('', [Validators.required]),
      status: new FormControl(false),
    })
    this.editCoin = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      index: new FormControl('', [Validators.required]),
      symbol: new FormControl('', [Validators.required]),
      status: new FormControl(false, [Validators.required]),
    })
  }

  get f() { return this.addCoin.controls; }
  get g() { return this.editCoin.controls }

  ngOnInit(): void {
    this.getPaymentCoin();
  }

  
  search() {
    this.SearchTextChanged.next(this.searchText);
  }


  getPaymentCoin() {
    this.isTableLoading = true;
    this.paymentCoin.listPaymentCoin().subscribe(res => {
      this.listOfData = res['data'];
      this.listCount = res['data'].length;
      let data  = this.listOfData;
      this.isTableLoading = false;
      this.SearchTextChanged.pipe(debounceTime(300)).subscribe((val) => {
        if (val == "" || val == null || val == undefined) {
          this.listOfData = [...data];
          this.isTableLoading = false;
        } else {
          let tempdata = data;
          this.listOfData = tempdata.filter((item) => {
            if (item.name) {
              if (item.name.toLowerCase().includes(val.toLowerCase()))
                return item.name.toLowerCase().includes(val.toLowerCase());
              this.isTableLoading = false;
            }
            if(item.symbol){
              if(item.symbol.toLowerCase().includes(val.toLowerCase()))
                return item.symbol.toLowerCase().includes(val.toLowerCase());
              this.isTableLoading = false;
            }
          });
        }
 
    })
    })
  }

  handleOk(): void {
    this.isVisible = true;

  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisible2 = false;
  }


  showModal(): void {
    this.isVisible = true;
  }

  showModal2(id): void {
    this.isVisible2 = true;
    this.listOfData.forEach(element => {
      if (element._id === id) {
        this.id=id;
        this.name = element.name;
        this.index = element.index;
        this.symbol = element.symbol;
        this.status = element.status;
      }
      this.editCoin = this.formBuilder.group({
        name: new FormControl(this.name, [Validators.required]),
        index: new FormControl(this.index, [Validators.required]),
        symbol: new FormControl(this.symbol, [Validators.required]),
        status: new FormControl(this.status, [Validators.required]),
      })
    })
  }

  payment = {
    add:false,
    edit:false
  }

  addCoinSubmit() {
    this.payment.add = true;
    let val = {
      index: this.addCoin.controls.index.value,
      symbol: this.addCoin.controls.symbol.value,
      name: this.addCoin.controls.name.value,
      status: this.addCoin.controls.status.value
    }
    this.paymentCoin.createPaymentCoin(val).subscribe(res => {
      if (res['success']) {
        this.getPaymentCoin();
        this.notify.success(res['message']);
        this.payment.add = false;
      }else{
        this.notify.error(res['message']);
        this.payment.add = false;
      }
    }, error => {
      this.notify.error(error.error.message);
      this.payment.add = false
    })
    this.isVisible = false;
    this.addCoin.reset();
  }

  editCoinStatus(id){
     this.paymentCoin.changeStatus(id).subscribe(res=>{
      if(res['success']){
        this.notify.success(res['message']);
        this.listOfData.forEach(i=>{
          if(i._id===id){
            i.status=!i.status;
          }
        })
      }
    },error => {
      this.notify.error(error.error.message);
    })
  }

  deleteCoin(id){
    this.paymentCoin.deletePaymentCoin(id).subscribe(res=>{
        if(res['success']){
          this.notify.success(res['message']);
          this.listOfData=this.listOfData.filter(item=>item._id != id)
        }
    },error => {
      this.notify.error(error.error.message);
    })
  }

  editCoinSubmit(){
    this.payment.edit = true;
    let val={
      id:this.id,
      index:this.editCoin.controls.index.value,
      symbol:this.editCoin.controls.symbol.value,
      name:this.editCoin.controls.name.value,
      status:this.editCoin.controls.status.value
    }
    this.paymentCoin.updatePaymentCoin(val).subscribe(res=>{
      if(res['success']){
        this.notify.success(res['message']);
        this.getPaymentCoin();
        this.payment.edit = false;
      }else{
        this.notify.error(res['message']);
        this.payment.edit = false;
      }
    },(error) => {
      this.notify.error(error.error.message);
      this.payment.edit = false
    })
    this.isVisible2 = false;
    this.editCoin.reset();
  }
}