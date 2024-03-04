import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialComponent } from './material/material.component';


const appRoutes: Routes = [
  {
    path: '', component: MaterialComponent,
  },
  {
    path: 'folder',
    children: [
      {
        path: '', redirectTo: '..'
      },
      {
        path: ':folderId', component: MaterialComponent,
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
export class MaterialRoutingModule { }
