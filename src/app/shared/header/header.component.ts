import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { NotifyService } from '../../services/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
role;
  constructor(
    private authenticationSerive:AuthenticationService,
    private message:NotifyService,
    private route:Router
    ) { 
      this.role = localStorage.getItem('role')
     }

  ngOnInit(): void {
  }

  logOut(){
    this.authenticationSerive.logout().subscribe((res)=>{
      if(res['success']){
        localStorage.clear();
        this.message.success(res['message']);
        this.route.navigate(['/auth'])
      }else{
        this.message.error(res['message'])
      }
    },(err)=>{
      this.message.error(err.error.message)
    })
  }

  sessionLock(){
    location.href = '/auth/lockscreen';
    localStorage.setItem('sessionExpired','true')
    localStorage.setItem('isLoggedIn', '');
  }

}
