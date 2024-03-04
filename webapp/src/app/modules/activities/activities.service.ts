import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { Activity, ActivityFilter, ActivitySM, ActivityStates } from 'src/app/models/activity.model';
import { ActivityActions } from 'src/app/state/activity/activity.actions';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { SharedService } from './../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  static translationText = LANGUAGE.activities;
  private filter$ = new BehaviorSubject(ActivityFilter.NoFilter);

  activity$: Observable<ActivitySM>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private sharedService: SharedService
  ) {
    this.activity$ = this.store.select(ActivitySelectors.current.entity);

    this.route.paramMap.pipe(
      map(p => Number(p.get('activityId'))),
      tap(id => this.store.dispatch(ActivityActions.select({ id })))
    ).subscribe()

  }


  updateFilter(filter: ActivityFilter) {
    this.filter$.next(filter);
  }

  getFilteredActivities(activities: Activity[]): Observable<Activity[]> {

    return this.filter$.pipe(map((filter: ActivityFilter) => {
      console.log('Activity filter not implemented.');
      return activities;
    }));
  }

  getFilters(): ActivityFilter[] {
    const list: ActivityFilter[] = [];

    list.push(ActivityFilter.NoFilter, ActivityFilter.Ended);

    if (this.sharedService.hasPermission('create_activities')) {
      list.push(ActivityFilter.ToEvaluate);
    }

    if (this.sharedService.hasPermission('create_activity_submissions')) {
      list.push(ActivityFilter.ToDo, ActivityFilter.Done);
    }

    return list;
  }

  getActivityState(activity: Activity) {
    const now = new Date();

    if (!activity?.id) {
      return -1;
    }

    if (activity.gradesReleaseDate && activity.gradesReleaseDate < now) {
      return ActivityStates.GradesReleased;
    }

    if (activity.submissionEnd.getTime() < now.getTime()) {
      return ActivityStates.SubmissionEnded;
    }

    if (activity.submissionBegin < now) {
      return ActivityStates.SubmissionStarted;
    }

    if (activity.publishDate < now) {
      return ActivityStates.Published;
    }

    return ActivityStates.Scheduled;
  }
}
