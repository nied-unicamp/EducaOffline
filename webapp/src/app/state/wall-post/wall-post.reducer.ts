import { Action, createReducer, on } from '@ngrx/store';
import { fromArray } from 'src/app/models';
import { fromJsonToWallPostSM, WallPostSM } from 'src/app/models/wall-post.model';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { groupAdapter, groupAddAll, groupAddMany, GroupModel } from '../shared/group/group';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { wallPostOfflineReducer } from './offline/wall-post.offline.reducer';
import { WallPostActions } from './wall-post.actions';
import { wallPostAdapter as adapter, wallPostInitialState as initialState, WallPostState as State, WallPostState } from './wall-post.state';

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(WallPostActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  }),
  on(
    WallPostActions.offline.updated.like.add,
    WallPostActions.offline.updated.like.remove,
    (state, { data }) => {
      return adapter.mapOne({
        id: data.id,
        map: (item) => ({
          ...item, liked: !item.liked,
          likeCounter: item.likeCounter + (item.liked ? -1 : 1)
        })
      }, state);
    }),
  on(
    WallPostActions.offline.updated.pin.ids.add,
    WallPostActions.offline.updated.pin.ids.remove,
    WallPostActions.offline.updated.pin.indirectChanges.add,
    WallPostActions.offline.updated.pin.indirectChanges.remove,
    (state, { data }) => {
      return adapter.mapOne({
        id: data.id,
        map: (item) => ({ ...item, isFixed: !item.isFixed })
      }, state);
    }
  ),
  on(WallPostActions.offline.deleted.add, (state, { data }) => {
    const newState = adapter.mapOne({
      id: data.id,
      map: (item) => ({
        ...item,
        id: -data.id
      })
    }, state)

    const groups = groupAdapter.mapOne({
      id: data.groupId,
      map: (group) => ({
        ...group,
        items: group.items.filter(i => i !== data.id).concat(-data.id)
      })
    }, state.groups)


    const metadata = metadataAdapter<number>().mapOne({
      id: `${MetadataType.Item}/${data.id}`,
      map: (item) => ({
        ...item,
        id: -data.id
      })
    }, state.metadata)

    return { ...newState, groups, metadata };
  }),
  on(WallPostActions.offline.deleted.remove, (state, { data }) => {
    const newState = adapter.mapOne({
      id: -data.id,
      map: (item) => ({
        ...item,
        id: data.id
      })
    }, state)

    const groups = groupAdapter.mapOne({
      id: data.groupId,
      map: (group) => ({
        ...group,
        items: group.items.filter(i => i !== -data.id).concat(data.id)
      })
    }, state.groups)


    const metadata = metadataAdapter<number>().mapOne({
      id: `${MetadataType.Item}/-${data.id}`,
      map: (item) => ({
        ...item,
        id: data.id
      })
    }, state.metadata)

    return { ...newState, groups, metadata };
  }),
  on(WallPostActions.api.byCourse.id.create.success, (state, { input: { body, courseId }, data }) => {
    const dataSM: WallPostSM = fromJsonToWallPostSM(data);

    const statePostsUpdated = adapter.upsertOne(dataSM, state);
    const stateGroupUpdated = groupAddMany({ group: courseId, items: [data.id] }, state.groups);
    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: data.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...statePostsUpdated, groups: stateGroupUpdated, metadata: newMetadata };
  }),
  on(WallPostActions.offline.meta.addPostOffline, (state, { wallPost, idAndGroup}) => {

    const statePostsUpdated = adapter.upsertOne(wallPost, state);
    const stateGroupUpdated = groupAddMany({ group: idAndGroup.groupId, items: [wallPost.id] }, state.groups);
    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: wallPost.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...statePostsUpdated, groups: stateGroupUpdated, metadata: newMetadata };
  }),
  on(WallPostActions.api.byCourse.id.get.all.success, (state, { data, input: { courseId } }) => {
    const dataSM: WallPostSM[] = fromArray(fromJsonToWallPostSM, data);

    const stateWithNewPosts = adapter.addMany(dataSM, state);
    const postsIds = data.map(posts => posts.id);
    const stateGroupUpdated = groupAddAll({ group: courseId, items: postsIds }, state.groups);
    const newMetadata: Metadata<number>[] = postsIds.map(id => (
      { id, lastUpdate: nowString(), type: MetadataType.Item }
    ));
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...stateWithNewPosts, groups: stateGroupUpdated, metadata: stateMetadataUpdated };
  }),
  on(WallPostActions.api.byCourse.id.get.one.success, (state, { input: { id, courseId }, data }) => {
    const dataSM: WallPostSM = fromJsonToWallPostSM(data);

    const statePostsUpdated = adapter.upsertOne(dataSM, state);
    const stateGroupUpdated = groupAddMany({ group: courseId, items: [id] }, state.groups);
    const newMetadata = metadataAdapter<number>().upsertMany([
      { id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...statePostsUpdated, groups: stateGroupUpdated, metadata: newMetadata };
  }),
  on(WallPostActions.api.byCourse.id.like.success, (state, { input }) => {
    const dataSM: WallPostSM = state.entities[input.id];

    if (dataSM.liked === input.to) {
      return state;
    }

    const newData: WallPostSM = {
      ...dataSM,
      liked: input.to,
      likeCounter: dataSM.likeCounter + (input.to ? +1 : -1)
    }

    const statePostsUpdated = adapter.upsertOne(newData, state);
    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: input.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...statePostsUpdated, metadata: newMetadata };
  }),
  on(WallPostActions.api.byCourse.id.favorite.success, (state, { input }) => {
    const dataSM: WallPostSM = state.entities[input.id];

    if (dataSM.favorite === input.to) {
      return state;
    }

    const newData: WallPostSM = {
      ...dataSM,
      favorite: input.to,
      favoriteCounter: dataSM.favoriteCounter + (input.to ? +1 : -1)
    }

    const statePostsUpdated = adapter.upsertOne(newData, state);
    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: input.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...statePostsUpdated, metadata: newMetadata };
  }),
  on(WallPostActions.api.byCourse.id.pin.success, (state, { input }) => {

    let statePostsUpdated = adapter.mapOne({
      id: input.id,
      map: (item) => ({
        ...item,
        isFixed: input.to
      })
    }, state);

    // Remove other fixed posts, since it is defined that only one can be fixed on each course
    if (input.to) {
      const postsFromSameCourse = state.groups.entities[input.courseId].items;
      const oldFixedPostId = postsFromSameCourse.find(i => state.entities[i].isFixed)

      if (oldFixedPostId) {
        statePostsUpdated = adapter.mapOne({
          id: oldFixedPostId,
          map: (item) => ({
            ...item,
            isFixed: false
          })
        }, statePostsUpdated);
      }
    }

    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: input.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...statePostsUpdated, metadata: newMetadata };
  }),
  on(WallPostActions.api.byCourse.id.delete.success, (state, { input }) => {
    const currentGroup = state.groups.entities[input.courseId];
    const newGroup: GroupModel = {
      ...currentGroup,
      items: currentGroup.items.filter(id => id !== input.id)
    }

    const newGroups = groupAdapter.upsertOne(newGroup, state.groups)
    const newMetadata = metadataAdapter<number>().removeOne(
      `${MetadataType.Item}/${input.id}`,
      state.metadata
    );
    const statePostsUpdated = adapter.removeOne(input.id, state);

    return { ...statePostsUpdated, metadata: newMetadata, groups: newGroups };
  }),
);

export function WallPostReducer(state: State | undefined, action: Action) {
  return joinReducers<WallPostSM, WallPostState>(state, action, [
    reducer,
    basicReducer('WallPost', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: wallPostOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}

