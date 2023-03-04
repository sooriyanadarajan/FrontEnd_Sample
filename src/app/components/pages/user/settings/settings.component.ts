import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { NotifyService } from '../../../../services/notification.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MustMatch } from '../../../../services/must-match.validator';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isVisible = false;

  userId;
  pageIndex = 1;
  pageSize = 10;

  constructor(
    private userService:UserService,
    private notify:NotifyService,
    private fb: FormBuilder,
    private router:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.params.subscribe((routeParams) => {
      this.userId = routeParams.id;
    });
    this.viewUserDetail(this.userId)
    this.getActivityLog(this.pageSize, this.pageIndex);
    this.updateUserForm = this.fb.group({
      // oldpassword:[null,[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
      newpassword:[null,[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
      confirmpassword:[null,[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
    },{
      validator: MustMatch('newpassword', 'confirmpassword')
    });
  }

     //View user
     userDetailData:any;

     viewUserDetail(id){
       this.userService.viewUser(id).subscribe((res)=>{
         if(res['success']){
           this.userDetailData = res['data']['user'];
           this.userVerify = this.userDetailData.isVerified;
           this.emailVerify = this.userDetailData.enableEmailVerification;
           this.enable2FA = this.userDetailData.enable2FA;
         }
       })
     }
  
  //Edit user
  userVerify = false;
  emailVerify = false;
  enable2FA = false;
  updateUserForm:FormGroup;
  isLoading = false;

  editUser(val){
    const updates = Object.keys(val)
     this.userService.updateUser(this.userId,val).subscribe((res)=>{
      if(res['success']){
        updates.forEach(element => {
          this.userDetailData[element] = val.element;
         });
        this.emailVerify = this.userDetailData.enableEmailVerification;
        this.enable2FA = this.userDetailData.enable2FA;
        this.notify.success(res['message']);
        this.handleCancel();
      }else{
        this.notify.error(res['message']);
      }
    },(err)=>{
      this.notify.error(err.error.message)
    })
  }


  //Get activity log
  activityLogList:any = [];
  activityLogCount = 0;

  getActivityLog(limit, page){
    this.userService.activityLog(this.userId,limit,page).subscribe((res)=>{
      if(res['success']){
        this.activityLogList = res['data']['wantedData'];
        this.activityLogCount = res['data']['length']
      }
    })
  }

  //Delete Activity Log
  deleteAllActivityLog(){
    this.userService.deleteActivityLog(this.userId).subscribe((res)=>{
      if(res['message']){
        this.activityLogList = [];
        this.notify.success(res['message'])
      }else{
        this.notify.error(res['message'])
      }
    },(err)=>{
      this.notify.error(err.error.message)
    })
  }

   //Get authorized log
   authorizedDeviceList:any = [];
   authorizedDeviceCount = 0;
 
   getAuthorizedDevice(limit, page){
     this.userService.authorizedDevice(this.userId,limit,page).subscribe((res)=>{
       if(res['success']){
         this.authorizedDeviceList = res['data'];
         this.authorizedDeviceCount = res['count'];
       }
     })
   }
 
   removeDevice(id){
     this.userService.removeDevice(id).subscribe((res)=>{
       if(res['success']){
         this.authorizedDeviceList = this.authorizedDeviceList.filter(t => t._id != id)
        this.notify.success(res['message']);
       }else{
         this.notify.error(res['message'])
       }
     },(err)=>{
       this.notify.error(err.error.message)
     })
   }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
     this.isVisible = false;
  }


  //Update authorized device
  updateDeviceStatus(data,val){
     this.userService.updateDeviceStatus(data).subscribe((res)=>{
      if(res['success']){
        this.notify.success(res['message']);
        val.verified = true;
      }else{
        this.notify.error(res['message'])
      }
    },(err)=>{
      this.notify.error(err.error.message)
    })
  }
}
