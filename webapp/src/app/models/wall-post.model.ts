import { CreatedJson, CreatedSM, LastModifiedSM } from '.';

import { Convert, Created, fromJsonToCreated, fromJsonToLastModified, LastModified, LastModifiedJson } from './index';


export interface WallPostForm {
  text: string;
  isFixed: boolean;
}

export interface WallPostJson extends CreatedJson, LastModifiedJson {
  id: number;

  text: string;
  isFixed: boolean;

  liked: boolean;
  likeCounter: number;
  favorite: boolean;
  favoriteCounter: number;

  activityId?: number;
  teacher: boolean;
}

export interface WallPost extends Created, LastModified {
  id: number;

  text: string;
  isFixed: boolean;

  liked: boolean;
  likeCounter: number;
  favorite: boolean;
  activityId?: number;
  teacher: boolean;
}

export const fromJsonToWallPost: Convert<WallPostJson, WallPost> = (data) => {
  return (!data) ? undefined : {
    ...data,
    ...fromJsonToCreated(data),
    ...fromJsonToLastModified(data),
  };
}

export const fromJsonToWallPostSM: Convert<WallPostJson, WallPostSM> = (data) => {
  const { createdBy, lastModifiedBy, ...rest } = data;

  return (!rest) ? undefined : {
    ...rest,
    createdById: data.createdBy?.id,
    lastModifiedById: data.lastModifiedBy.id
  };
}


export interface WallPostSM extends CreatedSM, LastModifiedSM {
  id: number;
  text: string;
  isFixed: boolean;

  teacher?: boolean;

  liked: boolean;
  likeCounter: number;
  favorite: boolean;
  favoriteCounter: number;

  activityId?: number;
}
