import { CreatedJson, CreatedSM, fromJsonToCreatedSM, fromJsonToLastModifiedSM, LastModifiedSM } from ".";
import { Convert, Created, fromJsonToCreated, fromJsonToLastModified, LastModified, LastModifiedJson } from './index';

export interface WallCommentForm {
  text: string;
}

export interface WallReplyForm {
  text: string;
}
export interface WallCommentJson extends CreatedJson, LastModifiedJson {
  id: number;
  text: string;

  liked: boolean;
  likeCounter: number;
  teacher: boolean;
}

export interface WallReplyJson extends CreatedJson, LastModifiedJson {
  id: number;
  text: string;

  liked: boolean;
  likeCounter: number;
  teacher: boolean;
  parentComment: WallCommentJson;
}

export interface WallCommentSM extends CreatedSM, LastModifiedSM {
  id: number;
  text: string;

  liked: boolean;
  likeCounter: number;
  teacher: boolean;
}

export interface WallReplySM extends CreatedSM, LastModifiedSM {
  id: number;
  text: string;

  liked: boolean;
  likeCounter: number;
  teacher: boolean;
  parentCommentId: number;
}

export interface WallComment extends Created, LastModified {
  id: number;
  text: string;

  liked: boolean;
  likeCounter: number;
  teacher: boolean;
}

export interface WallReply extends Created, LastModified {
  id: number;
  text: string;

  liked: boolean;
  likeCounter: number;
  teacher: boolean;
  parentCommentId: number;
}

export const fromJsonToWallComment: Convert<WallCommentJson, WallComment> = (json: WallCommentJson) => {
  return (!json) ? undefined : {
    ...json,
    ...fromJsonToCreated(json),
    ...fromJsonToLastModified(json),
  };
}

export const fromJsonToWallCommentSM: Convert<WallCommentJson, WallCommentSM> = (data) => {
  const { createdBy, lastModifiedBy, ...rest } = data;

  return (!rest) ? undefined : {
    ...rest,
    ...fromJsonToCreatedSM(data),
    ...fromJsonToLastModifiedSM(data),
  };
}

export const fromJsonToWallReplySM: Convert<WallReplyJson, WallReplySM> = (data) => {
  const { createdBy, lastModifiedBy, ...rest } = data;

  return (!rest) ? undefined : {

    ...rest,
    ...fromJsonToCreatedSM(data),
    ...fromJsonToLastModifiedSM(data),
    parentCommentId: rest.parentComment.id, 
    parentComment: undefined,
  };
}

export const fromSMtoReplyForm: Convert<WallReplySM, WallReplyForm> = (data) => {
  const { text } = data;
  return { text };
}
