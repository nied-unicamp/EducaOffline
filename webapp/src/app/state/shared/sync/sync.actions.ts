import { createAction, props } from '@ngrx/store';
import { SyncSM } from 'src/app/models/sync.model';
import { ActionTemplates } from '../template.actions';


export const SyncActions = {
  keys: {
    saveAll: createAction('[Sync] Save all keys'),
    saveMany: createAction('[Sync] Save many keys', props<{ keys: string[] }>()),
    saveOne: ActionTemplates.validated.withArgs<{ key: string, value: any }, any>('[Sync] Save specific key'),

    loadAll: createAction('[Sync] Load all Keys'),
    loadMany: createAction('[Sync] Load many keys', props<{ keys: string[] }>()),

    loadOne: ActionTemplates.validated.withArgs<{ key: string }, any>('[Sync] Load specific key'),
    init: createAction('[Sync] Init'),
  },

  upsertSync: createAction('[Sync] Add updated sync info for a key', props<{ sync: SyncSM }>()),
};
