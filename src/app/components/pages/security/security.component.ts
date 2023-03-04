import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '../../../services/security.service';
import { NotifyService } from '../../../services/notification.service';
import { MustMatch } from '../../../services/must-match.validator';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  //Idle time
  isIdle = localStorage.getItem('isPinLock') == 'true' ? true : false;


  securityForm: FormGroup;
  google2FactorForm: FormGroup;
  pinLockForm: FormGroup;

  inputValue: string = 'ijfh846y438ufhuie';

  //G2F
  public img;
  public secret;
  public g2fStatus: boolean;
  //Table
  pageIndex = 1;
  pageSize = 10;

  listOfData = [];
  listCount = 0;

  isVisible = false;
  g2faisVisible = false;
  g2faisVisible1 = false;
  public copied = 'Copied';
  
  public key: any;

  constructor(private formBuilder: FormBuilder, 
    private notify: NotifyService, 
    private security: SecurityService, 
    private router: Router,
    private authenticationService:AuthenticationService
    ) { }

  ngOnInit(): void {
    this.securityForm = this.formBuilder.group({
      oldPassword: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@~)`#^($!%*?&])[A-Za-z\d$@$~`)!%*#(?&].{8,}"), Validators.maxLength(15)]),
      newPassword: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@~`^($!%*#?)&])[A-Za-z\d$@$!#~`)%^(*?&].{8,}"), Validators.maxLength(15)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@~`^)$#!%*(?&])[A-Za-z\d$@$!~`^#%*?&].{8,}"), Validators.maxLength(15)])
    },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      })

    this.google2FactorForm = this.formBuilder.group({
      input2Factor: new FormControl('', [Validators.required, Validators.minLength(6)])
    })

    this.pinLockForm = this.formBuilder.group({
      pinCode: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(6),Validators.pattern('^[0-9]{4,6}$')])
    })

    // this.security.getG2F().subscribe((res: any) => {
    //   this.secret = res['data'].secret;
    //   this.img = res['data'].img;
    // }, error => {
    //   this.notify.error(error.error.message);
    // })

    this.getActiveLog(this.pageIndex, this.pageSize);

    this.security.get2FAStatus().subscribe((res)=>{
      if(res['success']){
        this.g2fStatus = res['data']['tfa_active']
      }
    })
  }

  isTableLoading = false;
  getActiveLog(index, size) {
    this.isTableLoading = true;
    let val = {
      page: index,
      limit: size
    }
    this.security.getActiveLog(val).subscribe((res) => {
      if (res['success']) {
        this.listOfData = res['data']['list'];
        this.listCount = res['data']['count'];
        this.isTableLoading = false;
      }
    }, error => {
      this.notify.error(error.error.message);
    })
  }

  change(e) {
    this.getActiveLog(1, parseInt(e));
    this.pageSize = parseInt(e);
  }

  get f() { return this.securityForm.controls }
  get googleAuthentication() {
    return this.google2FactorForm.controls;
  }

  changePasswordForm() {
    if (this.f.oldPassword.value !== this.f.newPassword.value) {
      let val = {
        oldPassword: this.f.oldPassword.value,
        password: this.f.newPassword.value
      }
      this.security.changePassowrd(val).subscribe((res: any) => {
        if (res['success']) {
          this.notify.success("Password Updated Successfull");
          this.router.navigate(['/auth/login']);
        }
      }, error => {
        this.notify.error(error.error.message);
      })
    } else {
      this.notify.error("Old Password And New Password Should Be Different");
    }
    this.isVisible = false;
  }

  googleAuthForm() {

    let val = {
      otp: this.googleAuthentication.input2Factor.value
    }

    this.security.changeG2F(val).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.g2fStatus = !this.g2fStatus;
      }
    }, error => {
      this.notify.error(error.error.message);
    })
    this.g2faisVisible1 = false;
    this.g2faisVisible = false;
  }


  showModal(): void {
    this.isVisible = true;
  }

  showG2faModal1() {
    this.g2faisVisible1 = true;
    // this.security.getG2F().subscribe((res: any) => {
    //   this.secret = res['data'].secret;
    //   this.img = res['data'].img;
    // }, error => {
    //   this.notify.error(error.error.message);
    // })

  }

  showG2faModal() {
    this.g2faisVisible = true;
    this.security.getG2F().subscribe((res: any) => {
      this.secret = res['data'].secret;
      this.img = res['data'].img;
    }, error => {
      this.notify.error(error.error.message);
    })

  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.g2faisVisible = false;
    this.g2faisVisible1 = false;
    this.securityForm.reset();
    this.google2FactorForm.reset();
    this.isPinLockVisible = false;
  }


  handleCancel1(): void {
    this.isVisible = false;
    this.g2faisVisible = false;
    this.isPinLockVisible = false;
  }

  disableTooltip() {
    this.copied = 'Copied'
    setTimeout(() => {
      this.copied = ''
    }, 1000);
  }

  isPinLockVisible = false;
  showPinLock() {
    this.isPinLockVisible = true;
  }

  updatePinLock() {
    let val = {
      enablePinLock: true,
      pinLockPassword: this.code
    }
    this.security.updatePin(val).subscribe((res: any) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.isIdle = !this.isIdle;
        let val = this.isIdle == true ? 'true' : 'false';
        localStorage.setItem('isPinLock', val);
        if (this.isIdle) {
          this.authenticationService.inactivityTime();
        }
        this.pinLockForm.reset();
        this.handleCancel();
      } else {
        this.notify.error(res['message'])
      }
    }, error => {
      this.notify.error(error.error.message);
    })
  }

  disablePinLock() {
     let val = {
      pinLockPassword: (this.code).toString()
    }
    this.security.verifyPin(val).subscribe((res: any) => {
      if (res['success']) {
        let val = {
          enablePinLock: this.isIdle == true?false:true,
        }
        this.security.updatePin(val).subscribe((res: any) => {
          if (res['success']) {
            this.notify.success(res['message']);
            this.isIdle = !this.isIdle;
            let val = this.isIdle == true ? 'true' : 'false';
            localStorage.setItem('isPinLock', val);
             if (this.isIdle) {
              this.authenticationService.inactivityTime();
            }
            this.pinLockForm.reset();
            this.handleCancel();
          } else {
            this.notify.error(res['message'])
          }
        }, error => {
          this.notify.error(error.error.message);
        })
      } else {
        this.notify.error(res['message'])
      }
    }, error => {
      this.notify.error(error.error.message);
    })
  }

    // this called every time when user changed the code
    onCodeChanged(code: string) {
    }
    code:any = 0;
    // this called only if user entered full code
    onCodeCompleted(code: string) {
    this.code = code;
    }

}
