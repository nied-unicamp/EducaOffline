import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MenuModule } from '../menu/menu.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileCoursesComponent } from './profile-courses/profile-courses.component';
import { ProfilePasswordEditComponent } from './profile-password-edit/profile-password-edit.component';
import { ProfilePersonalDataEditComponent } from './profile-personal-data-edit/profile-personal-data-edit.component';
import { ProfilePersonalDataComponent } from './profile-personal-data/profile-personal-data.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileService } from './profile.service';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    MenuModule,
    ProfileRoutingModule,
    NgbModule,
    ImageCropperModule,
    FontAwesomeModule
  ],
  declarations: [
    ProfileComponent,
    ProfileCoursesComponent,
    ProfilePersonalDataComponent,
    ProfilePersonalDataEditComponent,
    ProfilePasswordEditComponent
  ],
  exports: [
    ProfileComponent,
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule { }
