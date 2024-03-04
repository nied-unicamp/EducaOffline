import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members/members.component';
import { MembersItemComponent } from './members-item/members-item.component';
import { MembersAddComponent } from './members-add/members-add.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { MembersRoutingModule } from './members-routing.module';
import { MembersService } from './members.service';

@NgModule({
  declarations: [
    MembersComponent,
    MembersItemComponent,
    MembersAddComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FontAwesomeModule,
    SharedModule,
    MembersRoutingModule
  ],
  providers: [
    MembersService
  ],
  exports: [
    MembersComponent,
    MembersAddComponent
  ]
})
export class MembersModule { }
