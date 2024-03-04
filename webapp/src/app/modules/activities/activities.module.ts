import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './../shared/shared.module';
import { ActivitiesCreateComponent } from './activities-create/activities-create.component';
import { ActivitiesDescriptionComponent } from './activities-description/activities-description.component';
import { ActivitiesListStudentsComponent } from './activities-list-students/activities-list-students.component';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivitiesService } from './activities.service';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivitiesEvaluateComponent } from './shared/activities-evaluate/activities-evaluate.component';
import { ActivitiesFeedbackComponent } from './shared/activities-feedback/activities-feedback.component';
import { ActivitiesFilterComponent } from './shared/activities-filter/activities-filter.component';
import { ActivitiesItemComponent } from './shared/activities-item/activities-item.component';
import { ActivitiesMenuComponent } from './shared/activities-menu/activities-menu.component';
import { ActivitiesPublicationDateComponent } from './shared/activities-publication-date/activities-publication-date.component';
import { ActivitiesSortComponent } from './shared/activities-sort/activities-sort.component';
import { ActivitiesSubmissionCreateComponent } from './shared/activities-submission-create/activities-submission-create.component';
import { ActivitiesSubmissionDateComponent } from './shared/activities-submission-date/activities-submission-date.component';
import { ActivitiesSubmissionComponent } from './shared/activities-submission/activities-submission.component';
import { ActivitiesSubmissionsListComponent } from './shared/activities-submissions-list/activities-submissions-list.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule,
    SharedModule,
    ActivitiesRoutingModule
  ],
  declarations: [
    ActivitiesComponent,
    ActivitiesCreateComponent,
    ActivitiesDescriptionComponent,
    ActivitiesEvaluateComponent,
    ActivitiesFeedbackComponent,
    ActivitiesFilterComponent,
    ActivitiesItemComponent,
    ActivitiesListStudentsComponent,
    ActivitiesMenuComponent,
    ActivitiesPublicationDateComponent,
    ActivitiesSortComponent,
    ActivitiesSubmissionComponent,
    ActivitiesSubmissionCreateComponent,
    ActivitiesSubmissionDateComponent,
    ActivitiesSubmissionsListComponent,
  ],
  exports: [
    ActivitiesComponent,
    ActivitiesDescriptionComponent
  ]
})
export class ActivitiesModule { }
