import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseRegisterComponent } from './course-register/course-register.component';


const appRoutes: Routes = [
  { path: '', component: CourseRegisterComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CourseRegisterRoutingModule { }
