import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { NotifyService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
role:any;

@Output() valueChange = new EventEmitter();

  constructor(
    private authenticationSerive:AuthenticationService,
    private message:NotifyService,
    private route:Router
  
  ) { 
    this.role = localStorage.getItem('role')
  }

  ngOnInit(): void {
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
    this.valueChange.emit();
  }
  isLoading = false;
  logOut(){
    this.isLoading = true;
    this.authenticationSerive.logout().subscribe((res)=>{
      if(res['success']){
        localStorage.clear();
        this.message.success(res['message']);
        this.route.navigate(['/auth']);
        this.isLoading = false;
      }else{
        this.message.error(res['message']);
        this.isLoading = false;
      }
    },(err)=>{
      this.message.error(err.error.message);
      this.isLoading = false;
    })
  }
}
