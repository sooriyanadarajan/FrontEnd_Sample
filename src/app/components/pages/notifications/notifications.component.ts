import { Component } from '@angular/core';
import { AdminnotificationService } from '../../../services/adminnotification.service';
import { NotifyService } from '../../../services/notification.service';
import {
  FormBuilder,
  FormGroup,
  Validators, FormControl
} from '@angular/forms';
import { BotsignalService } from '../../../services/botsignal.service';
import { UserService } from '../../../services/user.service';
import { FututreService } from '../../../services/fututre.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  botType = 'SPOT'
  constructor(
    public notify: NotifyService,
    private adminNotificationService:AdminnotificationService,
    private fb:FormBuilder,
    private botSignalService:BotsignalService,
    private userService:UserService,
    private futureService:FututreService
    ) {}

  checked = true;
  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }
  
  
  handleOk(): void {
      this.isVisible = false;
  }
  
  handleCancel(): void {
    this.isVisible = false;
  }

  ngOnInit() {
    this.notifyForm = this.fb.group({
      type: [null, [Validators.required]],
      notifytype: [null, [Validators.required]],
      // userlist: [null, [Validators.required]],
      signallist:[null,[Validators.required]],
      title:[null,[Validators.required]],
      message:[null,[Validators.required]]
    });
    this.userlistForm = this.fb.group({});
    this.getNotification(this.page,this.limit,this.type)
  } 

  //List Notification
  isTableLoading = false;
  notificationList = [];
  totalNotification = 0;
  page = 1;
  limit = 10
  getNotification(page,limit,type){
    this.isTableLoading = true;
    this.notificationList = [];
    let val = {
      page:page,
      limit:limit,
      type:type
    }
    this.adminNotificationService.listNotification(val).subscribe((res)=>{
      if(res['success']){
        this.notificationList = res['data']['list'];
        this.totalNotification = res['data']['count'];
        this.isTableLoading = false;
      }
    })
  }

  //Delete Notification
  deleteNotification(id){
    this.adminNotificationService.deleteNotification(id).subscribe((res)=>{
      if(res['success']){
        this.notify.success(res['message']);
        this.notificationList = this.notificationList.filter(t=>(t._id != id))
      }else{
        this.notify.error(res['message'])
      }
    },(err)=>{
      this.notify.error(err.error.nessage)
    })
  }

  //send Notification
  notifyForm:FormGroup;
  userlist = [];
  isLoading = false;
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
          this.getNotification(1, this.limit,this.notifyForm.value.type)
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
      this.notifyForm = this.fb.group({
        type: [type, [Validators.required]],
        notifytype: [null, [Validators.required]],
        title:[null,[Validators.required]],
        message:[null,[Validators.required]]
      });
    }
    if(type == 'CUSTOM-USER'){
      this.notifyForm = this.fb.group({
        type: [type, [Validators.required]],
        notifytype: [null, [Validators.required]],
        // userlist: [null, [Validators.required]],
        title:[null,[Validators.required]],
        message:[null,[Validators.required]]
      });
      this.userlistOfControl = [];
      this.addUserControl();
    }
    if(type == 'SUBSCRIBER'){
      this.notifyForm = this.fb.group({
        type: [type, [Validators.required]],
        notifytype: [null, [Validators.required]],
         title:[null,[Validators.required]],
        message:[null,[Validators.required]]
      });
    }
    if(type == 'BOT-SIGNAL'){
      this.getBotList(this.botType);
       this.notifyForm = this.fb.group({
        type: [type, [Validators.required]],
        notifytype: [null, [Validators.required]],
        signallist:[null,[Validators.required]],
        title:[null,[Validators.required]],
        message:[null,[Validators.required]]
      });
    }
  }

  //Get bot list
  botlistData = [];
  getBotList(type){
    this.futureService.availableBots(type).subscribe((res)=>{
      if(res['success']){
        this.botlistData = res['data'];
      }
    })
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
 
  
  removeField(i: { id: number; controlInstance: string;value:number }, e: MouseEvent,id): void {
    e.preventDefault();
    if (this.userlistOfControl.length > 1) {
        const index = this.userlistOfControl.indexOf(id);
        this.userlistOfControl.splice(index, 1);
        this.notifyForm.removeControl(i.controlInstance);
    }
}

  userData:any;
  isVisibleMiddle = false;
  showUserList(data){
   this.userData = data;
    this.isVisibleMiddle = true;
  }

  handleCancelMiddle(){
    this.isVisibleMiddle = false;
  }
}
