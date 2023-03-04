import { Component, OnInit } from '@angular/core';
import { getISOWeek } from 'date-fns';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { NotifyService } from '../../../services/notification.service';
import { CoupanService } from '../../../services/coupan.service';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { FututreService } from '../../../services/fututre.service';
import { AdminnotificationService } from '../../../services/adminnotification.service';
@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {


  //Edit Active Coupan
  public name;
  public description;
  public discount;
  public limit;
  public expiry;
  public _id;

  addCoupan: FormGroup;
  editCoupan: FormGroup;
  notifyForm:FormGroup
  date = null;
  isEnglish = false;

  //Table
  pageIndex = 1;
  pageSize = 10;

  onChange(result: Date): void {

  }

  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result));
  }

  changeLanguage(): void {
    this.i18n.setLocale(this.isEnglish ? zh_CN : en_US);
    this.isEnglish = !this.isEnglish;
  }
  inputValue: string = 'ijfh846y438ufhuie';

  value = 100;
  listOfData = [];
  listCount;

  isVisible = false;
  isVisible2 = false;
  isVisible3 = false;

  showModal(): void {
    this.isVisible = true;
  }
  showModal2(id): void {
    this.isVisible2 = true;

    this.listOfData.forEach(element => {
      if (element._id === id) {
        this.name = element.coupon;
        this.description = element.description;
        this.discount = element.discount;
        this.limit = element.limit;
        this.expiry = element.expiry;
        this._id = element._id;
      }
      this.editCoupan = this.formBuilder.group({
        name: new FormControl(this.name, [Validators.required]),
        description: new FormControl(this.description, [Validators.required]),
        discount: new FormControl(this.discount, [Validators.required]),
        limit: new FormControl(this.limit, [Validators.required, Validators.min(1)]),
        expiry: new FormControl(this.expiry, [Validators.required])
      })

    })
  }
  showModal3(): void {
    this.isVisible3 = true;
  }


  handleOk(): void {
    this.isVisible = false;
    this.isVisible2 = false;
    this.isVisible3 = false;
    this.couponSendVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisible2 = false;
    this.isVisible3 = false;
    this.couponSendVisible = false;
  }


  constructor(private i18n: NzI18nService, private coupan: CoupanService, private notify: NotifyService, private formBuilder: FormBuilder,
    private futureService:FututreService, private adminNotificationService:AdminnotificationService) {
    this.addCoupan = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      discount: new FormControl('', [Validators.required, Validators.pattern("^[1-9][0-9]?$|^100$")]),
      limit: new FormControl('', [Validators.required,Validators.min(1)]),
      expiry: new FormControl('', [Validators.required])
    })

    this.editCoupan = this.formBuilder.group({
      name: new FormControl(this.name, [Validators.required, Validators.maxLength(15)]),
      description: new FormControl(this.description, [Validators.required, Validators.maxLength(200)]),
      discount: new FormControl(this.discount, [Validators.required, Validators.pattern("^[1-9][0-9]?$|^100$")]),
      limit: new FormControl(this.limit, [Validators.required,Validators.min(1)]),
      expiry: new FormControl(this.expiry, [Validators.required])
    });

    
    
  }

  ngOnInit(): void {
    this.getCoupanList(this.pageIndex, this.pageSize);
    this.notifyForm = this.formBuilder.group({
      type: [null, [Validators.required]],
      notifytype: [null, [Validators.required]],
      // userlist: [null, [Validators.required]],
      signallist:[null,[Validators.required]],
      title:[this.name,[Validators.required]],
      message:[this.description,[Validators.required]]
    });
   
  }

  change(e) {
    this.getCoupanList(1, parseInt(e));
    this.pageSize = parseInt(e);
  }
  get f() { return this.addCoupan.controls; }
  get EditCouponForm() {
    return this.editCoupan.controls;
  }

  isAddCouponLoad = false;
  coupanAdd() {
    this.isAddCouponLoad = true;
    let val = {
      coupon: this.f.name.value,
      description: this.f.description.value,
      discount: this.f.discount.value,
      limit: this.f.limit.value,
      expiry: this.f.expiry.value
    }
    this.coupan.createCoupan(val).subscribe(res=>{
      if(res['success']){
        this.notify.success(res['message']);
        this.isAddCouponLoad = false;
        this.getCoupanList(1,this.pageSize)  
      }else{
        this.notify.error(res['message'])
        this.isAddCouponLoad = false;
      }
      },(error)=>{
      this.notify.error(error.error.message);
      this.isAddCouponLoad = false
    });
    this.addCoupan.reset();
    this.isVisible = false;
  }

  searchTxt:any = ''
  serarchCoupon(){
    if(this.searchTxt == '' || this.searchTxt == null || this.searchTxt == undefined){
      this.getCoupanList(1, this.pageSize)
    }
  }
  isTableLoading = false;
  getCoupanList(index, size) {
    this.isTableLoading = true;
    let val = {
      page: index,
      limit: size,
      key:this.searchTxt == ''?null:this.searchTxt
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.coupan.listCoupan(val).subscribe((res) => {
      if (res['success']) {
        this.listOfData = res['data']['list'];
        this.listCount = res['data']['count'];
        this.isTableLoading =false
      }
    },error=>{
      this.notify.error(error.error.message);
      this.isTableLoading = false;
    })
  }

  isEditCouponLoad = false;
  editCouponForm() {
    this.isEditCouponLoad = true;
    let val = {
      coupon: this.EditCouponForm.name.value,
      description: this.EditCouponForm.description.value,
      discount: this.EditCouponForm.discount.value,
      limit: this.EditCouponForm.limit.value,
      expiry: this.EditCouponForm.expiry.value,
      id: this._id
    }
    this.coupan.updateCoupan(val).subscribe(res => {
      if(res['success']){
        this.getCoupanList(1, this.pageSize);
        this.notify.success(res['message']);
        this.isEditCouponLoad = false;
        this.isVisible2 = false;

      }else{
        this.notify.error(res['message']);
        this.isEditCouponLoad = false;
      }
       
    },error=>{
      this.notify.error(error.error.message);
      this.isEditCouponLoad = false;
    })
    }

  editCouponStatus(data) {
    this.coupan.changeCoupanStatus(data._id).subscribe(res => {
      if(res['success']){
        data.status = !data.status;
        this.notify.success(res['message'])  
      }else{
        this.notify.error(res['message'])
      }
    },(err)=>{
      this.notify.error(err.error.message);
    })
  }

  deleteCoupan(id){
    this.coupan.deleteCoupan(id).subscribe(res=>{
      if(res['success']){
        this.listOfData = this.listOfData.filter(t => t._id != id);
        this.listCount = this.listCount - 1;
        this.notify.success(res['message']);
      }else{
        this.notify.error(res['message'])
      }
    
     },(err)=>{
      this.notify.error(err.error.message);
    })
  }

  today = new Date();
  timeDefaultValue = setHours(new Date(), 0);

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

  //Send Coupon
  couponSendVisible = false;
  isLoading=false;
  couponData:any;

 
  showSendCouponModal(data): void {
    this.couponSendVisible = true;
    this.couponData = data;
    this.name = this.couponData.coupon;
    this.description = this.couponData.description;
  }

  userlistOfControl: Array<{
    id: number; controlInstance: string; value: string;
  }> = [];
  userlistForm: FormGroup;
  addUserControl(){
      const id = this.userlistOfControl.length > 0 ? this.userlistOfControl[this.userlistOfControl.length - 1].id + 1 : 0;
        const control = {
          id,
          controlInstance: `user${id}`,
          value: '',
        };
        const index = this.userlistOfControl.push(control);
        this.notifyForm.addControl(
          this.userlistOfControl[index - 1].controlInstance,
          new FormControl(null, [Validators.required])
        );
  }
 
  
  sendNotificaton(){
    this.isLoading = true;
    let  val;
    let data  = [];
    if(this.notifyForm.value.type == 'CUSTOM-USER'){
      this.userlistOfControl.forEach(element => {
         if(this.notifyForm.value[element.controlInstance] == "" || this.notifyForm.value[element.controlInstance] == null){
         
        }else{
          data.push(this.notifyForm.value[element.controlInstance])
        }
      });
      val = {
        to:this.notifyForm.value.type,
        type:this.notifyForm.value.notifytype,
        title:this.notifyForm.value.title,
        user_list:data,
        message:this.notifyForm.value.message
      }
    }else{
      val = {
        to:this.notifyForm.value.type,
        type:this.notifyForm.value.notifytype,
        bot_id:this.notifyForm.value.type == 'BOT-SIGNAL'?this.notifyForm.value.signallist : null,
        title:this.notifyForm.value.title,
        message:this.notifyForm.value.message
      }
    }
    if(this.notifyForm.value.type == 'CUSTOM-USER' && data.length <= 0){
      this.notify.error('Enter user Email')
    }else{
      this.adminNotificationService.sendNotification(val).subscribe((res)=>{
        if(res['success']){
          this.notify.success(res['message']);
          this.notifyForm.reset();
          this.isLoading = false;
           this.handleCancel();
        }else{
          this.notify.error(res['message']);
          this.isLoading = false;
        }
      },(err)=>{
        this.notify.error(err.error.message);
        this.isLoading = false;
      })
    }
   
 
  }

  //type change validation
  type = 'ALL'
  typechange(type){
    if(type == 'ALL'){
      this.notifyForm = this.formBuilder.group({
        type: [type, [Validators.required]],
        notifytype: [null, [Validators.required]],
        title:[this.name,[Validators.required]],
        message:[this.description,[Validators.required]]
      });
    }
    if(type == 'CUSTOM-USER'){
      this.notifyForm = this.formBuilder.group({
        type: [type, [Validators.required]],
        notifytype: [null, [Validators.required]],
        // userlist: [null, [Validators.required]],
        title:[this.name,[Validators.required]],
        message:[this.description,[Validators.required]]
      });
      this.userlistOfControl = [];
      this.addUserControl();
    }
    if(type == 'SUBSCRIBER'){
      this.notifyForm = this.formBuilder.group({
        type: [type, [Validators.required]],
        notifytype: [null, [Validators.required]],
         title:[this.name,[Validators.required]],
        message:[this.description,[Validators.required]]
      });
    }
    if(type == 'BOT-SIGNAL'){
      this.getBotList(this.botType);
       this.notifyForm = this.formBuilder.group({
        type: [type, [Validators.required]],
        notifytype: [null, [Validators.required]],
        signallist:[null,[Validators.required]],
        title:[this.name,[Validators.required]],
        message:[this.description,[Validators.required]]
      });
    }
    console.log(this.notifyForm)
  }

  //Get bot list
  botlistData = [];
  botType = 'SPOT'
  getBotList(type){
    this.futureService.availableBots(type).subscribe((res)=>{
      if(res['success']){
        this.botlistData = res['data'];
      }
    })
  }

}
