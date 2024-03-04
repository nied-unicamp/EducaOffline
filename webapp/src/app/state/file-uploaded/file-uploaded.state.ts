import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { FileUploadedJson, FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { fileUploadedOfflineInitialState, FileUploadedOfflineState } from './offline/file-uploaded.offline.state';

export interface FileUploadedState extends EntityState<FileUploadedSM> {
  currently: {
    onQueue: string[];
    synchronizing: string[];
    manualRetry: string[];
  };
  offline: FileUploadedOfflineState;
}

export const getFileId = (item: FileUploadedJson) => `${item.sha3Hex}///${item.downloadUri}`;

export const trimFileId = (id: string) => id.split('///')[0];

export const fileUploadedAdapter: EntityAdapter<FileUploadedSM> = createEntityAdapter<FileUploadedSM>({
  selectId: (item: FileUploadedSM) => getFileId(item),
});

/**
 * Add downloadUri to all internal files.
 *
 * @param files - Item that have files
 * @param url - Base URL (usually ending as "id/files")
 * @returns Patched items
 */
export const patchFilesWithUrl: (files: FileUploadedJson[], url: string) => FileUploadedJson[] =
  (files, url) => ((files ?? []).map(file =>
  ({
    ...file,
    downloadUri: `${url}/${encodeURIComponent(file.fileName)}`
  })));

export const fileUploadedInitialState: FileUploadedState = fileUploadedAdapter.getInitialState({
  currently: {
    onQueue: [],
    synchronizing: [],
    manualRetry: []
  },
  offline: fileUploadedOfflineInitialState
});
