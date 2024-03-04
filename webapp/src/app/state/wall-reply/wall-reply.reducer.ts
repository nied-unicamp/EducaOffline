import { Action, createReducer, on } from '@ngrx/store';

import { fromArray } from 'src/app/models';
import { fromJsonToWallReplySM, WallReplySM } from 'src/app/models/wall-comment.model';
import { LoginActions } from '../login/login.actions';
import { nowString } from '../shared';
import { groupAdapter, groupAddAll, groupAddMany, GroupModel } from '../shared/group/group';
import { Metadata, metadataAdapter, MetadataType } from '../shared/metadata/metadata';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { WallReplyActions } from 'src/app/state/wall-reply/wall-reply.actions';
import { wallReplyAdapter as adapter, wallReplyInitialState as initialState, WallReplyState as State, WallReplyState } from './wall-reply.state';
import { wallReplyOfflineReducer } from './offline/wall-reply.offline.reducer';

const reducer = createReducer(
    initialState,
    on(LoginActions.clear, (state) => {
      return initialState
    }),
    on(WallReplyActions.fetchAll.success, (state, { data, input: { postId } }) => {
      const dataSM: WallReplySM[] = fromArray(fromJsonToWallReplySM, data);
      const stateWithNewWallReplies = adapter.upsertMany(dataSM, state);
      const wallRepliesIds = data.map(wallReplies => wallReplies.id);
      const stateGroupUpdated = groupAddAll({ group: postId, items: wallRepliesIds }, state.groups);
      const newMetadata: Metadata<number>[] = wallRepliesIds.map<Metadata<number>>(id => (
        { id, lastUpdate: nowString(), type: MetadataType.Item }
      ));
      const stateMetadataUpdated = metadataAdapter<number>().upsertMany(newMetadata, state.metadata);
  
      return { ...stateWithNewWallReplies, groups: stateGroupUpdated, metadata: stateMetadataUpdated };
    }),
    on(WallReplyActions.createReply.success, (state, { input: { postId }, data }) => {
      const dataSM: WallReplySM = fromJsonToWallReplySM(data);    
      const stateRepliesUpdated = adapter.upsertOne(dataSM, state);
      const stateGroupUpdated = groupAddMany({ group: postId, items: [data.id] }, state.groups);
      const newMetadata = metadataAdapter<number>().upsertMany([
        { id: data.id, type: MetadataType.Item, lastUpdate: nowString() }
      ], state.metadata);
  
      return { ...stateRepliesUpdated, groups: stateGroupUpdated, metadata: newMetadata };
    }), 
    on(WallReplyActions.delete.success, (state, { input }) => {
      const currentGroup = state.groups.entities[input.postId];
      const newGroup: GroupModel = {
        ...currentGroup,
        items: currentGroup.items.filter(id => id !== input.replyId)
      }
  
      const newGroups = groupAdapter.upsertOne(newGroup, state.groups)
      const newMetadata = metadataAdapter<number>().removeOne(
        `${MetadataType.Item}/${input.replyId}`,
        state.metadata
      );
      const statePostsUpdated = adapter.removeOne(input.replyId, state);
  
      return { ...statePostsUpdated, metadata: newMetadata, groups: newGroups };
    }),
    on(WallReplyActions.keyLoaded, (state, { data }) => {
      return data ?? state;
    }),
    on(WallReplyActions.offline.meta.addOfflineReply, (state, { reply, idAndGroup }) => {
      const stateGroupUpdated = groupAddMany({ group: idAndGroup.groupId, items: [idAndGroup.id] }, state.groups);
  
      return adapter.addOne(reply, { ...state, groups: stateGroupUpdated })
    }),
);
    
export function WallReplyReducer(state: State | undefined, action: Action) {
    return joinReducers<WallReplySM, WallReplyState>(state, action, [
      reducer,
      basicReducer('WallReply', adapter),
      (myState: State, myAction: Action) => {
        return {
          ...myState,
          offline: wallReplyOfflineReducer(myState.offline, myAction)
        };
      }
    ]);
  }
