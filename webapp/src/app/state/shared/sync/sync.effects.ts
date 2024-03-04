import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, pipe } from 'rxjs';
import { catchError, concatMap, debounceTime, filter, map, mapTo, take, withLatestFrom } from 'rxjs/operators';
import { SyncApiService } from 'src/app/services/api/sync.api.service';
import { toDateString } from '..';
import { ActivityEvaluationActions } from '../../activity-evaluation/activity-evaluation.actions';
import { ActivityItemActions } from '../../activity-item/activity-item.actions';
import { ActivitySubmissionActions } from '../../activity-submission/activity-submission.actions';
import { ActivityActions } from '../../activity/activity.actions';
import { CourseKeyActions } from '../../course-key/course-key.actions';
import { CourseActions } from '../../course/course.actions';
import { FileUploadedActions } from '../../file-uploaded/file-uploaded.actions';
import { GradesConfigActions } from '../../grades-config/grades-config.actions';
import { GradesFinalActions } from '../../grades-final/grades-final.actions';
import { GradesInfoActions } from '../../grades-info/grades-info.actions';
import { LoginActions } from '../../login/login.actions';
import { MaterialActions } from '../../material/material.actions';
import { ParticipationActions } from '../../participation/participation.actions';
import { RoleActions } from '../../role/role.actions';
import { AppState, keysToSync } from '../../state';
import { UserActions } from '../../user/user.actions';
import { WallCommentActions } from '../../wall-comment/wall-comment.actions';
import { WallPostActions } from '../../wall-post/wall-post.actions';
import { SyncActions } from './sync.actions';
import { SyncSelectors } from './sync.selector';
import { MaterialFolderActions } from '../../material-folder/material-folder.actions';
import { WallReplyActions } from '../../wall-reply/wall-reply.actions';


@Injectable()
export class SyncEffects {

  /***************************************** Load Data *****************************************/

  loadAll$ = createEffect(() => this.actions$.pipe(
    ofType(SyncActions.keys.loadAll),
    concatLatestFrom(() => this.api.listKeys()),
    map(([_, savedKeys]) => {
      if (savedKeys.length > 0) {
        return savedKeys.filter(s => keysToSync.includes(s)).map(key => SyncActions.keys.loadOne.request({ input: { key } }));
      }
      else {
        return [SyncActions.keys.saveAll()];
      }
    }),
    concatMap(items => of(...items))
  ));

  loadMany$ = createEffect(() => this.actions$.pipe(
    ofType(SyncActions.keys.loadMany),
    map(({ keys }) => {
      return keys.map(key => SyncActions.keys.loadOne.request({ input: { key } }));
    }),
    concatMap(actions => of(...actions))
  ));


  load$ = createEffect(() => this.actions$.pipe(
    ofType(SyncActions.keys.loadOne.request),
    concatMap(({ input }) =>
      this.api.getItem(input.key).pipe(
        map(keyData => keyData ?
          SyncActions.keys.loadOne.success({ input, data: keyData })
          : SyncActions.keys.loadOne.error({ input, error: 'EMPTY' })
        ),
        catchError((error: any) => of(SyncActions.keys.loadOne.error({ input, error })))
      )
    )
  ));


  loadSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(SyncActions.keys.loadOne.success),
    map(({ data, input }) => {
      const key = input.key;

      switch (key) {
        case 'courses':
          return CourseActions.keyLoaded({ data });
        case 'courseKeys':
          return CourseKeyActions.keyLoaded({ data });
        case 'users':
          return UserActions.keyLoaded({ data });
        case 'activities':
          return ActivityActions.keyLoaded({ data });
        case 'activitySubmissions':
          return ActivitySubmissionActions.keyLoaded({ data });
        case 'activityEvaluations':
          return ActivityEvaluationActions.keyLoaded({ data });
        case 'activityItems':
          return ActivityItemActions.keyLoaded({ data });
        case 'gradesInfos':
          return GradesInfoActions.keyLoaded({ data });
        case 'gradesConfigs':
          return GradesConfigActions.keyLoaded({ data });
        case 'gradesFinals':
          return GradesFinalActions.keyLoaded({ data });
        case 'roles':
          return RoleActions.keyLoaded({ data });
        case 'participation':
          return ParticipationActions.keyLoaded({ data });
        case 'materials':
          return MaterialActions.keyLoaded({ data });
        case 'wallPosts':
          return WallPostActions.keyLoaded({ data });
        case 'wallComments':
          return WallCommentActions.keyLoaded({ data });
        case 'fileUploaded':
          return FileUploadedActions.keyLoaded({ data });
        case 'login':
          return LoginActions.keyLoaded({ data });
        case 'folders':
          return MaterialFolderActions.keyLoaded({ data });
        case 'wallReplies':
          return WallReplyActions.keyLoaded({ data });
        default:
          throw new Error(`Missing the key "${key}" in the switch statement. (sync.effects.ts) `);
      }
    })
  ));


  /***************************************** Save Data *****************************************/

  waitForLoad = <A>() => pipe(
    concatMap((value: A) => this.store.select(SyncSelectors.load.pending).pipe(
      filter(pending => !pending),
      take(1),
      map(_ => value)
    )),
  );

  debounceSave = <A>() => pipe(
    this.waitForLoad<A>(),
    debounceTime(500)
  )


  autoSave$ = createEffect(() => this.store.select(SyncSelectors.toSave).pipe(
    this.debounceSave(),
    map(keys => SyncActions.keys.saveMany({ keys })),
  ));


  saveMany$ = createEffect(() => this.actions$.pipe(
    ofType(SyncActions.keys.saveMany),
    this.waitForLoad(),
    withLatestFrom(this.store),
    concatMap(([{ keys }, stateData]) =>
      of(...keys).pipe(
        map(key => SyncActions.keys.saveOne.request({ input: { key, value: stateData[key] } }))
      )
    )
  ));


  saveOne$ = createEffect(() => this.actions$.pipe(
    ofType(SyncActions.keys.saveOne.request),
    concatMap(({ input }) =>
      this.api.setItem(input.key, input.value).pipe(
        mapTo(SyncActions.keys.saveOne.success({ input, data: null })),
        catchError((error: any) => of(SyncActions.keys.saveOne.error({ input, error })))
      )
    )
  ));


  addSync$ = createEffect(() => this.actions$.pipe(
    ofType(SyncActions.keys.saveOne.success),
    filter(action => action.input.key !== 'syncs'),
    map(action => action.input.key),
    map(key => SyncActions.upsertSync({
      sync: { key, date: toDateString(new Date()) }
    }))
  ));




  constructor(private actions$: Actions, private api: SyncApiService, private store: Store<AppState>) { }
}
