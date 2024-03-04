import { Convert } from './index';


export interface MaterialFolderForm {
  title?: string;
  description?: string;
}

export interface MaterialFolderJson {
  id?: number;
  title?: string;
  description?: string;
}

export interface MaterialFolder {
  id?: number;
  title?: string;
  description?: string;
}

export const fromJsonToMaterialFolderSM: Convert<MaterialFolderJson, MaterialFolderSM> = (json: MaterialFolderJson) => {
  return (!json) ? undefined : {
    id: json.id,
    title: json.title ?? '',
    description: json.description ?? ''
  };
}

export const fromSMToMaterialFolderForm: Convert<MaterialFolderSM, MaterialFolderForm> = (sm: MaterialFolderSM) => {
  return (!sm) ? undefined : {
    title: sm.title ?? '',
    description: sm.description ?? '',
  }
}

export interface MaterialFolderSM {
  id: number;
  title: string;
  description: string;
}
