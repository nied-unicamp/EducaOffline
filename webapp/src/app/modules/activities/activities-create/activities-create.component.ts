import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { Subscription, combineLatest, of } from 'rxjs';
import { concatMap, filter, map, take, tap } from 'rxjs/operators';
import { Activity, ActivityForm, ActivityFormJson, ActivitySM, convertFromNgb, fromActivityFormToJson } from 'src/app/models/activity.model';
import { ActivityActions } from 'src/app/state/activity/activity.actions';
import { ActivityAdvancedSelectors } from 'src/app/state/activity/activity.advanced.selector';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { selectRouteParam } from 'src/app/state/router/router.selector';
import { SharedService } from '../../shared/shared.service';
import { ActivitiesService } from './../activities.service';
import { LoginSelectors } from 'src/app/state/login/login.selector';
import { FileUploaded } from 'src/app/models/file-uploaded.model';
import { getFileId } from 'src/app/state/file-uploaded/file-uploaded.state';
import { WallPostActions } from 'src/app/state/wall-post/wall-post.actions';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';




@Component({
  selector: 'app-activities-create',
  templateUrl: './activities-create.component.html',
  styleUrls: ['./activities-create.component.css']
})

export class ActivitiesCreateComponent implements OnInit, OnDestroy {
  translationText: typeof LANGUAGE.activities.ActivitiesCreateComponent;
  private translationSubscription: Subscription | undefined;

  form: FormGroup;

  formErrors: any = {};
  valueIsValid = false;

  courseId: number;
  activityId: number;
  activity: ActivitySM; // is not undefined only isEditing
  isEditing = false;
  isOffline: boolean;
  oldFiles: string[];


  initialForm: ActivityForm;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private store: Store,
    private actions$: Actions,
    private translationService: TranslationService
  ) {

  }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesCreateComponent
      }
    );
    if (this.isEditing) {
      this.store.select(ActivitySelectors.byId(this.activityId)).subscribe((activity) => this.activity = activity);
      this.oldFiles = this.activity.files;
    }
    this.resolveData();
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  getBlank(): ActivityForm {
    const now = new Date();

    const activity: ActivityForm = {
      title: '',
      description: '',
      hasGrade: false,
      criteria: '',
      submissionPeriod: {
        start: this.sharedService.convertToNgb(now),
        end: undefined
      },
      publishDate: this.sharedService.convertToNgb(now),
      files: undefined
    };

    return activity;
  }

  buildForm(): FormGroup {

    return this.fb.group({
      title: [this.initialForm.title, Validators.required],
      hasGrade: [this.initialForm.hasGrade],
      description: [this.initialForm.description, Validators.required],
      submissionPeriod: [this.initialForm.submissionPeriod],
      publishDate: [this.initialForm.publishDate, Validators.required],
      criteria: [this.initialForm.criteria],
      files: [this.initialForm.files]
    });
  }

  create(value: ActivityForm): void {
    console.log('Creating');

    const form: ActivityFormJson = fromActivityFormToJson(value);

    const input = {
      form: value,
      courseId: this.courseId
    }

    this.store.dispatch(ActivityActions.create.request({ input }))

    this.actions$.pipe(
      ofType(ActivityActions.create.success),
      tap(action => console.log({ action })),
      filter(action => deepEqual(action.input, input)),
      take(1),
      tap(({ data }) => {
        this.navigateToActivity(data?.id)
        this.store.dispatch(WallPostActions.api.byCourse.id.fetchActivityPosts.request({ input: { courseId: this.courseId } }))
      })
    ).subscribe();

    /*
      if offline, create offlineError action will be dispatched
    */
    this.actions$.pipe(
      ofType(ActivityActions.create.offlineError),
      filter(action => deepEqual(action.input, input)),
      take(1),
      tap(({ input, error, info }) => this.navigateToActivity(info?.id))
    ).subscribe();
    
    this.actions$.pipe(
      ofType(ActivityActions.create.offlineError),
      filter(action => deepEqual(action.input, input)),
      take(1),
      tap(({ input, error, info }) => {
        let publishDate: Date = convertFromNgb(input.form.publishDate, false)
        let now: Date = new Date();
        if (now.getTime() > publishDate.getTime()) {
          this.store.dispatch(WallPostActions.api.byCourse.id.createWithActivityId.error({
            input: {
              courseId: this.courseId,
              activityId: info.id,
              body: {
                text: "",
                isFixed: false
              }
            },
            error: {}
          }))
        }
      })
    ).subscribe();

  }

  edit(value: ActivityForm) {

    this.store.select(LoginSelectors.isOffline).subscribe(isOff => this.isOffline = isOff)

    if (this.isOffline) {
      const mantainedFilesIds: string[] = value.files.uploaded.map(file => getFileId(file));

      // atualiza a lista de arquivos da atividade com os Uploaded
      this.store.dispatch(ActivityActions.basic.update.one({ data: { id: this.activityId, changes: { files: [...mantainedFilesIds] } } }))
    }
    

    const input = {
      form: value,
      courseId: this.courseId,
      id: this.activityId
    }

    this.store.dispatch(ActivityActions.edit.request({ input }))

    if (!this.isOffline) {
      this.actions$.pipe(
        ofType(ActivityActions.edit.success),
        tap(action => console.log({ action })),
        filter(action => deepEqual(action.input, input)),
        take(1),
        tap(({ data }) => this.navigateToActivity(data?.id))
      ).subscribe();
    } else {
      this.navigateToActivity(this.activityId)
    }
    
  }

  private navigateToActivity(activityId: number) {
    console.log(`Navigating to activity: ${activityId}`);
    this.router.navigate([`/courses/${this.courseId}/activities/${activityId}`], {
      queryParams: { refresh: true }
    });
  }

  /**
   * If the form is already built, reset it with the new values, if not, instantiate it!
   *
   * Note: We do it this way because I figured out that it is not good to
   * reinitialize formGroup over and over again, because the custom formControl
   * component looses reference to old formGroup (=> errors).
   */
  protected resetForm(force = false) {

    if (!this.form || force) {
      this.form = this.buildForm();
      this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    } else {
      const myNewForm = this.buildForm().value;
      this.form.reset(myNewForm);
    }
  }


  /**
   * When any form value is changed, find errors and set messages to be shown
   */
  private onValueChanged(data?: any) {
    if (!this.form) { return; }
    const form = this.form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.translationText?.validationMessages[field];
        // eslint-disable-next-line guard-for-in
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  /**
   * When the user clicks on the submit button, sends the form data to the server
   */
  onSubmit() {

    const activityCreateForm = this.form.value;
    console.log({ activityCreateForm });

    if (this.isEditing) {
      this.edit(activityCreateForm);
    } else {
      this.create(activityCreateForm);
    }
  }

  private resolveData() {
    const courseId$ = this.store.select(selectRouteParam('courseId')).pipe(
      map(id => Number(id)),
      tap(id => this.courseId = id)
    );
    const activityId$ = this.store.select(selectRouteParam('activityId')).pipe(
      map(id => Number(id)),
      tap(id => this.activityId = id)
    );

    const isEditing$ = activityId$.pipe(
      map(id => id > 0),
      tap(isEditing => this.isEditing = isEditing)
    );

    combineLatest([courseId$, activityId$, isEditing$]).pipe(
      take(1),
      concatMap(([courseId, activityId, isEditing]) => {
        if (isEditing) {
          this.store.dispatch(ActivityActions.fetchOne.request({ input: { courseId, id: activityId } }));

          return this.store.select(ActivityAdvancedSelectors.sel.one(
            ActivitySelectors.byId(activityId)
          )).pipe(
            map(activity => this.fromActivityToForm(activity))
          );
        } else {
          return of(this.getBlank());
        }
      }),
    ).subscribe(form => this.initialForm = form);
  }

  private fromActivityToForm(activity: Activity): ActivityForm {
    return {
      title: activity?.title,
      description: activity?.description,
      criteria: activity?.criteria,

      hasGrade: activity?.gradeWeight > 0,

      submissionPeriod: {
        start: this.sharedService.convertToNgb(activity?.submissionBegin),
        end: this.sharedService.convertToNgb(activity?.submissionEnd),
      },
      publishDate: this.sharedService.convertToNgb(activity?.publishDate),

      files: {
        uploaded: activity?.files ?? [],
        toDelete: [],
        toUpload: []
      }
    }
  }

  public cancel(): void {
    this.router.navigate([`/courses/${this.courseId}/activities`])
  }
}

