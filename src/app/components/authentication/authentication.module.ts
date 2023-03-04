import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CodeInputModule } from 'angular-code-input';
@NgModule({
  declarations: [LoginComponent, ForgotpasswordComponent, LockscreenComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    NzGridModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    CodeInputModule
  ],
  exports: [
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    CodeInputModule
  ]
})
export class AuthenticationModule { }
