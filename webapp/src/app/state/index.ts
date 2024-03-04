import { Dictionary } from '@ngrx/entity';
import * as fromRouter from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, DefaultProjectorFn, MemoizedSelector, MetaReducer } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { ActivityEvaluationEffects } from './activity-evaluation/activity-evaluation.effects';
import { ActivityEvaluationReducer } from './activity-evaluation/activity-evaluation.reducer';
import { ActivityItemEffects } from './activity-item/activity-item.effects';
import { ActivityItemReducer } from './activity-item/activity-item.reducer';
import { ActivitySubmissionEffects } from './activity-submission/activity-submission.effects';
import { ActivitySubmissionReducer } from './activity-submission/activity-submission.reducer';
import { ActivityEffects } from './activity/activity.effects';
import { ActivityReducer } from './activity/activity.reducer';
import { CourseKeyApiEffects } from './course-key/course-key.api.effects';
import { CourseKeyEffects } from './course-key/course-key.effects';
import { CourseKeyOfflineEffects } from './course-key/course-key.offline.effects';
import { CourseKeyReducer } from './course-key/course-key.reducer';
import { CourseApiEffects } from './course/course.api.effects';
import { CourseEffects } from './course/course.effects';
import { CourseReducer } from './course/course.reducer';
import { CourseOfflineEffects } from './course/offline/course.offline.effects';
import { FileUploadedEffects } from './file-uploaded/file-uploaded.effects';
import { FileUploadedReducer } from './file-uploaded/file-uploaded.reducer';
import { FileUploadedOfflineEffects } from './file-uploaded/offline/file-uploaded.offline.effects';
import { GradesConfigEffects } from './grades-config/grades-config.effects';
import { GradesConfigReducer } from './grades-config/grades-config.reducer';
import { GradesFinalEffects } from './grades-final/grades-final.effects';
import { GradesFinalReducer } from './grades-final/grades-final.reducer';
import { GradesInfoEffects } from './grades-info/grades-info.effects';
import { GradesInfoReducer } from './grades-info/grades-info.reducer';
import { LoginEffects } from './login/login.effects';
import { LoginReducer } from './login/login.reducer';
import { MaterialEffects } from './material/material.effects';
import { MaterialReducer } from './material/material.reducer';
import { MaterialOfflineEffects } from './material/offline/material.offline.effects';
import { MaterialFolderOfflineEffects } from './material-folder/offline/material-folder.offline.effects';
import { ParticipationEffects } from './participation/participation.effects';
import { ParticipationReducer } from './participation/participation.reducer';
import { RoleEffects } from './role/role.effects';
import { RoleReducer } from './role/role.reducer';
import { SyncEffects } from './shared/sync/sync.effects';
import { SyncReducer } from './shared/sync/sync.reducer';
import { SyncState } from './shared/sync/sync.state';
import { AppState } from './state';
import { UserEffects } from './user/user.effects';
import { UserReducer } from './user/user.reducer';
import { WallCommentOfflineEffects } from './wall-comment/offline/wall-comment.offline.effects';
import { WallCommentsEffects } from './wall-comment/wall-comment.effects';
import { WallCommentReducer } from './wall-comment/wall-comment.reducer';
import { WallReplyOfflineEffects } from 'src/app/state/wall-reply/offline/wall-reply.offline.effects';
import { WallRepliesEffects } from './wall-reply/wall-reply.effects';
import { WallReplyReducer } from './wall-reply/wall-reply.reducer';
import { WallPostOfflineEffects } from './wall-post/offline/wall-post.offline.effects';
import { WallPostEffects } from './wall-post/wall-post.effects';
import { WallPostReducer } from './wall-post/wall-post.reducer';
import { ActivityEvaluationOfflineEffects } from './activity-evaluation/offline/activity-evaluation.offline.effects';
import { MaterialFolderReducer } from './material-folder/material-folder.reducer';
import { MaterialFolderEffects } from './material-folder/material-folder.effects';
import { ActivityOfflineEffects } from './activity/offline/activity.offline.effects';
import { ActivitySubmissionOfflineEffects } from './activity-submission/offline/activity-submission.offline.effects';
import { ActivityItemOfflineEffects } from './activity-item/offline/activity-item.offline.effects';
import { UserOfflineEffects } from './user/offline/user.offline.effects';


export const reducers: ActionReducerMap<AppState> = {
  users: UserReducer,
  courses: CourseReducer,
  courseKeys: CourseKeyReducer,
  syncs: SyncReducer,
  activities: ActivityReducer,
  activitySubmissions: ActivitySubmissionReducer,
  activityEvaluations: ActivityEvaluationReducer,
  activityItems: ActivityItemReducer,
  gradesConfigs: GradesConfigReducer,
  gradesInfos: GradesInfoReducer,
  gradesFinals: GradesFinalReducer,
  roles: RoleReducer,
  participation: ParticipationReducer,
  materials: MaterialReducer,
  folders: MaterialFolderReducer,
  wallPosts: WallPostReducer,
  wallComments: WallCommentReducer,
  wallReplies: WallReplyReducer,
  fileUploaded: FileUploadedReducer,
  login: LoginReducer,
  router: fromRouter.routerReducer
};

export const effects = [
  SyncEffects,
  UserEffects, UserOfflineEffects,
  CourseEffects, CourseApiEffects, CourseOfflineEffects,
  CourseKeyEffects, CourseKeyApiEffects, CourseKeyOfflineEffects,
  ActivityEffects, ActivityOfflineEffects, ActivitySubmissionEffects, ActivitySubmissionOfflineEffects,
  ActivityEvaluationEffects, ActivityItemEffects, ActivityItemOfflineEffects, ActivityEvaluationOfflineEffects,
  GradesConfigEffects, GradesInfoEffects, GradesFinalEffects,
  RoleEffects,
  ParticipationEffects,
  FileUploadedEffects, FileUploadedOfflineEffects,
  MaterialEffects, MaterialOfflineEffects,
  MaterialFolderEffects, MaterialFolderOfflineEffects,
  WallPostEffects, WallPostOfflineEffects,
  WallCommentsEffects, WallCommentOfflineEffects,
  WallRepliesEffects,
  WallReplyOfflineEffects,
  LoginEffects,
];

// MetaReducer to console.log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}


// MetaReducer to console.log all actions
export function setToSync(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    const result = reducer(state, action);

    if (!result || !state) {
      return result;
    }

    const keys = Object.keys(result).filter(key => key !== 'syncs' && key !== 'router');
    const keysToSync = keys.filter(key => !deepEqual(result[key], state[key]))


    if (keysToSync.length === 0) {
      return result;
    }


    const newToSave = result.syncs.toSave.filter(s => !keysToSync.includes(s)).concat(keysToSync);

    const newSyncs: SyncState = {
      ...result.syncs,
      toSave: newToSave
    };

    return { ...result, syncs: newSyncs };
  };
}



// Add debug metaReducer if flag is activated
export const metaReducers: MetaReducer<AppState>[] = [setToSync];
// export const metaReducers: MetaReducer<AppState>[] = [setToSync, debug];

// environment.production ? [] : [debug]

// Convert entity map to array
export const asArray = <T>(obj: Dictionary<T>) => obj ? Object.values(obj) : [];


export type Selector<A> = MemoizedSelector<AppState, A, DefaultProjectorFn<A>>
export type MetaSelector<Input, Output> = (selector: Selector<Input>) => Selector<Output>
