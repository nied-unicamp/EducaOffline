import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { ActivitySM, fromJsonToActivitySM, patchActivityFiles } from 'src/app/models/activity.model';
import { ActivityActions } from 'src/app/state/activity/activity.actions';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { ActivitiesApiService } from '../api/activities.api.service';


@Injectable({
  providedIn: 'root'
})
export class ActivityResolverService implements Resolve<ActivitySM> {

  constructor(private store: Store, private router: Router, private activitiesApiService: ActivitiesApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<ActivitySM> | ActivitySM {
    const activityId = Number(route.paramMap.get('activityId'));
    const courseId = Number(route.paramMap.get('courseId'));

    return this.store.select(ActivitySelectors.byCourse.id.ids(courseId)).pipe(
      take(1),
      map(ids => {
        if (!ids?.some(id => id == activityId)) {
          throw new Error('No activity found');
        }
      }),
      concatMap(id =>
        this.store.select(
          ActivitySelectors.byId(activityId)
        ).pipe(
          take(1),
          tap(activity => {
            if (!activity?.id) {
              throw new Error('No activity found');
            }

            this.store.dispatch(ActivityActions.select({ id: activityId }))
          })
        )
      ),
      catchError(_ => {
        return this.activitiesApiService.getActivity({ activityId, courseId }).pipe(
          map(data => {
            this.store.dispatch(ActivityActions.fetchOne.success({ input: { id: activityId, courseId }, data: patchActivityFiles(data, courseId) }))
            this.store.dispatch(ActivityActions.select({ id: activityId }))

            return fromJsonToActivitySM(data)
          }),
          catchError((err) => {

            console.log('Could not get activity from server. Navigating to activities list.');

            // Return to list all activities
            this.router.navigate(['courses', courseId, 'activities']);

            return of(null);
          })
        );
      })
    )
  }
}
