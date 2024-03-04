import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { GradesInfoSM } from 'src/app/models/grades-info.model';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';

export interface GradesInfoState extends EntityState<GradesInfoSM> {
  metadata: MetadataState<number>;
}

export const gradesInfoAdapter: EntityAdapter<GradesInfoSM> = createEntityAdapter<GradesInfoSM>({
  selectId: (gradesInfo: GradesInfoSM) => gradesInfo.activityId,
});

export const GradesInfoInitialState: GradesInfoState = gradesInfoAdapter.getInitialState({
  metadata: metadataAdapter<number>().getInitialState(),
});
