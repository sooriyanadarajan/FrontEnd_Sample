import { Component, OnInit} from '@angular/core';
import { SubadminService } from '../../../services/subadmin.service';
import { NotifyService } from '../../../services/notification.service';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../../services/must-match.validator';
import { MarketPlace } from '../../../services/marketplace.service';
import {  Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
@Component({
  selector: 'app-subadmin',
  templateUrl: './subadmin.component.html',
  styleUrls: ['./subadmin.component.scss']
})
export class SubadminComponent {
 
subAdminForm:FormGroup;
isLoading = false;
pageSize = 10;
isEdit = false;
subAdminData:any;
isVisible = false;
isVisible2 = false;

constructor(
  private notify: NotifyService,
  private fb: FormBuilder,
  private subadminService:SubadminService,
  private marketPlace:MarketPlace
) {}

ngOnInit() {
 this.getSubAdminList();
 this.subAdminForm = this.fb.group({
  email:[null,[Validators.required,Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
  password:[null,[Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
  confirmpassword:[null,[Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
  role:['ADMIN',[Validators.required]]
},{
 validator: MustMatch('password', 'confirmpassword')
})
}


showModal() {
  this.isVisible = true;
  this.isEdit =  false;
  this.subAdminForm = this.fb.group({
    email:[null,[Validators.required,Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password:[null,[Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
    confirmpassword:[null,[Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
    role:['ADMIN',[Validators.required]]
  },{
   validator: MustMatch('password', 'confirmpassword')
 });
 console.log(this.subAdminForm)
}
showModal2(data) {
  this.isEdit = true;
  this.subAdminData = data; 
  this.isVisible = true;
  this.subAdminForm = this.fb.group({
    email:[null,[Validators.required,Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password:[null,[Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
    confirmpassword:[null,[Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
    role:['ADMIN',[Validators.required]]
  },{
   validator: MustMatch('password', 'confirmpassword')
 })
  this.subAdminForm.controls['email'].setValue(data.email);
  this.subAdminForm.controls['role'].setValue(data.role);
}

handleCancel(): void {
   this.isVisible = false;
  this.isVisible2 = false;
}

//List
subAdminList =[];
searchText = '';
SearchTextChanged = new Subject<string>();
isTableLoading = false;
search() {
  this.SearchTextChanged.next(this.searchText);
}

getSubAdminList(){ 
  this.subadminService.listSubAdmin().subscribe((res)=>{
    if(res['success']){
      this.subAdminList = res['data'];
      let data  = this.subAdminList;
      this.SearchTextChanged.pipe(debounceTime(300)).subscribe((val) => {
        if (val == "" || val == null || val == undefined) {
          this.subAdminList = [...data];
          this.isTableLoading = false;
        } else {
          let tempdata = data;
          this.subAdminList = tempdata.filter((item) => {
            if (item.email) {
              if (item.email.toLowerCase().includes(val.toLowerCase()))
                return item.email.toLowerCase().includes(val.toLowerCase());
              this.isTableLoading = false;
            }
          });
        }
 
    })
  }
  })
}

//Create
createSubAdmin(){
  this.isLoading = true
  let val = {
    email:this.subAdminForm.value.email,
    password:this.subAdminForm.value.password,
    role:this.subAdminForm.value.role
  }
  this.subadminService.createSubAdmin(val).subscribe((res)=>{
    if(res['success']){
      this.notify.success(res['message']);
      this.isLoading = false;
      this.getSubAdminList();
      this.subAdminForm.reset();
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

//update
updateSubAdmin(){
  this.isLoading = true;
  let val = {
    email:this.subAdminForm.value.email,
    password:this.subAdminForm.value.password,
    role:this.subAdminForm.value.role,
    id:this.subAdminData._id
  }
  Object.keys(val).forEach((key) => (val[key] == null || val[key] == 0) && delete val[key]);
  
  this.subadminService.updateSubAdmin(val).subscribe((res)=>{
    if(res['success']){
      this.notify.success(res['message']);
      this.isLoading = false;
      this.subAdminForm.reset();
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

statusChange(status,g2fa,data){
  if(g2fa == null || g2fa == true){
    let val = {
      status: status != null ? !status : null,
      tfa_active:g2fa != null ? !g2fa : null,
      id:data._id
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.subadminService.updateSubAdmin(val).subscribe((res)=>{
      if(res['success']){
        if(status != null){
          this.subAdminList.forEach(element => {
            if(element._id == data._id){
              element.status = !status;
            }
          });
        }
        if(g2fa != null){
          this.subAdminList.forEach(element => {
            if(element._id == data._id){
              element.tfa_active = !g2fa;
            }
          });
        }
        this.notify.success(res['message']);
  
    }else{
        this.notify.error(res['message']);
       }
    },(err)=>{
      this.notify.error(err.error.message);
    })
  }

}

//Manage Access
//Bot list
availableBotData = [];
botType;
userData;
getAvailableBot(val,data){
  this.botType = val;
  this.userData = data;
  this.marketPlace.availableBots(val).subscribe((res)=>{
    if(res['success']){
      this.availableBotData = res['data'];
      if(val == 'SPOT' ){
        this.availableBotData.forEach(item => {
          if(data.spot_signal.length > 0){
           let val =  data.spot_signal.find(element => element == item._id ? item.enabled = true:false)
          }else{
            this.availableBotData.forEach(element => {
              element.enabled = false;
            });
          }
        });
        
      }
      if(val == 'FX'){
        this.availableBotData.forEach(item => {
          if(data.fx_signal.length > 0){
            data.fx_signal.find(element => element == item._id ? item.enabled = true:false)
          }else{
            this.availableBotData.forEach(element => {
              element.enabled = false;
            });
          }
          
        });
      }
      this.isBotVisible = true;
      }
  })
}
isBotVisible = false;

handleBotCancel(){
  this.isBotVisible = false;
}

//add Signal Access
addSignal(data){
  let val ={
    type:this.botType,
    signal_id:data._id,
    user_id:this.userData._id
  }
  this.subadminService.addSignalAccess(val).subscribe((res)=>{
    if(res['success']){
      this.notify.success(res['message']);
      data.enabled = !data.enabled
    }else{
      this.notify.error(res['message'])
    }
  },(err)=>{
    this.notify.error(err.error.message)
  })
}

//Remove signal access
removeSignal(data){
  let val ={
    type:this.botType,
    signal_id:data._id,
    user_id:this.userData._id
  }
  this.subadminService.removeSignalAccess(val).subscribe((res)=>{
    if(res['success']){
      this.notify.success(res['message']);
      data.enabled = !data.enabled
    }else{
      this.notify.error(res['message'])
    }
  },(err)=>{
    this.notify.error(err.error.message)
  })
}
}
