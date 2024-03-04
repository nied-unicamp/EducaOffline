import { createAction, props } from '@ngrx/store';
import { WallPostForm, WallPostJson, WallPostSM } from 'src/app/models/wall-post.model';
import { ActionTemplates } from '../shared/template.actions';
import { WallPostOfflineActions } from './offline/wall-post.offline.actions';
import { WallPostState } from './wall-post.state';


export const WallPostActions = {
  keyLoaded: ActionTemplates.keyLoaded<WallPostState>('WallPosts'),

  api: {
    byCourse: {
      current: {
        create: ActionTemplates.validated.withArgs<{ body: WallPostForm }, WallPostJson>('[ WallPost / API / Current Course ] Create WallPost'),

        get: {
          all: ActionTemplates.validated.noArgs<WallPostJson[]>('[ WallPosts / API / Current Course ] Load all posts from the current course'),
          one: ActionTemplates.validated.withArgs<{ id: number }, WallPostJson>('[ WallPosts / API / Current Course ] Load one post by id and courseId'),
        },

        delete: ActionTemplates.validated.withArgs<{ id: number }, void>('[ WallPosts / API / Current Course ] Delete a post'),

        favorite: ActionTemplates.validated.withArgs<{ id: number, to: boolean }, void>('[ WallPosts / API / Current Course ] Favorite post'),
        like: ActionTemplates.validated.withArgs<{ id: number, to: boolean }, void>('[ WallPosts / API / Current Course ] Like post'),
        pin: ActionTemplates.validated.withArgs<{ id: number, to: boolean }, WallPostJson>('[ WallPosts / API / Current Course ] Pin post'),
      },
      id: {
        create: ActionTemplates.validated.withArgs<{ courseId: number, body: WallPostForm }, WallPostJson>('[ WallPost / API ] Create WallPost'),
        createWithActivityId: ActionTemplates.validated.withArgs<{ courseId: number, activityId: number, body: WallPostForm }, WallPostJson>('[ WallPost / API ] Create WallPost with activityId'),
        createWithCreatedById: ActionTemplates.validated.withArgs<{ courseId: number, userId: number, body: WallPostForm }, WallPostJson>('[ WallPost / API ] Create WallPost with createdById'),
        get: {
          all: ActionTemplates.validated.withArgs<{ courseId: number }, WallPostJson[]>('[ WallPosts / API ] Load all posts from a course'),
          one: ActionTemplates.validated.withArgs<{ id: number, courseId: number }, WallPostJson>('[ WallPosts / API ] Load one post by id and courseId'),
        },
        fetchActivityPosts: ActionTemplates.validated.withArgs<{ courseId: number }, WallPostJson[]>('[ WallPosts / API ] Load all activity posts from a course'),
        delete: ActionTemplates.validated.withArgs<{ id: number, courseId: number }, void>('[ WallPosts / API ] Delete a post'),

        favorite: ActionTemplates.validated.withArgs<{ to: boolean, courseId: number, id: number }, void>('[ WallPosts / API ] Favorite post'),
        like: ActionTemplates.validated.withArgs<{ to: boolean, courseId: number, id: number }, void>('[ WallPosts / API ] Like post'),
        pin: ActionTemplates.validated.withArgs<{ to: boolean, courseId: number, id: number }, void>('[ WallPosts / API ] Pin post'),
      },
    },
  },

  basic: ActionTemplates.basicActions<WallPostSM>('WallPost'),

  select: createAction('[WallPost] Select Id', props<{ id: number }>()),

  offline: WallPostOfflineActions
};
