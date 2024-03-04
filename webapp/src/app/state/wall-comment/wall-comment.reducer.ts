import { Action, createReducer, on } from '@ngrx/store';
import { fromArray } from 'src/app/models';
import { fromJsonToWallCommentSM, WallCommentSM } from 'src/app/models/wall-comment.model';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { groupAdapter, groupAddAll, groupAddMany, GroupModel } from '../shared/group/group';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { WallPostActions } from '../wall-post/wall-post.actions';
import { wallCommentOfflineReducer } from './offline/wall-comment.offline.reducer';
import { WallCommentActions } from './wall-comment.actions';
import { wallCommentAdapter as adapter, wallCommentInitialState as initialState, WallCommentState as State, WallCommentState } from './wall-comment.state';

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(
    WallCommentActions.offline.updated.like.add,
    WallCommentActions.offline.updated.like.remove,
    (state, { data }) => {
      return adapter.mapOne({
        id: data.id,
        map: (item) => ({
          ...item, liked: !item.liked,
          likeCounter: item.likeCounter + (item.liked ? -1 : 1)
        })
      }, state);
    }
  ),
  on(WallCommentActions.offline.deleted.add, (state, { data }) => {
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
  on(WallCommentActions.offline.deleted.remove, (state, { data }) => {
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
  on(WallCommentActions.like.success, (state, { input }) => {
    const dataSM: WallCommentSM = state.entities[input.commentId];

    if (dataSM.liked === input.to) {
      return state;
    }

    const newData: WallCommentSM = {
      ...dataSM,
      liked: input.to,
      likeCounter: dataSM.likeCounter + (input.to ? +1 : -1)
    }

    const stateCommentsUpdated = adapter.upsertOne(newData, state);
    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: input.commentId, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...stateCommentsUpdated, metadata: newMetadata };
  }),
  on(WallPostActions.api.byCourse.id.delete.success, (state, { input }) => {
    const toDelete = state.groups.entities[input.id]?.items ?? [];

    const newGroups = groupAdapter.removeOne(input.id, state.groups)
    const newMetadata = metadataAdapter<number>().removeMany(
      toDelete.map(id => `${MetadataType.Group}/${id}`),
      state.metadata
    );
    const statePostsUpdated = adapter.removeMany(toDelete, state);

    return { ...statePostsUpdated, metadata: newMetadata, groups: newGroups };
  }),
  on(WallCommentActions.fetchAll.success, (state, { data, input: { postId } }) => {
    const dataSM: WallCommentSM[] = fromArray(fromJsonToWallCommentSM, data);

    const stateWithNewWallComments = adapter.upsertMany(dataSM, state);
    const wallCommentsIds = data.map(wallComments => wallComments.id);
    const stateGroupUpdated = groupAddAll({ group: postId, items: wallCommentsIds }, state.groups);
    const newMetadata: Metadata<number>[] = wallCommentsIds.map<Metadata<number>>(id => (
      { id, lastUpdate: nowString(), type: MetadataType.Item }
    ));
    const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);

    return { ...stateWithNewWallComments, groups: stateGroupUpdated, metadata: stateMetadataUpdated };
  }),
  on(WallCommentActions.create.success, (state, { input: { postId }, data }) => {
    const dataSM: WallCommentSM = fromJsonToWallCommentSM(data);

    const stateCommentsUpdated = adapter.upsertOne(dataSM, state);
    const stateGroupUpdated = groupAddMany({ group: postId, items: [data.id] }, state.groups);
    const newMetadata = metadataAdapter<number>().upsertMany([
      { id: data.id, type: MetadataType.Item, lastUpdate: nowString() }
    ], state.metadata);

    return { ...stateCommentsUpdated, groups: stateGroupUpdated, metadata: newMetadata };
  }),
  
  on(WallCommentActions.delete.success, (state, { input }) => {
    const currentGroup = state.groups.entities[input.postId];
    const newGroup: GroupModel = {
      ...currentGroup,
      items: currentGroup.items.filter(id => id !== input.commentId)
    }

    const newGroups = groupAdapter.upsertOne(newGroup, state.groups)
    const newMetadata = metadataAdapter<number>().removeOne(
      `${MetadataType.Item}/${input.commentId}`,
      state.metadata
    );
    const statePostsUpdated = adapter.removeOne(input.commentId, state);

    return { ...statePostsUpdated, metadata: newMetadata, groups: newGroups };
  }),
  on(WallCommentActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  }),

  on(WallCommentActions.offline.meta.addOfflineComment, (state, { comment, idAndGroup }) => {
    const stateGroupUpdated = groupAddMany({ group: idAndGroup.groupId, items: [idAndGroup.id] }, state.groups);

    return adapter.addOne(comment, { ...state, groups: stateGroupUpdated })
  }),
);

export function WallCommentReducer(state: State | undefined, action: Action) {
  return joinReducers<WallCommentSM, WallCommentState>(state, action, [
    reducer,
    basicReducer('WallComment', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: wallCommentOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}

