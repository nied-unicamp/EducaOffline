import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivityEvaluation } from 'src/app/models/activity-evaluation.model';
import { ActivityItem } from 'src/app/models/activity-item.model';
import { ActivitiesApiService } from 'src/app/services/api/activities.api.service';
import { Form } from 'src/app/templates/form';
import { ActivitiesService } from '../../activities.service';
import { Store } from '@ngrx/store';
import { ActivityEvaluationActions } from 'src/app/state/activity-evaluation/activity-evaluation.actions';
import { Actions, ofType } from '@ngrx/effects';
import { filter, take, tap } from 'rxjs/operators';
import deepEqual from 'deep-equal';
import { Router } from '@angular/router';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activities-evaluate',
  templateUrl: './activities-evaluate.component.html',
  styleUrls: ['./activities-evaluate.component.css']
})

export class ActivitiesEvaluateComponent extends Form<ActivityEvaluation> implements OnInit, OnDestroy{
  translationText: typeof LANGUAGE.activities.ActivitiesEvaluateComponent;
  private translationSubscription: Subscription | undefined;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input() item: ActivityItem;
  @Output() sent: EventEmitter<void> = new EventEmitter<void>();

  default: ActivityEvaluation;

  constructor(
    private injector: Injector,
    private activitiesApi: ActivitiesApiService,
    private store: Store,
    private actions: Actions,
    private translationService: TranslationService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesEvaluateComponent
      }
    );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  getBlank() {
    return {} as ActivityEvaluation;
  }

  valuePointer() {
    return this.item.evaluation;
  }

  buildForm() {
    return this.fb.group({
      score: [this.value?.score, Validators.required],
      comment: [this.value?.comment],
      submissionID: [this.item.submission?.id]
    });
  }
  onSubmitLocal() {
    if (!this.item.evaluation) {
      this.create();
    } else {
      this.edit()
    }

  }

  create() {
    console.log("Create chamado");
  
    const input = {
      courseId: this.courseId,
      activityId: this.routeData.activity?.id,
      userId: this.item.user.id,
      form: this.form.value
    }

    this.store.dispatch(ActivityEvaluationActions.create.request({ input }));
    this.sent.emit();
    
  }

  edit() {
    console.log("Edit chamado");

    const input = {
      evaluationId: this.item.evaluation.id,
      courseId: this.courseId,
      activityId: this.routeData.activity?.id,
      userId: this.item.user.id,
      form: this.form.value
    }
    this.sent.emit();

    this.store.dispatch(ActivityEvaluationActions.edit.request({ input }));

  }
}
