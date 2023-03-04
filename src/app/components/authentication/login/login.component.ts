import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { NotifyService } from '../../../services/notification.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isVisible3 = false;
  isLoginLoad = false;
  isLoading = false;

showModal(): void {
  this.isVisible3 = true;
}


handleOk(): void {
  this.isLoginLoad = true;
  let val={
    email:this.signinForm.value.email,
    otp:this.g2FaForm.controls.otp.value
  }
  this.authenticationService.gfVerify(val).subscribe(res=>{
      if(res['success']){ 
        localStorage.setItem('isLoggedIn','true');
        localStorage.setItem('role',res['data'].role);
        localStorage.setItem('isPinLock',res['data'].enablePinLock);
        localStorage.setItem('pinTime',res['data'].pinLockTime)
        if(localStorage.getItem('role') == 'ADMIN'){
          this.router.navigate(['']);
          this.notify.success("Login Successfull");
          this.isLoginLoad = false;
        }else{
          this.router.navigate(['/botsignal']);
          this.notify.success("Login Successfull");
          this.isLoginLoad = false;
        }
       }
  },error=>{
    this.notify.error(error.err.message);
    this.isLoginLoad = false;
  })
  this.isVisible3 = false;
}

handleCancel(): void {
  this.isVisible3 = false;
}

  constructor(
    private authenticationService:AuthenticationService,
    private notify:NotifyService,
    private fb: FormBuilder,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.signinForm = this.fb.group({
     email: [null, [Validators.required]],
     password:[null,[Validators.required]],
     remember:[false]
    });

    this.g2FaForm=this.fb.group({
      otp:[null,Validators.required]
    })

      if (this.authenticationService.isLoggednIn()) {
       if(localStorage.getItem('role') == 'SIGNALADMIN' ){
        this.router.navigate(['/botsignal'])
       }else{
        this.router.navigate(["/"]);
       }
			return;
		}
   

  }

  //Login
  signinForm: FormGroup;
  g2FaForm:FormGroup;
  login(){
    this.isLoading = true;
    let val = {
      email:this.signinForm.value.email,
      password:this.signinForm.value.password
    }
    this.authenticationService.login(val).subscribe((res)=>{
      if(res['success']){
        this.notify.success(res['message']);
          if(res.g2fa){
          this.isVisible3=true;
          this.isLoading = false;
        }
      else{
        localStorage.setItem('isLoggedIn','true');
        localStorage.setItem('role',res['data'].role);
        localStorage.setItem('isPinLock',res['data'].enablePinLock);
        localStorage.setItem('pinTime',res['data'].pinLockTime)
         if(res['data'].role == 'SIGNALADMIN'){
          this.isLoading = false;
          this.router.navigate(['/botsignal'])
        }else{
          this.isLoading = false;
          this.router.navigate(['']);
        }
       }
      }
    },(err)=>{
      this.isLoading = false;
         this.notify.error(err.error.message)
     })
  }
}

