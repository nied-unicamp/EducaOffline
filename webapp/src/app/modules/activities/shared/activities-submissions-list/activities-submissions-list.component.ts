import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivitySubmission } from 'src/app/models/activity-submission.model';
import { Activity } from 'src/app/models/activity.model';
import { Course } from 'src/app/models/course.model';
import { ActivityItemAdvancedSelectors } from 'src/app/state/activity-item/activity-item.advanced.selector';
import { ActivityItemSelectors } from 'src/app/state/activity-item/activity-item.selector';
import { ActivitySubmissionActions } from 'src/app/state/activity-submission/activity-submission.actions';
import { ActivitiesService } from '../../activities.service';
import { LANGUAGE } from '../../../../dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-activities-submissions-list',
  templateUrl: './activities-submissions-list.component.html',
  styleUrls: ['./activities-submissions-list.component.css']
})
export class ActivitiesSubmissionsListComponent implements OnInit, OnDestroy{
  @Input() activityId: number;

  translationText: typeof LANGUAGE.activities.ActivitiesSubmissionsListComponent;
  private translationSubscription: Subscription | undefined;

  submissions$: Observable<ActivitySubmission[]>


  /**
   * Screen size for a responsive view
   */
  screenSize: 'small' | 'normal' | 'big' = 'big';

  constructor(private route: ActivatedRoute, private store: Store, private translationService: TranslationService) {

    this.route.data.subscribe((data: { course: Course, activity: Activity }) => {
      this.activityId = data.activity?.id;
      const courseId = data.course?.id;

      this.store.dispatch(ActivitySubmissionActions.getAll.request({
        input: {
          activityId: this.activityId,
          courseId: courseId
        }
      }))

      this.submissions$ = this.store.select(ActivityItemAdvancedSelectors.sel.many(
        ActivityItemSelectors.byActivityId(this.activityId)
      )).pipe(
        map(value => value.map(item => item.submission).filter(sub => sub?.id))
      )
    });
  }

  ngOnInit(): void {

    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesSubmissionsListComponent
      }
    );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
}


  reload() {
    location.reload();
  }

  @HostListener('window:resize', ['$event'])
  updateScreenSize(event) {
    // const size = event.target.innerWidth;
    const screenSize = window.screen.availWidth;

    if (screenSize > 500) {
      this.screenSize = 'big';
    } else {
      this.screenSize = 'small';
    }
  }
}
