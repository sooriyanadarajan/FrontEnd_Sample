import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { NotifyService } from '../../../../services/notification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  userId;
  pageIndex = 1;
  pageSize = 8;

  constructor(
    private userService:UserService,
    private notify:NotifyService,
    private router:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.params.subscribe((routeParams) => {
      this.userId = routeParams.id;
    });
    this.getNotification(this.pageIndex,this.pageSize)
  }

  //Notication list
  notificationList:any = [];
  notificationCount = 0;

  getNotification(page,limit){
    this.userService.allNotification(this.userId,page,limit).subscribe((res)=>{
      if(res['success']){
        this.notificationList = res['data'];
        this.notificationCount = res['count'];
      }
    })
  }

  //Delete notification

  clearAllNotification(){
    this.userService.deleteNotification(this.userId).subscribe((res)=>{
      if(res['success']){
        this.notify.success(res['message']);
        this.notificationList = [];
        this.notificationCount = 0;
      }else{
        this.notify.error(res['message'])
      }
    },(err)=>{
      this.notify.error(err.error.message)
    })
  }
}
