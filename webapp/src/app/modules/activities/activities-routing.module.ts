import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/services/guards/permission.guard';
import { ActivityResolverService } from 'src/app/services/resolvers/activity-resolver.service';
import { ActivitiesCreateComponent } from './activities-create/activities-create.component';
import { ActivitiesDescriptionComponent } from './activities-description/activities-description.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivitiesEvaluateComponent } from './shared/activities-evaluate/activities-evaluate.component';
import { ActivitiesFeedbackComponent } from './shared/activities-feedback/activities-feedback.component';
import { ActivitiesSubmissionsListComponent } from './shared/activities-submissions-list/activities-submissions-list.component';



const appRoutes: Routes = [
  {
    path: '', component: ActivitiesComponent
  },
  {
    path: 'create', component: ActivitiesCreateComponent,

    canActivate: [
      PermissionGuard
    ],

    data: {
      checkPermissions: [
        'create_activities'
      ],
    }
  },
  {
    path: 'folder', children: [
      {
        path: '', redirectTo: '..'
      },
      {
        path: ':folderId', component: ActivitiesComponent,
      }
    ]
  },
  {
    path: ':activityId',

    resolve: {
      activity: ActivityResolverService
    },

    runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',

    children: [
      {
        path: '', component: ActivitiesDescriptionComponent
      },
      {
        path: 'edit', component: ActivitiesCreateComponent
      },
      {
        path: 'feedback', component: ActivitiesFeedbackComponent
      },
      {
        path: 'evaluate', children: [
          {
            path: '', component: ActivitiesSubmissionsListComponent
          },
          {
            path: ':subId', component: ActivitiesEvaluateComponent
          },
        ]
      },

      {
        path: '**', redirectTo: ''
      }
    ]
  },
  {
    path: '**', redirectTo: ''
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
export class ActivitiesRoutingModule { }
