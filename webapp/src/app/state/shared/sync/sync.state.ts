import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SyncSM } from 'src/app/models/sync.model';

export interface SyncState extends EntityState<SyncSM> {
  // additional entities state properties
  selectedSyncId: number | null;
  load: {
    loading: string[],
    error: string[]
  };
  toSave: string[];
}

export const SyncAdapter: EntityAdapter<SyncSM> = createEntityAdapter<SyncSM>({
  selectId: (sync: SyncSM) => sync.key
});

export const SyncInitialState: SyncState = SyncAdapter.getInitialState({
  // additional entity state properties
  selectedSyncId: null,
  load: {
    loading: ['login'],
    error: []
  },
  toSave: [],
});
