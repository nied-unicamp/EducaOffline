import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, interval, of } from 'rxjs';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { ActivityActions } from '../activity/activity.actions';
import { ActivitySelectors } from '../activity/activity.selector';
import { LoginSelectors } from '../login/login.selector';
import { MaterialActions } from '../material/material.actions';
import { MaterialSelectors } from '../material/material.selector';
import { ParticipationActions } from '../participation/participation.actions';
import { GroupModel } from '../shared/group/group';
import { WallPostActions } from '../wall-post/wall-post.actions';
import { WallPostSelectors } from '../wall-post/wall-post.selector';
import { CourseSelectors } from './course.selector';
import { MaterialFolderActions } from '../material-folder/material-folder.actions';


@Injectable()
export class CourseEffects {
  poolingInterval = 15 * 1000; // ms

  doesItNeedToUpdate = (group: GroupModel) => {
    const syncInterval = 2 * 60 * 1000; // ms

    if (!group) {
      return true
    }

    const lastUpdate = new Date(group.lastUpdate).getTime()
    const now = new Date().getTime()

    if (lastUpdate + syncInterval < now) {
      return true
    }

    return false
  };


  syncCourse$ = createEffect(() => combineLatest([
    this.store.select(CourseSelectors.sync.enabledList),
    interval(this.poolingInterval).pipe(
      withLatestFrom(this.store.select(LoginSelectors.isOffline)),
      filter(([_, isOffline]) => !isOffline)
    ),
  ]).pipe(
    concatMap(([courses, _]) => of(...courses.map(c => c.id))),
    concatMap(id => of(id).pipe(
      withLatestFrom(
        this.store.select(WallPostSelectors.group.byId(id)).pipe(
          map(group => this.doesItNeedToUpdate(group))
        ),
        this.store.select(MaterialSelectors.group.byId(id)).pipe(
          map(group => this.doesItNeedToUpdate(group))
        ),
        this.store.select(ActivitySelectors.group.byId(id)).pipe(
          map(group => this.doesItNeedToUpdate(group))
        )
      ),
      map(([id, ...need]) => {
        if (!need.includes(true)) {
          return []
        }

        return [
          ParticipationActions.fetchAllUsersWithRoles.request({ input: { courseId: id } }),
          WallPostActions.api.byCourse.id.get.all.request({ input: { courseId: id } }),
          MaterialActions.fetchAll.request({ input: { courseId: id } }),
          MaterialFolderActions.fetchAll.request({ input: { courseId: id } }),
          ActivityActions.fetchAll.request({ input: { courseId: id } }),
        ];
      }),
    )),
    concatMap(actions => of(...actions))
  ))

  constructor(private store: Store, private actions$: Actions) { }
}
