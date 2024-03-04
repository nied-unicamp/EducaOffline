import { getFileId } from '../state/file-uploaded/file-uploaded.state';
import { EditFilesForm } from './activity.model';
import { FileUploadedSM } from './file-uploaded.model';
import { FileUploaded, FileUploadedJson, HaveFilesSM } from './file-uploaded.model';
import { Created, CreatedJson, CreatedSM, fromJsonToCreatedSM, fromJsonToLastModifiedSM, LastModified, LastModifiedJson, LastModifiedSM } from './index';

export interface ActivitySubmissionForm {
  answer?: string;
  files: EditFilesForm
}

export interface ActivitySubmissionJson extends LastModifiedJson, CreatedJson {
  id?: number;
  answer?: string;
  files?: FileUploadedJson[];
}

export interface ActivitySubmission extends LastModified, Created {
  id?: number;
  answer?: string;
  files?: FileUploaded[];
}


export const fromJsonToActivitySubmissionSM: (json: ActivitySubmissionJson) => ActivitySubmissionSM = (json: ActivitySubmissionJson) => {
  const { files, ...rest } = json;

  return (!json) ? undefined : {
    ...rest,
    ...fromJsonToCreatedSM(json),
    ...fromJsonToLastModifiedSM(json),
    files: files?.map(file => getFileId(file))
  };
}

export const updateDateAndCreator: (json: ActivitySubmissionJson) => ActivitySubmissionJson = (json: ActivitySubmissionJson) => {
  const { files, createdBy, createdDate, ...rest } = json;
  
  return (!json) ? undefined : {
    ...rest,
    files: [],
    createdBy: json.lastModifiedBy,
    createdDate: json.lastModifiedDate
  };
}

export const fromFormToActivitySubmissionSM  = (form: ActivitySubmissionForm, userId: number, submissionId: number,
  creationDate: string, files: string[]): ActivitySubmissionSM => {
  return {
    id: submissionId,
    answer: form.answer,

    // fileds inherited from LastModifiedSM
    lastModifiedById: userId,
    lastModifiedDate: creationDate,

    // fields inherited from CreatedSM
    createdById: userId,
    createdDate: creationDate,

    files: files
  }
}

export const fromSMtoActivitySubmissionForm = (submissionSM: ActivitySubmissionSM, filesToUpload: File[], filesUploaded: FileUploadedSM[],
  filesToDelete: FileUploadedSM[]): ActivitySubmissionForm => {
    return {
      answer: submissionSM?.answer,
      files: {
        uploaded: filesUploaded ?? [],
        toDelete: filesToDelete ?? [],
        toUpload: filesToUpload ?? []
      }
    }
  }

export interface ActivitySubmissionSM extends LastModifiedSM, CreatedSM, HaveFilesSM {
  id?: number;
  answer?: string;
}

export interface SubmissionFile {
  id: number;
  file?: string;
}