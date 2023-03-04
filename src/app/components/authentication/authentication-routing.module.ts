import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "forgotpassword",
    component: ForgotpasswordComponent,
  },
  {
    path: "lockscreen",
    component: LockscreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
