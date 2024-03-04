import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { Observable, Subscription, race } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

import { User } from 'src/app/models/user.model';
import { WallCommentForm } from 'src/app/models/wall-comment.model';
import { WallPost } from 'src/app/models/wall-post.model';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { UserAdvancedSelectors } from 'src/app/state/user/user.advanced.selector';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { WallCommentActions } from 'src/app/state/wall-comment/wall-comment.actions';
import { WallService } from './../wall.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

//função que verifica se o comentário constitui apenas de espaços
export const cannotContainOnlySpacesValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const text = control.get('text');

  return (!text.value?.replace(/\s/g, '').length)
    ? { cannotContainOnlySpaces: true }
    : null;
};

@Component({
  selector: 'app-wall-comment-create',
  templateUrl: './wall-comment-create.component.html',
  styleUrls: ['./wall-comment-create.component.css']
})
export class WallCommentCreateComponent implements OnInit, OnDestroy {

  public commentForm: FormGroup;
  @Input() post: WallPost;

  //@Output() handleSubmit = new EventEmitter();
  user$: Observable<User>;
  profilePictureLink$: Observable<string>;
  teacher$: Observable<boolean>;

  courseId: number;

  translationText: typeof LANGUAGE.wall.WallCommentCreateComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private store: Store,
    private actions$: Actions,
    private fb: FormBuilder,
    private translationService: TranslationService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.wall.WallCommentCreateComponent
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

  resize(e: HTMLTextAreaElement) {
    e.style.height = '72px';
    e.style.height = (Number(e.scrollHeight) + 15) + 'px';
  }

  onSubmit() {
    const body: WallCommentForm = this.commentForm.value;
    //this.handleSubmit.emit(this.commentForm.value.title);
    this.store.dispatch(WallCommentActions.create.request({
      input: { body, postId: this.post.id, courseId: this.courseId, commentId: null }
    }))
    
    const success$ = this.actions$.pipe(
      ofType(WallCommentActions.create.success),
      filter(({ input }) => input.postId === this.post.id && deepEqual(input.body, body)),
      tap(_ => {
        this.commentForm.reset();
      })
    );

    const error$ = this.actions$.pipe(
      ofType(WallCommentActions.create.error),
      filter(({ input }) => input.postId === this.post.id && deepEqual(input.body, body)),
    );

    const offlineError$ = this.actions$.pipe(
      ofType(WallCommentActions.create.offlineError),
      filter(({ input }) => input.postId === this.post.id && deepEqual(input.body, body)),
      tap(_ => {
        this.commentForm.reset();
      })
    );

    race(success$, error$).pipe(take(1)).subscribe();
    offlineError$.pipe(take(1)).subscribe();
  }
}
