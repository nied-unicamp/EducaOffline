import { createAction, props } from '@ngrx/store';

import { WallReply, WallReplyForm, WallReplyJson, WallReplySM  } from 'src/app/models/wall-comment.model';
import { ActionTemplates } from '../shared/template.actions';
import { WallReplyOfflineActions } from './offline/wall-reply.offline.actions';
import { WallReplyState } from './wall-reply.state';



export const WallReplyActions = {
    request: createAction('[WallReply] Fetch All Replies Request', props<{ commentId: number}>()),
    success: createAction('[WallReply] Fetch All Replies Success', props<{ commentId: number; replies: WallReply[]}>()),
    error: createAction('[WallReply] Fetch All Replies Error', props<{ commentId: number; error: any}>()),
    fetchAll: ActionTemplates.validated.withArgs<{ postId: number, courseId: number, commentId: number }, WallReplyJson[] >('[ WallReplies / API ] Load all replies of a comment'),
    createReply: ActionTemplates.validated.withArgs<{ body: WallReplyForm, postId: number, courseId: number, commentId: number }, WallReplyJson>('[ WallReplies / API ] Create a reply'),
    offline: WallReplyOfflineActions,
    delete: ActionTemplates.validated.withArgs<{ postId: number, courseId: number, replyId: number }, WallReplyJson>('[ WallReplies / API ] Delete a reply'),
    basic: ActionTemplates.basicActions<WallReplySM>('WallReply'),
    keyLoaded: ActionTemplates.keyLoaded<WallReplyState>('WallReplies'),
  }