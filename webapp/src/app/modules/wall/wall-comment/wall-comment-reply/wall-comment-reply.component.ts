
import { Component,Input, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { UserSM } from 'src/app/models/user.model';
import { WallReply, WallReplySM } from 'src/app/models/wall-comment.model';
import { WallService } from '../../wall.service';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { WallCommentActions } from 'src/app/state/wall-comment/wall-comment.actions';
import { WallPost } from 'src/app/models/wall-post.model';
import { WallReplyActions } from 'src/app/state/wall-reply/wall-reply.actions';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
    selector: 'app-wall-comment-reply',
    templateUrl: './wall-comment-reply.component.html',
    styleUrls: ['./wall-comment-reply.component.css']
})

export class WallCommentReplyComponent implements OnInit, OnDestroy {

    @Input() reply: WallReplySM;
    @Input() post: WallPost;
    @Input() commentId: number;
    profilePictureLink: Observable<string>;
    courseId: number;    
    expanded = true;
    replyText: string;
    userReply: Observable<UserSM>;
    translationText: typeof LANGUAGE.wall.WallCommentReplyComponent;
    private translationSubscription: Subscription | undefined;
    canDelete$: Observable<boolean>;
    date = new Date;
    replies$: Observable<WallReplySM[]>;
    @ViewChild('replyElement', { static: true }) replyRef: ElementRef;

    constructor(
        private store: Store,
        private translationService: TranslationService
    ){}

    isActivity() {
        return this.post?.activityId > 0;
      }

    ngOnInit() {
        this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
            (translation) => {
              this.translationText = translation.wall.WallCommentReplyComponent
            }
        );
        setTimeout(() => {
            this.expand(this.replyRef);
          }, 100);
        this.store.select(CourseSelectors.currentId).pipe(take(1)).subscribe(id => this.courseId = Number(id))
        // Only request if not created offline
        if (this.post.id < 10000000000) {
            this.store.dispatch(WallCommentActions.fetchAll.request({ input: { postId: this.post.id, courseId: this.courseId } })),
            this.store.dispatch(WallReplyActions.fetchAll.request({ input: { postId: this.post.id, courseId: this.courseId, commentId: this.commentId } }))
        }       
        this.canDelete$ = this.store.select(ParticipationAdvancedSelectors.hasPermission('delete_post_comment'));
        
        this.userReply = this.store.select(UserSelectors.byId(this.reply.createdById));
        this.replyText = this.reply.text?.trim();
        this.date = new Date(this.reply.lastModifiedDate);
        
    }

    ngOnDestroy(): void {
        this.translationSubscription.unsubscribe();
    }

    expand(e: ElementRef) {
        this.expanded = e.nativeElement.scrollHeight < 45;
    }
    trackReply(index: number, reply: WallReply) {
        return reply?.id;
    }
    deleteReply(confirmed: number) {
        if (!confirmed) {
            return;        }

        this.store.dispatch(WallReplyActions.delete.request({
            input: {
            postId: this.post.id,
            courseId: this.courseId,
            replyId: this.reply.id,
            }
        }))
    }
    
}


