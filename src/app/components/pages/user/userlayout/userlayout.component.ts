import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
@Component({
  selector: 'app-userlayout',
  templateUrl: './userlayout.component.html',
  styleUrls: ['./userlayout.component.scss']
})
export class UserlayoutComponent implements OnInit {

  pathName;

  constructor(private router:ActivatedRoute,private userService:UserService) { 
    // this.username = localStorage.getItem('userName');
    this.router.params.subscribe((routeParams) => {
     this.userId = routeParams.id;
    });
  }

  username:any;
  userId:any;
  userData:any;

  ngOnInit(): void {
   this.getUser();
   let path = window.location.pathname.split('/');
   this.pathName =  path[3]
   }

  getUser(){
    this.userService.viewUser(this.userId).subscribe((res)=>{
      if(res['success']){
        this.userData = res['data'];
        this.username = this.userData['user'].name
      }
    })
  }


}
