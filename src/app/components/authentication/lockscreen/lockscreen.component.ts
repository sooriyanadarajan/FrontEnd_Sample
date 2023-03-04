import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { SecurityService } from '../../../services/security.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../../services/notification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})
export class LockscreenComponent implements OnInit {

  pinLockForm: FormGroup;
  screenLockStatus = false;

  constructor(
    private security:SecurityService,
    private formBuilder: FormBuilder,
    private notify:NotifyService,
    private route:Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.pinLockForm = this.formBuilder.group({
      pinCode: new FormControl('', [Validators.required, Validators.minLength(4),Validators.maxLength(6),Validators.pattern('^[0-9]{4,6}$')])
    })
    this.security.getScreenLock().subscribe((res)=>{
      if(res['success']){
        this.screenLockStatus = res['data']['screenLock'];
        // let val = this.screenLockStatus == true?'true':'false'
        // localStorage.setItem('sessionExpired',val);
        }
    })
    
   }

   isBtnLoad = false;
  verifyAdmin(){
    this.isBtnLoad = true;
    let val = {
      pinLockPassword: (this.code).toString()
    }
    if(val.pinLockPassword.length == 4)
    {
      this.security.verifyPin(val).subscribe((res: any) => {
        if (res['success']) {
           localStorage.setItem('isLoggedIn','true');
          localStorage.setItem('sessionExpired','false');
          this.notify.success(res['message']);
           this.isBtnLoad = false;
           this.location.back();
        } else {
          this.notify.error(res['message']);
          this.isBtnLoad = false;
        }
      }, error => {
        this.notify.error(error.error.message);
        this.isBtnLoad = false;
      })
    }
  }

   // this called every time when user changed the code
    i = 0;
   onCodeChanged(code: string) {
    this.code = code;
   
 
  }
  code:string='';
  // this called only if user entered full code
  onCodeCompleted(code: string) {
  this.code = code;
    this.verifyAdmin();
  }
}
