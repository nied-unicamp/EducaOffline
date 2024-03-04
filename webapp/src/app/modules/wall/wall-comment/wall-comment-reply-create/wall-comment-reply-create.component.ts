import { Component,Input, OnDestroy, OnInit} from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { WallApiService } from 'src/app/services/api/wall.api.service';
import { User } from 'src/app/models/user.model';
import { WallComment, WallReplyForm } from 'src/app/models/wall-comment.model';
import { WallService } from '../../wall.service';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { UserAdvancedSelectors } from 'src/app/state/user/user.advanced.selector';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { WallPost } from 'src/app/models/wall-post.model';
import { WallReplyActions } from 'src/app/state/wall-reply/wall-reply.actions';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

//função que verifica se o reply constitui apenas de espaços
export const cannotContainOnlySpacesValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const text = control.get('text');

  return (!text.value?.replace(/\s/g, '').length)
    ? { cannotContainOnlySpaces: true }
    : null;
};

@Component({
  selector: 'app-wall-comment-reply-create',
  templateUrl: './wall-comment-reply-create.component.html',
  styleUrls: ['./wall-comment-reply-create.component.css']
})
export class WallCommentReplyCreateComponent implements OnInit, OnDestroy {

  showTextBox = true;
  public commentForm: FormGroup;
  @Input() currentUserId!: number;
  @Input() firstComment: WallComment;
  @Input() post: WallPost;
  canReply: boolean = false;
  isReplyVisible = false;
  replyText: string = '';
  courseId: number;
  parentCommentId: number;  
  user$: Observable<User>;
  teacher$: Observable<boolean>;
  profilePictureLink$: Observable<string>;
  translationText: typeof LANGUAGE.wall.WallCommentReplyCreateComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private store: Store,
    private WallApiService: WallApiService,
    private actions$: Actions,
    private fb: FormBuilder,
    private translationService: TranslationService
  ) {
    this.buildForm();
   }


  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.wall.WallCommentReplyCreateComponent
      }
 	  );
    this.store.select(CourseSelectors.currentId).subscribe(
      courseId => this.courseId = Number(courseId)
    );
    this.user$ = this.store.select(UserSelectors.current);
    this.profilePictureLink$ = this.store.select(UserAdvancedSelectors.pictureLink.me);
    this.teacher$ = this.store.select(ParticipationAdvancedSelectors.currentRole).pipe(
      map(role => role?.name === 'TEACHER')
    )
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }
  
  buildForm() {
    this.commentForm = this.fb.group({
      text: ['', [
        Validators.required, Validators.maxLength(1000)
      ]]
    }, {
      validators: [cannotContainOnlySpacesValidator]
    });
  }

  commentContainer: HTMLElement | null = document.getElementById("comment-container");

  toggleReply() {
    this.isReplyVisible = !this.isReplyVisible;
  }

  submitReply() {
    // Limpar a caixa de texto e ocultar a caixa de resposta
    this.replyText = '';
    this.isReplyVisible = false;
  }  

  resize(e: HTMLTextAreaElement) {
    e.style.height = '72px';
    e.style.height = (Number(e.scrollHeight) + 15) + 'px';
  }
  

  onSubmit() {
    const body: WallReplyForm = this.commentForm.value;
    
    this.store.dispatch(WallReplyActions.createReply.request({
      input: { body, courseId: this.courseId, postId: this.post.id, commentId: this.firstComment.id}
    }))

    this.commentForm.reset();    
  }
}
