import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { Subscription, race } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

import { Course } from 'src/app/models/course.model';
import { LoginSelectors } from 'src/app/state/login/login.selector';
import { WallPostActions } from 'src/app/state/wall-post/wall-post.actions';
import { WallService } from '../wall.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';


export const cannotContainOnlySpacesValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const text = control.get('text');

  return (!text.value?.replace(/\s/g, '').length)
    ? { cannotContainOnlySpaces: true }
    : null;
};

@Component({
  selector: 'app-wall-create',
  templateUrl: './wall-create.component.html',
  styleUrls: ['./wall-create.component.css']
})
export class WallCreateComponent implements OnInit, OnDestroy {

  public wallCreateForm: FormGroup;
  isOffline$ = this.store.select(LoginSelectors.isOffline);



  courseId: number;
  textNumCharsTyped: number;
  textNumCharsTypedColor: string;
  textErrorMaxNumCharsExceeded = false;
  textMaxNumChars = 1000;

  translationText: typeof LANGUAGE.wall.WallCreateComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private store: Store,
    private actions$: Actions,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translationService: TranslationService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.wall.WallCreateComponent
      }
 	  );
    this.route.data.subscribe((data: { course: Course }) => {
      this.courseId = data.course?.id;
    });
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  buildForm() {
    this.wallCreateForm = this.fb.group({
      text: ['', [
        Validators.required,
        Validators.maxLength(this.textMaxNumChars)
      ]],
      isFixed: [false],
    }, {
      validators: [cannotContainOnlySpacesValidator]
    });
  }

  textSetNumberChars(event: any) {
    const txt = event.target.value?.replace(/(\r\n|\n|\r)/g, '');
    this.textNumCharsTyped = txt.length;
    if (this.textNumCharsTyped > this.textMaxNumChars) {
      this.textNumCharsTypedColor = 'danger';
    } else {
      this.textNumCharsTypedColor = 'primary';
    }
  }

  resize(e: HTMLTextAreaElement) {
    e.style.height = '72px';
    e.style.height = (Number(e.scrollHeight) + 15) + 'px';
  }

  onSubmit() {
    const body = this.wallCreateForm.value;

    this.store.dispatch(WallPostActions.api.byCourse.current.create.request({
      input: { body }
    }))

    const success$ = this.actions$.pipe(
      ofType(WallPostActions.api.byCourse.id.create.success),
      filter(({ input }) => deepEqual(input.body, body)),
      tap(_ => {
        this.wallCreateForm.reset();
        this.textNumCharsTyped = 0;
      })
    );

    const error$ = this.actions$.pipe(
      ofType(WallPostActions.api.byCourse.id.create.error),
      filter(({ input }) => deepEqual(input.body, body)),
    );

    const offlineError$ = this.actions$.pipe(
      ofType(WallPostActions.api.byCourse.id.create.offlineError),
      filter(({ input }) => deepEqual(input.body, body)),
      tap(_ => {
        this.wallCreateForm.reset();
        this.textNumCharsTyped = 0;
      })
    );

    race(success$, error$).pipe(take(1)).subscribe();
    offlineError$.pipe(take(1)).subscribe();
  }
}
