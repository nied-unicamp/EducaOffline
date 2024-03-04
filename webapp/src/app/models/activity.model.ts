import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Created, CreatedJson, CreatedSM, fromJsonToCreatedSM, fromJsonToLastModifiedSM, LastModified, LastModifiedJson, LastModifiedSM } from '.';
import { getFileId } from '../state/file-uploaded/file-uploaded.state';
import { FileUploaded, FileUploadedJson, HaveFilesSM } from './file-uploaded.model';
import { FileUploadedSM } from './file-uploaded.model';
import { FileState } from './file-uploaded.model';


// Order matters so we can use:
// status >= ActivityStates.Published
export enum ActivityStates {
  Empty = -1,
  Scheduled,
  Published,
  SubmissionStarted,
  SubmissionEnded,
  GradesReleased
}

export interface ActivityJson extends CreatedJson, LastModifiedJson {
  id: number;
  title: string;
  description: string;
  criteria: string;
  files?: FileUploadedJson[];
  gradeWeight: number;
  gradesReleaseDate: string;
  publishDate: string;
  submissionBegin: string;
  submissionEnd: string;
}

export interface Activity extends Created, LastModified {
  id: number;
  title: string;
  description: string;
  criteria: string;
  files?: FileUploaded[];
  gradeWeight: number;
  gradesReleaseDate?: Date;
  publishDate: Date;
  submissionBegin: Date;
  submissionEnd: Date;
}

export const fromJsonToActivitySM: (json: ActivityJson) => ActivitySM = (json: ActivityJson) => {
  const { files, ...rest } = json;

  return (!json) ? undefined : {
    ...rest,
    ...fromJsonToCreatedSM(json),
    ...fromJsonToLastModifiedSM(json),
    files: files?.map(file => getFileId(file))
  };
}

export interface ActivityForm {
  title: string;
  gradeWeight?: number;
  description: string;
  submissionPeriod: {
    end: NgbDateStruct,
    start: NgbDateStruct,
  };
  publishDate: NgbDateStruct;
  hasGrade: boolean;
  criteria: string;
  files: EditFilesForm,
}

export interface ActivityFormJson {
  title: string;
  gradeWeight?: number;
  description: string;
  submissionBegin: Date;
  submissionEnd: Date;
  publishDate: Date;
  hasGrade: boolean;
  criteria: string;
}

export const convertFromNgb = (date: NgbDateStruct, isEndOfDay: boolean): Date => {
  if (isEndOfDay) {
    return new Date(date.year, date.month - 1, date.day, 23, 59, 59);
  }

  return new Date(date.year, date.month - 1, date.day);
}

export const fromActivityFormToJson: (form: ActivityForm) => ActivityFormJson = (form: ActivityForm) => {
  const { submissionPeriod, publishDate, files, ...rest } = form;

  return {
    ...rest,
    submissionBegin: convertFromNgb(submissionPeriod.start, false),
    submissionEnd: convertFromNgb(submissionPeriod.end, true),
    publishDate: convertFromNgb(publishDate, false),
  }
}

// convert ActivityForm to ActivitySM
export const fromActivityFormtoActivitySM = (form: ActivityForm, userId: number, activityId: number,
  creationDate: string, files: FileUploadedSM[]): ActivitySM => {
  return {
    id: activityId,
    title: form.title,
    description: form.description,
    publishDate: convertFromNgb(form.publishDate,false).toISOString(),
    submissionBegin: convertFromNgb(form.submissionPeriod.start,false).toISOString(),
    submissionEnd: convertFromNgb(form.submissionPeriod.end,true).toISOString(),
    criteria: form.criteria,
    gradeWeight: form.gradeWeight ?? 0,
    gradesReleaseDate: convertFromNgb(form.submissionPeriod.end,true).toISOString(),

    // fields inherited from HaveFilesSM
    files: files.map(getFileId),
    
    // fileds inherited from LastModifiedSM
    lastModifiedById: userId,
    lastModifiedDate: creationDate,

    // fields inherited from CreatedSM
    createdById: userId,
    createdDate: creationDate
  }
}

export const convertFromStringToNgb = (dateString: string): NgbDateStruct => {
  let year: number = parseInt(dateString.slice(0,4))
  let month: number = parseInt(dateString.slice(5,7))
  let day: number = parseInt(dateString.slice(8,10))
  return new NgbDate(year, month, day);
}

//  TODO files
export const fromActivitySMtoActivityForm = (activitySM: ActivitySM, filesToUpload: File[], filesUploaded: FileUploadedSM[],
  filesToDelete: FileUploadedSM[]): ActivityForm => {
  
  return {
    title: activitySM?.title,
    gradeWeight: activitySM?.gradeWeight,
    description: activitySM?.description,
    submissionPeriod: {
      end: convertFromStringToNgb(activitySM?.submissionEnd),
      start: convertFromStringToNgb(activitySM?.submissionBegin),
    },
    publishDate: convertFromStringToNgb(activitySM?.publishDate),
    hasGrade: (activitySM?.gradeWeight == 0),
    criteria: activitySM?.criteria,
    files: {
      uploaded: filesUploaded ?? [],
      toDelete: filesToDelete ?? [],
      toUpload: filesToUpload ?? []
    }
  }
}

export const patchActivityFiles = (activity: ActivityJson, courseId: number) => ({
  ...activity,
  files: activity?.files?.map(file =>
  ({
    ...file,
    downloadUri: `courses/${courseId}/activities/${activity.id}/files/${encodeURIComponent(file.fileName)}`
  })) ?? []
})

export type EditFilesForm = {
  uploaded: FileUploaded[];
  toDelete: FileUploaded[];
  toUpload: File[];
}

export enum ActivitySortBy {
  MostRecentPublication,
  LastModified,
  OlderPublication
}

export enum ActivityFilter {
  NoFilter,
  Evaluated,
  ToEvaluate,
  ToDo,
  Done,
  Ended
}

export interface ActivitySM extends CreatedSM, LastModifiedSM, HaveFilesSM {
  id: number;
  title: string;
  description: string;

  publishDate: string;
  submissionBegin: string;
  submissionEnd: string;

  criteria: string;
  gradeWeight: number;
  gradesReleaseDate: string;
}

export interface FilesToDelete {
  activityId: number;
  files: string[];
}
