import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SecurityService } from '../../services/security.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private security: SecurityService
  ) { }

  screenLockStatus = false;

  ngOnInit(): void {
    let val = localStorage.getItem('isPinLock') == 'true' ? true : false;
    if (val) {
      this.authenticationService.inactivityTime();
    }
    if (!this.authenticationService.isLoggednIn() && localStorage.getItem('sessionExpired') == 'true') {
      this.router.navigate(['/auth/lockscreen'])
    }
    if (!this.authenticationService.isLoggednIn() && localStorage.getItem('sessionExpired') != 'true') {
      this.router.navigate(["/auth"])
    }
    this.closeNav();
  }

  closeNav(){
    let val = document.getElementById('sideNav');
    val.className = "side-nav ant-layout-sider ant-layout-sider-dark ant-layout-sider-zero-width ant-layout-sider-collapsed";
     var x = window.matchMedia("(max-width: 991px)")
    if(x.matches){
      val.style.width = '0px';
      val.style.minWidth = '0px';
      val.style.maxWidth = '0px';
    }else{
      val.style.width = '200px';
      val.style.minWidth = '200px';
      val.style.maxWidth = '200px';
    }
  
  }


}
