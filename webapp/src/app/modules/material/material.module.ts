import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './../shared/shared.module';
import { MaterialCreateLinkComponent } from './material-create-link/material-create-link.component';
import { MaterialItemComponent } from './material-item/material-item.component';
import { MaterialLinkComponent } from './material-link/material-link.component';
import { MaterialMenuComponent } from './material-menu/material-menu.component';
import { MaterialRoutingModule } from './material-routing.module';
import { MaterialService } from './material.service';
import { MaterialComponent } from './material/material.component';
import { MaterialUploadFilesComponent } from './material-upload-files/material-upload-files.component';
import { MaterialCreateFolderComponent } from './material-create-folder/material-create-folder.component';
import { MaterialFolderComponent } from './material-folder/material-folder.component';
import { FilterByFolderIdPipe } from './material-filterByFolderId.pipe';
import { MaterialMoveComponent } from './material-move/material-move.component';
import { MaterialEditDropdownComponent } from './material-edit-dropdown/material-edit-dropdown.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    SharedModule,
    MaterialRoutingModule
  ],
  declarations: [
    MaterialComponent,
    MaterialMenuComponent,
    MaterialLinkComponent,
    MaterialItemComponent,
    MaterialCreateLinkComponent,
    MaterialUploadFilesComponent,
    MaterialCreateFolderComponent,
    MaterialFolderComponent,
    FilterByFolderIdPipe,
    MaterialMoveComponent,
    MaterialEditDropdownComponent
  ],
  providers: [
    MaterialService
  ],
  exports: [
    MaterialComponent
  ]
})
export class MaterialModule { }
