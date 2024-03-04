import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GradesRoutingModule } from './grades-routing.module';
import { GradesComponent } from './grades/grades.component';
import { GradesService } from './grades.service';
import { GradesPersonalComponent } from './grades-personal/grades-personal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GradesCourseComponent } from './grades-course/grades-course.component';
import { SharedModule } from '../shared/shared.module';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { GradesEditWeightComponent } from './grades-edit-weight/grades-edit-weight.component';
import { GradesCaptionComponent } from './grades-caption/grades-caption.component';
import { GradesTableComponent } from './grades-table/grades-table.component';
import { GradesAvarageComponent } from './grades-avarage/grades-avarage.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    RouterModule,
    GradesRoutingModule,
    FontAwesomeModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    GradesComponent,
    GradesPersonalComponent,
    GradesCourseComponent,
    GradesEditWeightComponent,
    GradesCaptionComponent,
    GradesTableComponent,
    GradesAvarageComponent,
  ],
  providers:[
    GradesService
  ],
  exports: [
    GradesComponent,
  ]

})
export class GradesModule { }
