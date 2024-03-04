export interface UploadedFileJson {

  fileName: string;
  mimeType: string;
  byteSize: number;
  downloadUri?: string;
}

export interface UploadedFile {

  fileName: string;
  mimeType: string;
  byteSize: number;
  downloadUri?: string;
}

export interface UploadedFileSM {
  fileName: string;
  mimeType: string;
  byteSize: number;
  downloadUri?: string;
}

export interface HaveFilesSM {
  files: UploadedFileSM[];
}

export const fromJsonToUploadedFile: (json: UploadedFileJson) => UploadedFile = (json: UploadedFileJson) => {
  return (!json) ? undefined : {
    ...json
  };
}

