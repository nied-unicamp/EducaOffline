import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { GradesConfigSM } from 'src/app/models/grades-config.model';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';

export interface GradesConfigState extends EntityState<GradesConfigSM> {
  metadata: MetadataState<number>;
}

export const gradesConfigAdapter: EntityAdapter<GradesConfigSM> = createEntityAdapter<GradesConfigSM>();

export const GradesConfigInitialState: GradesConfigState = gradesConfigAdapter.getInitialState({
  metadata: metadataAdapter<number>().getInitialState(),
});
