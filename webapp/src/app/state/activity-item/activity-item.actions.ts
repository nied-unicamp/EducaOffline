import { createAction, props } from '@ngrx/store';
import { ActivityItemJson, ActivityItemSM } from 'src/app/models/activity-item.model';
import { ActionTemplates } from '../shared/template.actions';
import { ActivityItemState } from './activity-item.state';
import { activityItemOfflineActions } from './offline/activity-item.offline.actions';


export const ActivityItemActions = {
  keyLoaded: ActionTemplates.keyLoaded<ActivityItemState>('ActivityItem'),

  fetchAll: ActionTemplates.validated.withArgs<{ courseId: number, activityId: number }, ActivityItemJson[]>('[ ActivityItem / API ] Load all activities items for an activity'),

  indirectlyUpsert: createAction('[ ActivityItem] Indirectly upsert many activity items', props<{ items: ActivityItemSM[] }>()),

  basic: ActionTemplates.basicActions('ActivityItem'),

  offline: activityItemOfflineActions
};
