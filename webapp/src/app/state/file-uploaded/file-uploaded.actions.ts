import { createAction, props } from '@ngrx/store';
import { EditFilesForm } from 'src/app/models/activity.model';
import { FileStatus, FileUploaded, FileUploadedJson, FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { ActionTemplates } from '../shared/template.actions';
import { FileUploadedState } from './file-uploaded.state';
import { FileUploadedOfflineActions } from './offline/file-uploaded.offline.actions';


export const FileUploadedActions = {
  keyLoaded: ActionTemplates.keyLoaded<FileUploadedState>('FileUploaded'),

  api: {
    download: ActionTemplates.validated.withArgs<{ file: FileUploaded }, FileUploadedJson>('[ FileUploaded / API ] Download file to local db'),
    syncFiles: ActionTemplates.validated.withArgs<{ files: EditFilesForm, url: string }, FileUploadedJson[]>('[ FileUploaded / API ] For multiple files, delete and (save locally then) upload'),
    _idsRef: ActionTemplates.validated.withArgs<{ files: EditFilesForm, url: string }, string[]>('[ FileUploaded / API ] Reference for ids of files being synced'),
  },

  local: {
    uploadDone: createAction('[ FileUploaded / Synchronize ] Replace local file with uploaded reference', props<{ id: string, newFile: FileUploadedJson }>()),
    onQueue: {
      addMany: createAction('[ FileUploaded / Queue ] Add many items to the Queue', props<{ ids: string[] }>()),
      addItem: createAction('[ FileUploaded / Queue ] Add item to Queue', props<{ id: string }>()),
      moveToFirst: createAction('[ FileUploaded / Queue ] Move to First', props<{ id: string }>()),
      remove: createAction('[ FileUploaded / Queue ] Remove item', props<{ id: string }>()),
    },
    sync: {
      start: createAction('[ FileUploaded / Synchronize ] Synchronize item', props<{ id: string }>()),
      updateStatus: createAction('[ FileUploaded / Synchronize ] Update status', props<{ id: string, status: FileStatus }>()),
      cancel: createAction('[ FileUploaded / Synchronize ] Cancel Synchronize', props<{ id: string }>()),
      errorDetected: createAction('[ FileUploaded / Synchronize ] Error detected', props<{ file: FileUploadedSM }>()),
      retryManually: {
        add: createAction('[ FileUploaded / Synchronize ] Add file to list to retry manually', props<{ id: string }>()),
        remove: createAction('[ FileUploaded / Synchronize ] Remove file from list to retry manually', props<{ id: string }>()),
      }
    },
    database: {
      add: ActionTemplates.validated.withArgs<{ id: string, blob: Blob }, void>('[ FileUploaded / Database ] Add file'),
      remove: ActionTemplates.validated.withArgs<{ id: string, deleteAll?: boolean }, void>('[ FileUploaded / Database ] Remove file'),
    },
  },

  basic: ActionTemplates.basicActions<FileUploadedSM, string>('FileUploaded'),
  offline: FileUploadedOfflineActions
};
