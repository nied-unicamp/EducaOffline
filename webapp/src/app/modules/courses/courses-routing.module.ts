import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/services/guards/role.guard';
import { CourseResolverService } from 'src/app/services/resolvers/course-resolver.service';
import { RoleResolverService } from 'src/app/services/resolvers/role-resolver.service';
import { CoursesHomeComponent } from './courses-home/courses-home.component';
import { CoursesComponent } from './courses/courses.component';

const appRoutes: Routes = [

  {
    path: '',
    component: CoursesComponent,

    children: [
      {
        path: '',
        component: CoursesHomeComponent,
      },
      {
        path: ':courseId',

        canActivate: [RoleGuard],
        resolve: {
          course: CourseResolverService,
          role: RoleResolverService
        },

        children: [
          {
            path: '', redirectTo: 'wall'
          },
          {
            path: 'wall',
            loadChildren: () => import('../wall/wall.module').then(m => m.WallModule),
          },
          {
            path: 'activities',
            loadChildren: () => import('../activities/activities.module').then(m => m.ActivitiesModule),
          },
          {
            path: 'grades',
            loadChildren: () => import('../grades/grades.module').then(m => m.GradesModule),
          },
          {
            path: 'material',
            loadChildren: () => import('../material/material.module').then(m => m.MaterialModule),
          },
          {
            path: 'members',
            loadChildren: () => import('../members/members.module').then(m => m.MembersModule),
          },
          {
            path: 'calendar',
            loadChildren: () => import('../calendar/calendar.module').then(m => m.CalendarModule),
          },
          {
            path: 'groups',
            loadChildren: () => import('../groups/groups.module').then(m => m.GroupsModule),
          }
        ]
      }

    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CoursesRoutingModule { }
