import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuModule } from '../menu/menu.module';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterService } from './register.service';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    MenuModule,
    RegisterRoutingModule,
    SharedModule
  ],
  declarations: [
    RegisterComponent
  ],
  providers: [
    RegisterService
  ],
  exports: [
    CommonModule,
  ]
})
export class RegisterModule { }
