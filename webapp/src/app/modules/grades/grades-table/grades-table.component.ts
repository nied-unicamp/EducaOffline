import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Activity, ActivityStates } from 'src/app/models/activity.model';
import { filter, map, take } from 'rxjs/operators';
import { ActivityItem } from 'src/app/models/activity-item.model';
import { ActivitiesService } from '../../activities/activities.service';
import { GradesInfoSelectors } from 'src/app/state/grades-info/grades-info.selector';
import { Store } from '@ngrx/store';
import { ActivityItemAdvancedSelectors } from 'src/app/state/activity-item/activity-item.advanced.selector';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute } from '@angular/router';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { LoginSelectors } from 'src/app/state/login/login.selector';

@Component({
  selector: 'app-grades-table',
  templateUrl: './grades-table.component.html',
  styleUrls: ['./grades-table.component.css']
})
export class GradesTableComponent implements OnInit, OnDestroy {
  translationText: typeof LANGUAGE.grades.GradesPersonalComponent;

  private translationSubscription: Subscription | undefined;

  @Input() activities$: Observable<Activity[]>;

  courseId: number;
  items$: Observable<ActivityItem[]>
  
  constructor(private route: ActivatedRoute,
              private store: Store,
              private activitiesService: ActivitiesService,
              private translationService: TranslationService
  ) {
    this.route.data.subscribe((data: {course: Course}) => {
      this.courseId = data.course?.id;
    })
  }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.grades.GradesPersonalComponent
      }
 	  );

    let currentUserId;
    this.store.select(LoginSelectors.loggedUserId).pipe(
      take(1)
    ).subscribe((userId) => currentUserId = userId)

    this.items$ = this.store.select(
      ActivityItemAdvancedSelectors.sel.many(
        ActivityItemAdvancedSelectors.byCourseId(this.courseId)
      )
    ).pipe(map(items => items.filter((item) => item.user.id == currentUserId)));
  }

  getItem$(activity: Activity) {
    return this.items$.pipe(
      map(items => items.find(item => item?.activity?.id === activity?.id)),
      filter((x) => !!x),
      map(item => ({
        item,
        evaluated: !!item?.evaluation?.id,
        submitted: !!item?.submission?.id
      }))
    );
  }

  getStatusText(activity: Activity, item?: ActivityItem) {
    const status = this.activitiesService.getActivityState(activity);

    switch (status) {
      case ActivityStates.GradesReleased:
        return item?.evaluation?.score.toFixed(1);
      case ActivityStates.SubmissionEnded:
        return item?.submission?.id
          ? this.translationText.submitted
          : this.translationText.notSubmitted;
      case ActivityStates.SubmissionStarted:
        return item?.submission?.id
          ? this.translationText.submitting
          : this.translationText.notSubmitting;
      default:
        return '-'
    }
  }

  getGradesReleased(activity: Activity) {
    return this.activitiesService.getActivityState(activity) == ActivityStates.GradesReleased;
  }

  getAverage$(activity: Activity) {
    return this.store.select(GradesInfoSelectors.byId(activity?.id));
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }
}
