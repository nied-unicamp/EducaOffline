import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MembersModule } from '../members/members.module';
import { MenuModule } from '../menu/menu.module';
import { SharedModule } from '../shared/shared.module';
import { CoursesCardComponent } from './courses-card/courses-card.component';
import { CoursesHomeEnterComponent } from './courses-home-enter/courses-home-enter.component';
import { CoursesHomeComponent } from './courses-home/courses-home.component';
import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses/courses.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    RouterModule,
    CoursesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    SharedModule,
    MembersModule,
  ],
  declarations: [
    CoursesComponent,
    CoursesHomeComponent,
    CoursesCardComponent,
    CoursesHomeEnterComponent,
  ],
  exports: [
    CoursesComponent,
  ]
})
export class CoursesModule { }
