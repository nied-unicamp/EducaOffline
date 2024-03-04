export interface FileUploadedJson {
  fileName: string;
  mimeType: string;
  byteSize: number;
  sha3Hex: string;
  downloadUri?: string;
}


export interface FileUploadedForm {
  blob: Blob;
  file: FileUploaded;
  url: string;
}


export interface FileUploaded {
  fileName: string;
  mimeType: string;
  byteSize: number;
  sha3Hex: string;
  downloadUri?: string;
  status: FileStatus;
}


export enum FileState {
  Downloaded = 'Downloaded',
  Uploaded = 'Uploaded',
  NeedsToBeDownloaded = 'NeedsToBeDownloaded',
  IsDownloading = 'IsDownloading',
  IsUploading = 'IsUploading',
  NeedsToBeUploaded = 'NeedsToBeUploaded',
  NeedsToBeDeleted = 'NeedsToBeDeleted',
  NotPresentLocally = 'NotPresentLocally',
  DownloadError = 'DownloadError',
  UploadError = 'UploadError',
  DeleteError = 'DeleteError',
}


export interface FileStatus {
  currently: FileState,
  lastModified: string,
  progress: number;
}


export interface FileUploadedSM {
  fileName: string;
  mimeType: string;
  byteSize: number;
  sha3Hex: string;
  downloadUri?: string;
  status: FileStatus;
}

export interface HaveFilesSM {
  files: string[];
}

export const fromJsonToUploadedFileSM: (json: FileUploadedJson) => FileUploadedSM = (json: FileUploadedJson) => {
  return (!json) ? undefined : {
    ...json,
    status: {
      currently: FileState.NotPresentLocally,
      lastModified: (new Date()).toISOString(),
      progress: 0
    }
  };
}

export const filesAreEqualWithoutSha3hex: (file1: FileUploaded, file2: FileUploaded) => boolean = (file1: FileUploaded, file2: FileUploaded) => {
  return (file1.fileName) == (file2.fileName) &&
  (file1.byteSize) == (file2.byteSize) &&
  (file1.downloadUri) == (file2.downloadUri) &&
  (file1.mimeType) == (file2.mimeType) &&
  (file1.status) == (file2.status);
}
