import { HttpHeaders } from '@angular/common/http';
import { fromJsonToUser, User, UserJson } from './user.model';


export interface CreatedJson {
  createdBy: UserJson;
  createdDate: string;
}

export interface LastModifiedJson {
  lastModifiedBy: UserJson;
  lastModifiedDate: string;
}

export interface CreatedSM {
  createdById: number;
  createdDate: string;
}

export interface LastModifiedSM {
  lastModifiedById: number;
  lastModifiedDate: string;
}

export interface Created {
  createdBy: User;
  createdDate: Date;
}

export interface LastModified {
  lastModifiedBy: User;
  lastModifiedDate: Date;
}

export type Convert<InputType, OutputType> = (data?: InputType) => OutputType;

export const fromArray = <InputType, OutputType>(func: Convert<InputType, OutputType>, data: InputType[]) => {
  return (!data) ? undefined : data.map(item => func(item))
}

export const fromArray2 = <InputType, OutputType>(func: Convert<InputType, OutputType>) => {
  return (data: InputType[]) => (!data) ? [] : data.map(item => func(item))
}

export const fromStringToDate: Convert<string, Date> = (date: string) => {
  return date ? new Date(date) : null;
}

export const stringDateToISOString: Convert<string, string> = (date : string) => {
  let dateObject = new Date(date);
  return dateObject.toISOString();
}

export const fromJsonToCreated: Convert<CreatedJson, Created> = (json: CreatedJson) => {
  return (!json) ? undefined : {
    createdBy: fromJsonToUser(json?.createdBy),
    createdDate: fromStringToDate(json?.createdDate)
  };
}

export const fromJsonToLastModified: Convert<LastModifiedJson, LastModified> = (json: LastModifiedJson) => {
  return (!json) ? undefined : {
    lastModifiedBy: fromJsonToUser(json?.lastModifiedBy),
    lastModifiedDate: fromStringToDate(json?.lastModifiedDate)
  };
}

export const fromSMToLastModified: (getUser: (id: number) => User) => Convert<LastModifiedSM, LastModified> = (getUser: (id: number) => User) => (sm: LastModifiedSM) => {
  return (!sm) ? undefined : {
    lastModifiedBy: getUser(sm?.lastModifiedById),
    lastModifiedDate: fromStringToDate(sm?.lastModifiedDate)
  };
}

export const fromSMToCreated: (getUser: (id: number) => User) => Convert<CreatedSM, Created> = (getUser: (id: number) => User) => (sm: CreatedSM) => {
  return (!sm) ? undefined : {
    createdBy: getUser(sm?.createdById),
    createdDate: fromStringToDate(sm?.createdDate)
  };
}

export const fromJsonToCreatedSM: Convert<CreatedJson, CreatedSM> = (json: CreatedJson) => {
  return (!json) ? undefined : {
    createdById: json.createdBy?.id,
    createdDate: json?.createdDate
  };
}

export const fromJsonToLastModifiedSM: Convert<LastModifiedJson, LastModifiedSM> = (json: LastModifiedJson) => {
  return (!json) ? undefined : {
    lastModifiedById: json?.lastModifiedBy?.id,
    lastModifiedDate: json?.lastModifiedDate
  };
}

export const JsonHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

