import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NotifyService } from '../../../services/notification.service';
import { MustMatch } from '../../../services/must-match.validator';
import { SocketService } from '../../../services/socket.service';
import { DashboardService } from '../../../services/dashboard.service'
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  //Table
  pageIndex = 1;
  pageSize = 10;

  constructor(private user:UserService,
    private fb: FormBuilder,
    private socket:SocketService,
    private notify:NotifyService,
    private dashboardService:DashboardService
    ) { }

  ngOnInit(): void {
    this.getAllUser(this.pageIndex,this.pageSize);
    this.getUser();
    this.getDashboardPayment();
    // localStorage.setItem('userId','');
    this.createUserForm = this.fb.group({
      username:[null,[Validators.required, Validators.pattern('^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$')]],
      email:[null,[Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password:[null,[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
      confirmpassword:[null,[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
    },{
      validator: MustMatch('password', 'confirmpassword')
    });
  } 

  //User List
  isTableLoading = false;
  userList=[];
  userTotalCount = 0;

  getAllUser(index,size){
    this.isTableLoading = true;
   let val = {
      page:index,
      limit:size,
      key:this.searchTxt == ''?null:this.searchTxt
    }
    Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
    this.user.getAllUser(val).subscribe((res)=>{
      if(res['success']){
        this.userTotalCount = res['data']['count'];
        this.userList = res['data']['list'];
        this.isTableLoading = false;
       }
    })
  }

  searchTxt:any = ''
  serarchUser(){
    if(this.searchTxt == '' || this.searchTxt == null || this.searchTxt == undefined){
      this.getAllUser(1, this.pageSize)
    }
  }
  //user-add
  isVisible = false;
  createUserForm:FormGroup;
  isLoading = false;
  isEdit = false;
  EditData:any;

  showModal(): void {
    this.isEdit = false;
    this.isVisible = true;
    this.createUserForm.reset();
    this.createUserForm = this.fb.group({
      username:[null,[Validators.required, Validators.pattern('^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$')]],
      email:[null,[Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password:[null,[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
      confirmpassword:[null,[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
    },{
      validator: MustMatch('password', 'confirmpassword')
    });
  }

  editUserModel(data){
    this.isEdit = true;
    this.EditData = data;
    this.createUserForm = this.fb.group({
      username:[null,[Validators.required, Validators.pattern('^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$')]],
      email:[null,[Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password:[null,[ Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
      confirmpassword:[null,[Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
    },{
      validator: MustMatch('password', 'confirmpassword')
    });
    this.isVisible= true;
    this.createUserForm.controls['username'].setValue(data.name)
    this.createUserForm.controls['email'].setValue(data.email)
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  userCreate(){
    this.isLoading = true;
    let val = {
      name:this.createUserForm.value.username,
      email:this.createUserForm.value.email,
      password:this.createUserForm.value.password,
      confirmPassword:this.createUserForm.value.confirmpassword
    }
    this.user.createUser(val).subscribe((res)=>{
      if(res['success']){
        this.notify.success(res['message']);
        this.getAllUser(1, this.pageSize)
        this.isLoading = false;
        this.isVisible = false;
      }else{
        this.notify.error(res['message']);
        this.isLoading =  false;
      }
    },(err)=>{
      this.isLoading = false
      this.notify.error(err.error.message)
    })
  }

  viewUser(id,name){
    // localStorage.setItem('userId',id);
    // localStorage.setItem('userName',name);
    // this.socket.connect(id);
  }

  //updateUser
  
  editUser(data,val,type){
      this.isLoading = true;
    if((type == '2fa' && data.enable2FA == false) || (type == 'emailVerify' && data.enable2FA == false) || (type == 'isverify' && data.enable2FA == true)){
      this.notify.error('Cannot change the status')
    }else{
      Object.keys(val).forEach((key) => (val[key] == null ) && delete val[key]);
      this.user.updateUser(data._id,val).subscribe((res)=>{
       if(res['success']){
         this.notify.success(res['message']);
         this.getAllUser(1, this.pageSize)
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

   //count API's

   userData:any;
   getUser(){
     this.dashboardService.getDashboardUser().subscribe((res)=>{
       if(res['success']){
         this.userData = res['data'];
       }
     })
   }
   dashboardPayment:any;
   getDashboardPayment(){
     this.dashboardService.getDashboardPayment().subscribe((res)=>{
       if(res['success']){
         this.dashboardPayment = res['data'];
       }
     })
   }

   //Status change
   statusChange(data){
    this.isLoading = true;
    let val = {
      status:!data.status
    }
    this.user.updateUser(data._id,val).subscribe((res)=>{
     if(res['success']){
       this.notify.success(res['message']);
       data.status = !data.status;
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
