import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { WallComment, WallReplySM } from 'src/app/models/wall-comment.model';
import { WallPost } from 'src/app/models/wall-post.model';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { WallCommentActions } from 'src/app/state/wall-comment/wall-comment.actions';
import { WallCommentAdvancedSelectors } from 'src/app/state/wall-comment/wall-comment.advanced.selector';
import { WallCommentSelectors } from 'src/app/state/wall-comment/wall-comment.selector';
import { WallService } from './../wall.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-wall-item',
  templateUrl: './wall-item.component.html',
  styleUrls: ['./wall-item.component.css']
})
export class WallItemComponent implements OnInit, OnDestroy {
  @Input() post: WallPost;
  @Input() reply: WallReplySM;
  courseId: number;
  commentId: number;
  replyText: string;
  comments$: Observable<WallComment[]>;

  canceledMarker: string = '[CANCELED | n1i2e3d4]';
  gradeReleasedMarker: string = '[GRADES | n1i2e3d4]';
  avarageUpdateMarker: string = '[AVERAGE | n1i2e3d4]';

  translationText: typeof LANGUAGE.wall.WallItemComponent;
  translationTextPost: typeof LANGUAGE.wall.WallPostComponent;

  private translationSubscription: Subscription | undefined;

  constructor(
    private store: Store,
    private translationService: TranslationService
  ) { }

  isActivity() {
    return this.post?.activityId > 0;
  }

  canceledOrReleasedActivity() {
    return (this.post?.text.includes(this.canceledMarker) || this.post?.text.includes(this.gradeReleasedMarker)) &&
            (this.post?.createdBy?.isAdmin || !this.post?.createdBy);
  }

  isAverageUpdate() {
    return (this.post?.text.includes(this.avarageUpdateMarker)) &&
            (this.post?.createdBy?.isAdmin || !this.post?.createdBy);
  }

  isSpecialPost() {
    return this.isActivity() || this.canceledOrReleasedActivity() || this.isAverageUpdate();
  }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.wall.WallItemComponent
        this.translationTextPost = translation.wall.WallPostComponent
      }
 	  );
    this.store.select(CourseSelectors.currentId).pipe(take(1)).subscribe(id => this.courseId = Number(id))

    // Only request if not created offline
    if (this.post.id < 10000000000) {
      this.store.dispatch(WallCommentActions.fetchAll.request({ input: { postId: this.post.id, courseId: this.courseId } }))
     
    }
    this.comments$ = this.store.select(WallCommentAdvancedSelectors.sel.many(WallCommentSelectors.byPost.id.all(this.post.id))).pipe()  

  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  private sortComments(a: WallComment, b: WallComment) {
    const dateA = a?.lastModifiedDate;
    const dateB = b?.lastModifiedDate;

    return dateA > dateB ? 1 : (dateA < dateB ? -1 : 0);
  }


  trackComment(index: number, comment: WallComment) {
    return comment?.id;
  }
}
