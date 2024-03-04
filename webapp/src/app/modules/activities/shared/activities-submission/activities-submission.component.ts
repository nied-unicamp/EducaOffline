import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { ActivitySubmission } from 'src/app/models/activity-submission.model';
import { Activity, ActivityStates } from 'src/app/models/activity.model';
import { ActivityItemAdvancedSelectors } from 'src/app/state/activity-item/activity-item.advanced.selector';
import { ActivityItemSelectors } from 'src/app/state/activity-item/activity-item.selector';
import { LoginSelectors } from 'src/app/state/login/login.selector';
import { ActivitiesService } from '../../activities.service';
import { ActivitySubmissionActions } from 'src/app/state/activity-submission/activity-submission.actions';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-activities-submission',
  templateUrl: './activities-submission.component.html',
  styleUrls: ['./activities-submission.component.css']
})

export class ActivitiesSubmissionComponent implements OnInit, OnDestroy {
  @Input() activity: Activity;
  @Input() activityStatus: ActivityStates;
  translationText: typeof LANGUAGE.activities.ActivitiesSubmissionComponent;
  private translationSubscription: Subscription | undefined;

  submission$: Observable<ActivitySubmission>;

  isEditing = false;
  fetch$ = new BehaviorSubject<boolean>(null);

  userId: number;
  courseId: number;

  public get states(): typeof ActivityStates {
    return ActivityStates;
  }

  constructor(private store: Store, private translationService: TranslationService) { }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesSubmissionComponent
      }
    );
    this.setObservables();
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  setObservables() {

    this.store.select(CourseSelectors.currentId).pipe(
      tap((courseId) => this.courseId = courseId)
    )

    this.submission$ = this.store.select(LoginSelectors.loggedUserId).pipe(
      take(1),
      tap((userId) => this.userId = userId),
      concatMap(userId => this.store.select(ActivityItemAdvancedSelectors.sel.one(
        ActivityItemSelectors.byActivityIdAndUserId({
          activityId: this.activity.id,
          userId
        })
      ))),
      map(item => item.submission)
    )
  }

  cancelEdit() {
    this.isEditing = false;
  }

  closeEdit() {
    this.isEditing = false;
  }

  reload() {
    location.reload();
  }
}
