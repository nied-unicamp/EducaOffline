import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { GradesConfig, GradesConfigForm } from 'src/app/models/grades-config';
import { GradesConfigActions } from 'src/app/state/grades-config/grades-config.actions';
import { GradesConfigAdvancedSelectors } from 'src/app/state/grades-config/grades-config.advanced.selector';
import { GradesConfigSelectors } from 'src/app/state/grades-config/grades-config.selector';
import { Form } from 'src/app/templates/form';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { WallPostActions } from 'src/app/state/wall-post/wall-post.actions';

@Component({
  selector: 'app-grades-edit-weight',
  templateUrl: './grades-edit-weight.component.html',
  styleUrls: ['./grades-edit-weight.component.css']
})
export class GradesEditWeightComponent extends Form<GradesConfigForm> implements OnInit, OnDestroy{

  @Output() sent: EventEmitter<void> = new EventEmitter();
  @Input() onlyView: boolean = false;

  translationText: typeof LANGUAGE.grades.GradesEditWeightComponent;
  private translationSubscription: Subscription | undefined;
  lastConfig: GradesConfig;
  weightSum: number;

  avarageUpdateMarker = '[AVERAGE | n1i2e3d4]';

  weightArray: FormGroup[];

  constructor(
    private injector: Injector,
    private store: Store,
    private actions$: Actions,
    private translationService: TranslationService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.grades.GradesEditWeightComponent
      }
    );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  buildForm() {
    const form = new FormGroup({
      useArithmeticMean: new FormControl(this.lastConfig?.useArithmeticMean),
      publishOnWall: new FormControl(false),
      defaultWeight: new FormControl(this.value?.defaultWeight),
      weights: new FormArray(
        (!(this.lastConfig?.gradedActivities)) ? [] : this.lastConfig.gradedActivities.map(({ id, gradeWeight }) => new FormGroup({
          activityId: new FormControl(id, Validators.required),
          weight: new FormControl(gradeWeight, [Validators.required, Validators.min(0.01)])
        }))
      )
    });
    
    return form;
  }

  onValueChange2() {
    this.weightSum = (this.form.value as GradesConfigForm)?.weights
      ?.map(item => item.weight).reduce((a, b) => a + b, 0);
  }

  getBlank() {
    return {} as GradesConfigForm;
  }

  valuePointer(): Observable<GradesConfigForm> {
    return this.store.select(GradesConfigAdvancedSelectors.sel.one(
      GradesConfigSelectors.byCourseId(this.courseId),
    )).pipe(
      filter(config => !!config?.id),
      take(1),
      tap((config: GradesConfig) => {
        this.lastConfig = config;
      })
    )
  }

  create() {
    console.error('The grade weights are not created manually by the user, only edited');
  }

  edit() {
    if (this.editWeights) {
      this.store.dispatch(GradesConfigActions.editWeights.request({
        input: {
          courseId: this.courseId,
          form: this.form.value as GradesConfigForm
        }
      }))
    }
    else {
      this.store.dispatch(GradesConfigActions.useArithmeticMean.request({
        input: {
          courseId: this.courseId,
        }
      }))
    }

    if(this.form.value.publishOnWall) {
      this.store.dispatch(WallPostActions.api.byCourse.id.createWithCreatedById.request({
        input: {
          courseId: this.courseId,
          userId: 1,
          body: {
            text: this.avarageUpdateMarker,
            isFixed: false,
          }
        }
      }))
    }

    this.sent.emit();
  }

  get formWeightArray(): FormGroup[] {
    return (this.form.controls['weights'] as FormArray).controls as FormGroup[];
  }

  get editWeights(): boolean {
    return !this.form.controls.useArithmeticMean.value;
  }
}
