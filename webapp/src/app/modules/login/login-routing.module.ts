import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanLoginGuard } from 'src/app/services/guards/can-login.guard';
import { LoginChangePasswordComponent } from './login-change-password/login-change-password.component';
import { LoginForgotPasswordComponent } from './login-forgot-password/login-forgot-password.component';
import { LoginComponent } from './login/login.component';


const appRoutes: Routes = [
  {
    path: 'login', component: LoginComponent,
    canActivate: [CanLoginGuard],
  },
  {
    path: 'register/finish', component: LoginComponent,
    canActivate: [CanLoginGuard],
  },
  {
    path: 'forgotPassword', component: LoginForgotPasswordComponent,
    canActivate: [CanLoginGuard],
  },
  {
    path: 'login/changePassword', component: LoginChangePasswordComponent,
    canActivate: [CanLoginGuard],
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LoginRoutingModule { }
