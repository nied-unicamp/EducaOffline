import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Activity } from 'src/app/models/activity.model';
import { Course } from 'src/app/models/course.model';
import { User } from 'src/app/models/user.model';
import { ActivityAdvancedSelectors } from 'src/app/state/activity/activity.advanced.selector';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { GradesFinalActions } from 'src/app/state/grades-final/grades-final.actions';
import { GradesFinalSelectors } from 'src/app/state/grades-final/grades-final.selector';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { GradesConfigActions } from 'src/app/state/grades-config/grades-config.actions';

@Component({
  selector: 'app-grades-personal',
  templateUrl: './grades-personal.component.html',
  styleUrls: ['./grades-personal.component.css']
})
export class GradesPersonalComponent implements OnInit, OnDestroy {
  translationText: typeof LANGUAGE.grades.GradesPersonalComponent;

  private translationSubscription: Subscription | undefined;

  courseId: number;
  userId: number;

  activitiesWorthNote$: Observable<Activity[]>
  activitiesNotWorthNote$: Observable<Activity[]>
  finalGradeScore$: Observable<string>

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private translationService: TranslationService
  ) {
    this.route.data.subscribe((data: { course: Course, user: User }) => {
      this.courseId = data.course?.id;
      this.userId = data.user?.id;
    })
  }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.grades.GradesPersonalComponent
      }
 	  );
    
    this.store.dispatch(GradesFinalActions.getUserOverview.request({
      input: {
        courseId: this.courseId,
        userId: this.userId
      }
    }));

    this.store.dispatch(GradesConfigActions.get.request({
      input:
        { courseId: this.courseId }
    }));

    var activities$ = this.store.select(
      ActivityAdvancedSelectors.sel.many(
        ActivitySelectors.byCourse.id.all(this.courseId)
      )
    ).pipe(map(all => all.sort(this.sortActivitiesByPublishDate)));

    this.activitiesWorthNote$ = activities$.pipe(
      map(activities => activities.filter((activity: Activity) => activity.gradeWeight !== 0))
    )

    this.activitiesNotWorthNote$ = activities$.pipe(
      map(activities => activities.filter((activity: Activity) => activity.gradeWeight === 0))
      )

    this.finalGradeScore$ = this.store.select(
      GradesFinalSelectors.byCourseIdAndUserId({
        courseId: this.courseId,
        userId: this.userId
      })
    ).pipe(filter(x => !!x), map(grade => parseFloat(grade.score).toFixed(1)));
  }

  private sortActivitiesByPublishDate(a: Activity, b: Activity) {
    // compara por data de publicação primeiramente, se for a mesma usa ordem alfabética.
    return a.publishDate < b.publishDate ? -1 : (a.publishDate > b.publishDate ? 1 : a.title.localeCompare(b.title) );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }
}
