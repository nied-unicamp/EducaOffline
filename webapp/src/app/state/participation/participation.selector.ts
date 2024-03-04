import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ParticipationSM } from 'src/app/models/participation.model';
import { matchPartial } from '../shared';
import { UserSelectors } from '../user/user.selector';
import { participationAdapter as adapter, ParticipationState as State } from './participation.state';

// Feature selector
const selectParticipationState = createFeatureSelector<State>('participation');

// Selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();


const selectState = selectParticipationState;


// Composed selectors
const selectParticipationIds = createSelector(
  selectState,
  selectIds
);
const selectParticipationEntities = createSelector(
  selectState,
  selectEntities
);
const selectAllParticipation = createSelector(
  selectState,
  selectAll
);
const selectParticipationTotal = createSelector(
  selectState,
  selectTotal
);

const selectById = (id: string) => createSelector(
  selectEntities,
  (entities) => entities[id]
);



const selectByPartial = (data: Partial<ParticipationSM>) => createSelector(
  selectAllParticipation,
  (all) => matchPartial(all, data)
);

const selectOfCurrentUser = createSelector(
  selectAllParticipation,
  UserSelectors.current,
  (participation, user) => user?.id ? participation.filter(p => p.userId === user.id) : []
)

const selectAllOfCourseId = (courseId: number) => createSelector(
  selectAllParticipation,
  (participation) => participation.filter(p => p.courseId === courseId)
)

const selectOfCurrentUserAndRoleId = (roleId: number) => createSelector(
  selectOfCurrentUser,
  (participation) => participation.filter(p => p.roleId === roleId)
)

export const ParticipationSelectors = {
  state: selectState,
  ids: selectParticipationIds,
  entities: selectParticipationEntities,
  all: selectAllParticipation,
  total: selectParticipationTotal,
  byId: selectById,
  byCourseId: selectAllOfCourseId,
  ofCurrentUser: selectOfCurrentUser,
  ofCurrentUserAndRoleId: selectOfCurrentUserAndRoleId,
  byPartial: (partial: Partial<ParticipationSM>) => selectByPartial(partial),
};
