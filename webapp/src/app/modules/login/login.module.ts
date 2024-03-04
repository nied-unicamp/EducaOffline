import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/modules/login/login.service';
import { CanLoginGuard } from 'src/app/services/guards/can-login.guard';
import { LoginChangePasswordComponent } from './login-change-password/login-change-password.component';
import { LoginForgotPasswordComponent } from './login-forgot-password/login-forgot-password.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    LoginForgotPasswordComponent,
    LoginChangePasswordComponent
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    LoginService,
    CanLoginGuard
  ]
})
export class LoginModule { }
