import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuModule } from 'src/app/modules/menu/menu.module';
import { CourseRegisterFormComponent } from './course-register-form/course-register-form.component';
import { CourseRegisterResponseComponent } from './course-register-response/course-register-response.component';
import { CourseRegisterRoutingModule } from './course-register-routing.module';
import { CourseRegisterService } from './course-register.service';
import { CourseRegisterComponent } from './course-register/course-register.component';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    MenuModule,
    CourseRegisterRoutingModule
  ],
  declarations: [
    CourseRegisterFormComponent,
    CourseRegisterResponseComponent,
    CourseRegisterComponent
  ],
  providers: [
    CourseRegisterService
  ],
  exports: [
    CommonModule,
    CourseRegisterResponseComponent,
    CourseRegisterFormComponent
  ]
})
export class CourseRegisterModule { }
