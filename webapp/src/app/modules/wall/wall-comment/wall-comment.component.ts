import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { WallComment } from 'src/app/models/wall-comment.model';
import { WallPost } from 'src/app/models/wall-post.model';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { UserAdvancedSelectors } from 'src/app/state/user/user.advanced.selector';
import { WallCommentActions } from 'src/app/state/wall-comment/wall-comment.actions';
import { WallService } from './../wall.service';
import { WallReplyActions } from 'src/app/state/wall-reply/wall-reply.actions';
import { WallReplySelectors } from 'src/app/state/wall-reply/wall-reply.selector';
import { WallReplySM } from 'src/app/models/wall-comment.model';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-wall-comment',
  templateUrl: './wall-comment.component.html',
  styleUrls: ['./wall-comment.component.css']
})
export class WallCommentComponent implements OnInit, OnDestroy {

  @Input() comment: WallComment;
  @Input() post: WallPost;
  @Input() reply: WallReplySM;
  @ViewChild('commentElement', { static: true }) commentRef: ElementRef;
  replies$: Observable<WallReplySM[]>;
  canDelete$: Observable<boolean>;
  expanded = true;
  replyText: string;
  courseId: number;
  profilePictureLink: Observable<string>;
  commentText: string;

  translationText: typeof LANGUAGE.wall.WallCommentComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private store: Store,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.wall.WallCommentComponent
      }
 	  );
    setTimeout(() => {
      this.expand(this.commentRef);
    }, 100);
    
    this.canDelete$ = this.store.select(ParticipationAdvancedSelectors.hasPermission('delete_post_comment'));
    this.store.select(CourseSelectors.currentId).pipe(take(1)).subscribe(id => this.courseId = Number(id));

    this.commentText = this.comment.text?.trim();
    this.replyText = this.reply?.text?.trim();

    this.profilePictureLink = this.store.select(UserAdvancedSelectors.pictureLink.userId, { userId: this.comment.createdBy?.id });
    this.store.dispatch(WallReplyActions.fetchAll.request({ input: { postId: this.post.id, courseId: this.courseId, commentId: this.comment.id} }));

    this.replies$ = this.store.select(WallReplySelectors.byParentCommentId(this.comment.id));
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  likeToggle() {
    this.store.dispatch(WallCommentActions.like.request({
      input: {
        to: !this.comment.liked,
        commentId: this.comment.id,
        courseId: this.courseId,
        postId: this.post.id
      }
    }));
  }

  deleteComment(confirmed: number) {
    if (!confirmed) {
      return;
    }

    this.store.dispatch(WallCommentActions.delete.request({
      input: {
        commentId: this.comment.id,
        courseId: this.courseId,
        postId: this.post.id
      }
    }))
  }

  expand(e: ElementRef) {
    this.expanded = e.nativeElement.scrollHeight < 45;
  }
  trackReply(index: number, reply: WallReplySM) {
    return reply?.id;
  }
}
