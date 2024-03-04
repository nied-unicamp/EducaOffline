import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesComponent } from './dev/routes.component';
import { AdminGuard } from './services/guards/admin.guard';
import { AuthGuard } from './services/guards/auth.guard';
import { UserResolverService } from './services/resolvers/user-resolver.service';


const appRoutes: Routes = [
  {
    path: '',
    resolve: {
      user: UserResolverService
    },
    canActivateChild: [AuthGuard],

    children: [
      {
        path: '', redirectTo: 'courses', pathMatch: 'full'
      },
      {
        canActivate: [AdminGuard],
        path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'courses', loadChildren: () => import('./modules/courses/courses.module').then(m => m.CoursesModule)
      },
      {
        path: 'profile', loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
      },
    ]
  },
  {
    path: '**', component: RoutesComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      paramsInheritanceStrategy: 'always',
      relativeLinkResolution: 'corrected',
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule { }
