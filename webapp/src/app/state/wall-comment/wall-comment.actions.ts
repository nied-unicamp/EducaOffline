import { WallCommentForm, WallCommentJson, WallCommentSM } from 'src/app/models/wall-comment.model';
import { ActionTemplates } from '../shared/template.actions';
import { WallCommentOfflineActions } from './offline/wall-comment.offline.actions';
import { WallCommentState } from './wall-comment.state';
import { createAction, props } from '@ngrx/store';


export const WallCommentActions = {
  keyLoaded: ActionTemplates.keyLoaded<WallCommentState>('WallComments'),

  fetchAll: ActionTemplates.validated.withArgs<{ postId: number, courseId: number }, WallCommentJson[]>('[ WallComments / API ] Load all comments for a post'),
  
  create: ActionTemplates.validated.withArgs<{ body: WallCommentForm, postId: number, courseId: number, commentId: number}, WallCommentJson>('[ WallComments / API ] Create a comment'),
 
  delete: ActionTemplates.validated.withArgs<{ commentId: number, postId: number, courseId: number }, WallCommentJson>('[ WallComments / API ] Delete a comment'),

  like: ActionTemplates.validated.withArgs<{ to: boolean, commentId: number, postId: number, courseId: number }, void>('[ WallComments / API ] Toggle like on comment'),

  offline: WallCommentOfflineActions,
  basic: ActionTemplates.basicActions<WallCommentSM>('WallComment'),
};


