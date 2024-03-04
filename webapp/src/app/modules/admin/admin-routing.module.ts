import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/guards/auth.guard';
import { AdminListCoursesComponent } from './admin-list-courses/admin-list-courses.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminComponent } from './admin/admin.component';

const appRoutes: Routes = [
  {
    path: '', redirectTo: 'courses', pathMatch: 'full'
  },
  {
    path: 'list', component: AdminComponent, children: [
      { path: '', component: AdminListComponent }
    ]
  },
  {
    path: 'courseRegister', component: AdminComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./course-register/course-register.module').then(m => m.CourseRegisterModule)
  },
  {
    path: 'courses', component: AdminComponent, children: [
      { path: '', component: AdminListCoursesComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
