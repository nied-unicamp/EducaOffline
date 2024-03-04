import { getFileId } from '../state/file-uploaded/file-uploaded.state';
import { FileUploaded, FileUploadedJson, HaveFilesSM } from './file-uploaded.model';
import { Convert, Created, CreatedJson, CreatedSM, fromJsonToCreatedSM, fromJsonToLastModifiedSM, LastModified, LastModifiedJson, LastModifiedSM } from './index';

export interface MaterialForm {
  title?: string;
  link?: string;
  description?: string;
}

export interface MaterialJson extends CreatedJson, LastModifiedJson {
  title?: string;
  id?: number;
  description?: string;
  files?: FileUploadedJson[];
  link?: string;
}

export interface Material extends Created, LastModified {
  id?: number;
  title?: string;
  description?: string;
  files?: FileUploaded[];
  link?: string;
  folder?: number; // -1 = root folder
}

export const fromJsonToMaterialSM: Convert<MaterialJson, MaterialSM> = (json: MaterialJson) => {

  return (!json) ? undefined : {
    id: json.id,
    title: json.title ?? '',
    link: json.link ?? '',
    description: json.description ?? '',
    files: json?.files?.map(file => getFileId(file)) ?? [],
    folder: -1, // -1 = root folder
    ...fromJsonToCreatedSM(json),
    ...fromJsonToLastModifiedSM(json),
  }
}


export const fromSMToMaterialForm: Convert<MaterialSM, MaterialForm> = (sm: MaterialSM) => {

  return (!sm) ? undefined : {
    id: sm.id,
    title: sm.title ?? '',
    link: sm.link ?? '',
    description: sm.description ?? '',
  }
}


export interface MaterialSM extends CreatedSM, LastModifiedSM, HaveFilesSM {
  id: number;
  title: string;
  description: string;
  link: string;
  files: string[];
  folder: number; // -1 = root folder
}
