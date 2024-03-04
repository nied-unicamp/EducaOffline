import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Activity } from 'src/app/models/activity.model';
import { ActivityActions } from 'src/app/state/activity/activity.actions';
import { ActivityAdvancedSelectors } from 'src/app/state/activity/activity.advanced.selector';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { ActivitiesService } from './../activities.service';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { GradesFinalActions } from 'src/app/state/grades-final/grades-final.actions';
import { ActivityEvaluationSelectors } from 'src/app/state/activity-evaluation/activity-evaluation.selector';
import { ActivityEvaluationActions } from 'src/app/state/activity-evaluation/activity-evaluation.actions';
import { SharedService } from '../../shared/shared.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';


@Component({
  selector: 'app-activity',
  styleUrls: ['activities.component.css'],
  templateUrl: 'activities.component.html'
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  translationText: typeof LANGUAGE.activities.ActivitiesComponent;
  private translationSubscription: Subscription | undefined;
  activities$: Observable<Activity[]>;
  courseId: number;

  constructor(private store: Store, private sharedService: SharedService, private translationService: TranslationService) {
    this.activities$ = this.store.select(ActivityAdvancedSelectors.sel.many(ActivitySelectors.byCourse.current.all)).pipe(
      map(all => all.sort(this.sortActivitiesByPublishDate))
    );

    this.store.select(CourseSelectors.currentId).subscribe(id => {
      this.courseId = id;
    })
  }

  ngOnInit(): void {

    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesComponent
      }
    );

    this.fetchAll();

    // dispatch a overview of grades to update submissions entities
    if (this.sharedService.hasPermission('get_all_evaluations')) {
      this.store.dispatch(GradesFinalActions.getOverview.request({
        input: {
          courseId: this.courseId
        }
      }))
    }

    // add activity evaluation ids to groups of entities
    this.store.select(ActivityEvaluationSelectors.basic.ids).subscribe((ids) => {
      ids.forEach((id) => {
        this.store.dispatch(ActivityEvaluationActions.addGroup.add.one({
          data: {
            courseId: this.courseId,
            evaluationId: id
          }
        }))
      })
    })
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  fetchAll(): void {
    this.store.dispatch(ActivityActions.fromCurrentCourse.fetchAll.request())
  }

  trackActivity(index: number, activity: Activity) {
    return activity?.id;
  }

  private sortActivitiesByPublishDate(a: Activity, b: Activity) {
    // console.log(a.publishDate == b.publishDate)
    return a.publishDate < b.publishDate ? 1 : (a.publishDate > b.publishDate ? -1 : 0);
  }
}
