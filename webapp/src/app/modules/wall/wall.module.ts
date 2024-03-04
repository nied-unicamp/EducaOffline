import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { WallCommentCreateComponent } from './wall-comment-create/wall-comment-create.component';
import { WallCommentComponent } from './wall-comment/wall-comment.component';
import { WallCreateComponent } from './wall-create/wall-create.component';
import { WallItemComponent } from './wall-item/wall-item.component';
import { WallPostComponent } from './wall-post/wall-post.component';
import { WallRoutingModule } from './wall-routing.module';
import { WallService } from './wall.service';
import { WallComponent } from './wall/wall.component';
import { WallApiService } from 'src/app/services/api/wall.api.service';
import { WallCommentReplyCreateComponent } from './wall-comment/wall-comment-reply-create/wall-comment-reply-create.component';
import { WallCommentReplyComponent } from './wall-comment/wall-comment-reply/wall-comment-reply.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule,
    WallRoutingModule,
    NgbModule
  ],
  declarations: [
    WallComponent,
    WallCreateComponent,
    WallPostComponent,
    WallCommentCreateComponent,
    WallItemComponent,
    WallCommentComponent,
    WallCommentReplyCreateComponent,
    WallCommentReplyComponent
    
  ],
  exports: [
    WallComponent,
    WallCommentComponent
  ],
  providers: [
    WallService,
    WallApiService
  ]
})
export class WallModule { }
