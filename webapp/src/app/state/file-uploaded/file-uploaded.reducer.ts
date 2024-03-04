import { Action, createReducer, on } from '@ngrx/store';
import { fromArray } from 'src/app/models';
import { FileState, FileStatus, FileUploadedSM, fromJsonToUploadedFileSM } from 'src/app/models/file-uploaded.model';
import { ActivityActions } from '../activity/activity.actions';
import { LoginActions } from '../login/login.actions';
import { MaterialOfflineActions } from '../material/offline/material.offline.actions';
import { basicReducer, joinReducers } from '../shared/template.reducers';
import { FileUploadedActions } from './file-uploaded.actions';
import { fileUploadedAdapter as adapter, fileUploadedInitialState as initialState, FileUploadedState, FileUploadedState as State, getFileId } from './file-uploaded.state';
import { fileUploadedOfflineReducer } from './offline/file-uploaded.offline.reducer';
import { ActivityOfflineActions } from '../activity/offline/activity.offline.actions';
import { ActivitySubmissionOfflineActions } from '../activity-submission/offline/activity-submission.offline.actions';

const reducer = createReducer(
  initialState,
  on(LoginActions.clear, (state) => {
    return initialState
  }),
  on(FileUploadedActions.keyLoaded, (state, { data }) => {
    return data ?? state;
  }),
  // add files (from activity or material) to entities using the adapter
  on(
    MaterialOfflineActions.meta.addOfflineMaterial,
    ActivityOfflineActions.meta.addFileOfflineActivity,
    ActivitySubmissionOfflineActions.meta.addFileOfflineSubmission,
    (state, { fileSM }) => {
    return adapter.addOne(fileSM, state)
  }),
  on(ActivityActions.fetchOne.success, (state, { data }) => {
    const files = fromArray(fromJsonToUploadedFileSM, data.files);

    if (!files?.length) {
      return state;
    }



    return adapter.upsertMany(files.filter(file => !state.entities?.[getFileId(file)]), state)
  }),

  on(FileUploadedActions.local.sync.errorDetected, (state, { file }) => {
    const fileId = getFileId(file);

    console.warn('Error detected on file', file);

    let newState: FileState = null;

    if (FileState.IsUploading === file.status.currently) {
      newState = FileState.UploadError;
    } else if (FileState.IsDownloading === file.status.currently) {
      newState = FileState.DownloadError;
    } else if (FileState.NeedsToBeDeleted === file.status.currently) {
      newState = FileState.DeleteError;
    }

    return adapter.updateOne({
      id: fileId,
      changes: {
        status: {
          ...file.status,
          currently: newState
        }
      }
    }, state);
  }),

  on(FileUploadedActions.local.sync.start, (state, { id }) => {
    return {
      ...state,
      currently: {
        onQueue: state.currently.onQueue.filter(item => item !== id),
        synchronizing: state.currently.synchronizing.concat(id),
        manualRetry: state.currently.manualRetry.filter(item => item !== id)
      }
    }
  }),
  on(FileUploadedActions.local.database.add.success, (state, { input: { id } }) => {
    const newState = adapter.mapOne({
      id: id,
      map: (item) => ({
        ...item,
        status: {
          currently: FileState.Downloaded,
          lastModified: new Date().getTime().toString(),
          progress: 1
        }
      })
    }, state);

    return {
      ...newState,
      currently: {
        ...newState.currently,
        synchronizing: newState.currently.synchronizing.filter(item => item !== id)
      }
    }
  }),
  on(FileUploadedActions.local.database.remove.success, (state, { input: { id, deleteAll } }) => {
    if (deleteAll) {
      return adapter.removeOne(id, state);
    }

    return adapter.mapOne({
      id: id,
      map: (item) => ({
        ...item,
        status: {
          currently: FileState.NotPresentLocally,
          lastModified: new Date().getTime().toString(),
          progress: 0
        }
      })
    }, state);
  }),
  on(FileUploadedActions.local.sync.updateStatus, (state, { id, status }) => {
    return adapter.mapOne({
      id: id,
      map: (item) => ({
        ...item,
        status: status
      })
    }, state);
  }),
  on(FileUploadedActions.local.onQueue.remove, (state, { id }) => {
    return {
      ...state,
      currently: {
        synchronizing: state.currently.synchronizing.filter(item => item !== id),
        onQueue: state.currently.onQueue.filter(item => item !== id),
        manualRetry: state.currently.manualRetry.filter(item => item !== id)
      }
    }
  }),
  on(FileUploadedActions.local.uploadDone, (state, { id, newFile }) => {

    return adapter.mapOne({
      id: id,
      map: (item) => ({
        ...newFile,
        downloadUri: `${item.downloadUri}/${encodeURIComponent(newFile.fileName)}`,
        status: {
          currently: FileState.NotPresentLocally,
          lastModified: new Date().getTime().toString(),
          progress: 0
        }
      })
    }, state);
  }),
  on(
    FileUploadedActions.local.onQueue.addItem,
    FileUploadedActions.local.onQueue.moveToFirst,
    (state, { id }) => {
      // Check if there is no need to put it on the queue
      if ([FileState.Downloaded, FileState.IsDownloading].includes(state.entities[id].status.currently)) {
        return state;
      }

      // Look up if already in the queue
      const pos = state.currently.onQueue.findIndex(item => item === id);

      if (pos >= 0) {
        return {
          ...state,
          currently: {
            ...state.currently,
            onQueue: [id].concat(state.currently.onQueue.filter(item => item !== id))
          }
        }
      } else { // Add it to the top of the queue
        const newEntity = {
          ...state.entities[id],
          status: {
            currently: FileState.NeedsToBeDownloaded,
            lastModified: new Date().getTime().toString(),
            progress: 0
          }
        }


        const newEntities = { ...state.entities };
        newEntities[id] = newEntity;

        return {
          ...state,
          entities: newEntities,
          currently: {
            ...state.currently,
            onQueue: [id].concat(state.currently.onQueue.filter(item => item !== id))
          }
        }
      }
    }
  ),
  on(FileUploadedActions.local.onQueue.addMany, (state, { ids }) => {
    const isOk = (id: string) => [FileState.NeedsToBeDeleted, FileState.NeedsToBeDownloaded, FileState.NeedsToBeUploaded].includes(state.entities[id].status.currently)

    const modifiedList = ids.map(id => {
      let newState = state.entities[id].status.currently;

      if (!isOk(id)) {

        if (newState != FileState.NotPresentLocally) {
          console.warn(`File ${id} is not in a valid state to be added to the queue. Setting to "NeedsToBeDownloaded"`, state.entities[id]);
        }

        newState = FileState.NeedsToBeDownloaded;
      }

      return {
        ...state.entities[id],
        status: {
          progress: 0,
          currently: newState,
          lastModified: (new Date()).toISOString(),
        } as FileStatus
      } as FileUploadedSM
    }).sort((a, b) => a.byteSize - b.byteSize);

    const newEntities = { ...state.entities };
    modifiedList.forEach(item => newEntities[getFileId(item)] = item);

    const newQueue = state.currently.onQueue.concat(modifiedList.map(item => getFileId(item)));

    return {
      ...state,
      entities: newEntities,
      currently: {
        ...state.currently,
        onQueue: newQueue
      }
    } as FileUploadedState;
  }),

  on(FileUploadedActions.offline.deleted.add, (state, { data }) => {
    return adapter.mapOne({
      id: data.id,
      map: (item) => ({
        ...item,
        id: -data.id
      })
    }, state);
  }),
  on(FileUploadedActions.offline.deleted.remove, (state, { data }) => {
    return adapter.mapOne({
      id: `-${data.id}`,
      map: (item) => ({
        ...item,
        id: data.id
      })
    }, state);
  }),
  on(FileUploadedActions.local.sync.retryManually.add, (state, { id }) => {

    return {
      ...state,
      currently: {
        ...state.currently,
        onQueue: state.currently.onQueue.filter(item => item !== id),
        synchronizing: state.currently.synchronizing.filter(item => item !== id),
        manualRetry: state.currently.manualRetry.filter(item => item !== id).concat(id)
      }
    };
  }),
  on(FileUploadedActions.local.sync.retryManually.remove, (state, { id }) => {

    return {
      ...state,
      currently: {
        ...state.currently,
        manualRetry: state.currently.manualRetry.filter(item => item !== id)
      }
    };
  })
);

export function FileUploadedReducer(state: State | undefined, action: Action) {
  return joinReducers<FileUploadedSM, FileUploadedState>(state, action, [
    reducer,
    basicReducer('FileUploaded', adapter),
    (myState: State, myAction: Action) => {
      return {
        ...myState,
        offline: fileUploadedOfflineReducer(myState.offline, myAction)
      };
    }
  ]);
}

