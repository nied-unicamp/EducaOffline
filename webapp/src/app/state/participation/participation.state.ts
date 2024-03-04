import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ParticipationSM } from 'src/app/models/participation.model';

export interface ParticipationState extends EntityState<ParticipationSM> { }

export const participationAdapter: EntityAdapter<ParticipationSM> = createEntityAdapter<ParticipationSM>({
  selectId: (p: ParticipationSM) => `${p.courseId}/${p.userId}`
});

export const participationInitialState: ParticipationState = participationAdapter.getInitialState({});
