import * as fromRouter from '@ngrx/router-store';
import { ActivityEvaluationState } from './activity-evaluation/activity-evaluation.state';
import { ActivityItemState } from './activity-item/activity-item.state';
import { ActivitySubmissionState } from './activity-submission/activity-submission.state';
import { ActivityState } from './activity/activity.state';
import { CourseKeyState } from './course-key/course-key.state';
import { CourseState } from './course/course.state';
import { FileUploadedState } from './file-uploaded/file-uploaded.state';
import { GradesConfigState } from './grades-config/grades-config.state';
import { GradesFinalState } from './grades-final/grades-final.state';
import { GradesInfoState } from './grades-info/grades-info.state';
import { LoginState } from './login/login.state';
import { MaterialState } from './material/material.state';
import { ParticipationState } from './participation/participation.state';
import { RoleState } from './role/role.state';
import { SyncState } from './shared/sync/sync.state';
import { UserState } from './user/user.state';
import { WallCommentState } from './wall-comment/wall-comment.state';
import { WallReplyState } from './wall-reply/wall-reply.state';
import { WallPostState } from './wall-post/wall-post.state';
import { MaterialFolderState } from './material-folder/material-folder.state';

export const keysToSync = [
  'login',
  'users',
  'courses',
  'activities',
  'activitySubmissions',
  'activityEvaluations',
  'activityItems',
  'gradesConfigs',
  'gradesInfos',
  'gradesFinals',
  'roles',
  'participation',
  'materials',
  'folders',
  'wallPosts',
  'wallComments',
  'wallReplies',
  'courseKeys',
  'fileUploaded'
];

export interface AppState {
  users: UserState;
  courses: CourseState;
  courseKeys: CourseKeyState;
  syncs: SyncState;
  activities: ActivityState;
  activitySubmissions: ActivitySubmissionState;
  activityEvaluations: ActivityEvaluationState;
  activityItems: ActivityItemState;
  gradesConfigs: GradesConfigState;
  gradesInfos: GradesInfoState;
  gradesFinals: GradesFinalState;
  roles: RoleState;
  participation: ParticipationState;
  materials: MaterialState;
  folders: MaterialFolderState;
  wallPosts: WallPostState;
  wallComments: WallCommentState;
  wallReplies: WallReplyState;
  fileUploaded: FileUploadedState;
  login: LoginState;
  router: fromRouter.RouterReducerState<any>;
}
