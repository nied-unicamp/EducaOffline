import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState } from "../../state";
import { ActivityItemActions } from "../activity-item.actions";
import { concatMap, filter, map, take, withLatestFrom } from "rxjs/operators";
import { LoginSelectors } from "../../login/login.selector";
import { ActivityItemOfflineSelectors } from "./activity-item.offline.selectors";
import { OfflineRequestType } from "../../shared/offline/offline.state";
import { of } from "rxjs";
import { CourseSelectors } from "../../course/course.selector";

@Injectable()
export class ActivityItemOfflineEffects {
  
    fetchAllOffline$ = createEffect(() => this.actions$.pipe(
        ofType(ActivityItemActions.fetchAll.offlineError),
        map(({ input }) => ActivityItemActions.offline.requested.groupIds.add.one({ data: input.activityId }))
    ));

    // ------------------------------------------------
    // ------------------------------------------------
    // SYNC
    // ------------------------------------------------
    // ------------------------------------------------

    autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
        filter(isOffline => !isOffline),
        withLatestFrom(this.store.select(ActivityItemOfflineSelectors.nextAction)),
        filter(([_, type]) => type !== OfflineRequestType.None),
        map(_ => ActivityItemActions.offline.sync.syncAll())
    ))

    syncAll$ = createEffect(() => this.actions$.pipe(
        ofType(ActivityItemActions.offline.sync.syncAll),
        concatMap(_ => of(
            ActivityItemActions.offline.sync.requested.syncAll(),
    ))
    ));

    // --------------------------------------------------------------
    //  Requested

    syncRequestedSyncAll$ = createEffect(() => this.actions$.pipe(
        ofType(ActivityItemActions.offline.sync.requested.syncAll),
        concatMap((_) => this.store.select(ActivityItemOfflineSelectors.requested.groups).pipe(
            take(1),
            concatMap(groups => of(...groups).pipe(
            map(groupId => ActivityItemActions.offline.sync.requested.groupById({ input: { groupId } }))),
            ),
        ))
    ));

    syncRequestedGroupById$ = createEffect(() => this.actions$.pipe(
        ofType(ActivityItemActions.offline.sync.requested.groupById),
        map(({ input: { groupId } }) => {

            let courseId: number;
            this.store.select(CourseSelectors.currentId).subscribe(id => courseId = id);

            return [
                ActivityItemActions.offline.requested.groupIds.remove.one({ data: groupId }),
                ActivityItemActions.fetchAll.request({
                input: {
                    courseId: courseId,
                    activityId: groupId
                }
                })
            ]
        }),
        concatMap(actions => of(...actions))
    ));

  constructor(private actions$: Actions, private store: Store<AppState>) { }
}