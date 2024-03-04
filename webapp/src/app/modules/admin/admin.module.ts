import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuModule } from '../menu/menu.module';
import { AdminListCoursesComponent } from './admin-list-courses/admin-list-courses.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminService } from './admin.service';
import { AdminComponent } from './admin/admin.component';
import { MembersModule } from '../members/members.module';
import { SharedModule } from '../shared/shared.module';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    MenuModule,
    FontAwesomeModule,
    AdminRoutingModule,
    MembersModule,
    SharedModule,
    ReactiveFormsModule,
  ],

  declarations: [
    AdminListCoursesComponent,
    AdminListComponent,
    AdminComponent,
    CourseEditComponent
  ],

  providers: [
    AdminService
  ]

})
export class AdminModule { }
