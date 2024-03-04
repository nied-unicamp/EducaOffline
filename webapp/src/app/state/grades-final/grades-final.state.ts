import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { GradesFinalSM } from 'src/app/models/grades-final.model';
import { metadataAdapter, MetadataState } from '../shared/metadata/metadata';

export interface GradesFinalState extends EntityState<GradesFinalSM> {
  metadata: MetadataState<string>;
}

export const gradesFinalAdapter: EntityAdapter<GradesFinalSM> = createEntityAdapter<GradesFinalSM>({
  selectId: (final: GradesFinalSM) => `${final.courseId}/${final.userId}`
});

export const getGradesFinalId = gradesFinalAdapter.selectId as (final: GradesFinalSM) => string;


export const GradesFinalInitialState: GradesFinalState = gradesFinalAdapter.getInitialState({
  metadata: metadataAdapter<string>().getInitialState(),
});
