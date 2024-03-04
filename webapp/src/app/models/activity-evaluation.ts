import { fromJsonToUploadedFile, UploadedFile, UploadedFileJson } from './file';
import { Convert, Created, CreatedJson, fromArray, fromJsonToCreated, fromJsonToLastModified, LastModified, LastModifiedJson } from './index';

export interface ActivityEvaluationForm {
  comment?: string;
  score?: number;
}

export interface ActivityEvaluationJson extends LastModifiedJson, CreatedJson {
  id?: number;
  comment?: string;
  score?: number;
  files?: UploadedFileJson[];
}

export interface ActivityEvaluation extends LastModified, Created {
  id?: number;
  comment?: string;
  score?: number;
  files?: UploadedFile[];
}

export const fromJsonToActivityEvaluation: Convert<ActivityEvaluationJson, ActivityEvaluation> = (json: ActivityEvaluationJson) => {
  return (!json) ? undefined : {
    ...json,
    ...fromArray(fromJsonToUploadedFile, json?.files),
    ...fromJsonToCreated(json),
    ...fromJsonToLastModified(json),
  };
}
