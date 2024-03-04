import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { concatMap, filter, map, take, tap } from 'rxjs/operators';
import { Activity, ActivityStates } from 'src/app/models/activity.model';
import { ActivityActions } from 'src/app/state/activity/activity.actions';
import { ActivityAdvancedSelectors } from 'src/app/state/activity/activity.advanced.selector';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { selectRouteParam } from 'src/app/state/router/router.selector';
import { ActivitiesService } from './../activities.service';
import { SharedModule } from '../../shared/shared.module';
import { ActivityItemActions } from 'src/app/state/activity-item/activity-item.actions';
import { ActivitySubmissionActions } from 'src/app/state/activity-submission/activity-submission.actions';
import { ActivityItemSelectors } from 'src/app/state/activity-item/activity-item.selector';
import { LoginSelectors } from 'src/app/state/login/login.selector';
import { LANGUAGE } from '../../../dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

interface ActivityDescriptionPermissions {
  editActivity: boolean;
  deleteActivity: boolean;
  submit: boolean;
  listSubmissions: boolean;
}

@Component({
  selector: 'app-activities-description',
  templateUrl: './activities-description.component.html',
  styleUrls: ['./activities-description.component.css']
})
export class ActivitiesDescriptionComponent implements OnInit, OnDestroy {

  translationText: typeof LANGUAGE.activities.ActivitiesDescriptionComponent;
  private translationSubscription: Subscription | undefined;
  permissions$: Observable<ActivityDescriptionPermissions>;

  courseId$: Observable<number>;
  courseIdNumber: number;

  activity$: Observable<Activity>;
  activityStatus$: Observable<ActivityStates>;
  activity: Activity;

  submissionId: number;
  userId: number;

  descriptionIsHidden = false;

  public get states(): typeof ActivityStates {
    return ActivityStates;
  }

  constructor(
    private router: Router,
    private store: Store,
    private actions: Actions,
    private translationService: TranslationService
  ) {


  }


  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesDescriptionComponent
      }
    );

    this.setPermissionObservables();
    this.setActivityObservables();
    this.activity$.subscribe((activity) => this.activity = activity);
    this.courseId$.subscribe(courseId => this.courseIdNumber = courseId);

    combineLatest([
      this.store.select(selectRouteParam('activityId')).pipe(map(id => Number(id))),
      this.store.select(selectRouteParam('courseId')).pipe(map(id => Number(id))),
    ]).pipe(
      take(1),
      tap(([id, courseId]) => {
        this.store.dispatch(ActivityActions.fetchOne.request({ input: { id, courseId } }))
        this.store.dispatch(ActivityActions.listFiles.request({ input: { id, courseId } }))
      })
    ).subscribe();
    
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  toggleVisibility() {
    this.descriptionIsHidden = !this.descriptionIsHidden;
  }

  delete(willDelete: boolean) {
    if (willDelete) {
      combineLatest([this.courseId$, this.activity$]).pipe(
        take(1),
        tap(([courseId, activity]) => {
          this.store.dispatch(ActivityActions.delete.request({
            input: {
              courseId,
              id: activity.id
            }
          }))
        }),
        concatMap(([courseId, activity]) => this.actions.pipe(
          ofType(ActivityActions.delete.success),
          filter(({ input }) => input.courseId === courseId && input.id === activity.id),
          take(1),
          tap(_ => this.router.navigate(['courses', courseId, 'activities']))
        ))
      ).subscribe();
    }
  }

  setActivityObservables() {
    this.courseId$ = this.store.select(CourseSelectors.currentId).pipe(map(id => Number(id)))
    this.activity$ = this.store.select(ActivityAdvancedSelectors.sel.one(ActivitySelectors.current.entity))

    this.activityStatus$ = this.activity$.pipe(
      map(activity => {
        const now = new Date();
        let state: ActivityStates;

        if (!activity?.id) {
          return ActivityStates.Empty;
        }

        if (activity.gradesReleaseDate && activity.gradesReleaseDate < now) {
          state = ActivityStates.GradesReleased;
        } else if (activity.submissionEnd < now) {
          state = ActivityStates.SubmissionEnded;
        } else if (activity.submissionBegin < now) {
          state = ActivityStates.SubmissionStarted;
        } else if (activity.publishDate < now) {
          state = ActivityStates.Published;
        } else {
          state = ActivityStates.Scheduled;
        }

        return state;
      })
    );
  }

  setPermissionObservables() {
    this.permissions$ = combineLatest([
      this.store.select(ParticipationAdvancedSelectors.hasPermission('delete_activities')),
      this.store.select(ParticipationAdvancedSelectors.hasPermission('update_activities')),
      this.store.select(ParticipationAdvancedSelectors.hasPermission('list_all_submissions')),
      this.store.select(ParticipationAdvancedSelectors.hasPermission('create_activity_submissions'))
    ]).pipe(
      map(([deleteActivity, editActivity, listSubmissions, submit]) =>
        ({ deleteActivity, editActivity, listSubmissions, submit })
      )
    )
  
  }

  backToTasks() {
    this.router.navigate(['courses', this.courseIdNumber, 'activities'])
  }
}
