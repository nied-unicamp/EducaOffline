import { createSelector } from "@ngrx/store";
import { fromStringToDate } from "src/app/models";
import { Activity, ActivitySM } from "src/app/models/activity.model";
import { FileUploadedSM } from "src/app/models/file-uploaded.model";
import { UserSM } from "src/app/models/user.model";
import { Selector } from "..";
import { FileUploadedSelectors } from "../file-uploaded/file-uploaded.selector";
import { UserSelectors } from "../user/user.selector";


const convertOneSel = (selector: Selector<ActivitySM>) => createSelector(
  selector,
  UserSelectors.entities,
  FileUploadedSelectors.basic.entities,
  (activity, users, files) => fromSM(
    activity,
    (id: number) => users[id] ?? undefined,
    (hash: string) => files[hash] ?? undefined,
  )
);

const convertManySel = (selector: Selector<ActivitySM[]>) => createSelector(
  selector,
  UserSelectors.entities,
  FileUploadedSelectors.basic.entities,
  (items, users, files) => items?.map(item =>
    fromSM(
      item,
      (id: number) => users[id] ?? undefined,
      (hash: string) => files[hash] ?? undefined,
    )
  ) ?? []
);

const convertOne = (item: ActivitySM) => createSelector(
  UserSelectors.entities,
  FileUploadedSelectors.basic.entities,
  (users, files) => fromSM(
    item,
    (id: number) => users[id] ?? undefined,
    (hash: string) => files[hash] ?? undefined,
  )
);

const convertMany = (items: ActivitySM[]) => createSelector(
  UserSelectors.entities,
  FileUploadedSelectors.basic.entities,
  (users, files) => items?.map(item =>
    fromSM(
      item,
      (id: number) => users[id] ?? undefined,
      (hash: string) => files[hash] ?? undefined,
    )
  ) ?? []
);


const fromSM: (
  sm: ActivitySM,
  getUser: (userId: number) => UserSM,
  getFile: (hash: string) => FileUploadedSM,
) => Activity =
  (sm: ActivitySM, getUser: (id: number) => UserSM, getFile: (hash: string) => FileUploadedSM) => {

    const { files, ...rest } = { ...sm }

    return !sm ? undefined : {
      ...rest,
      gradesReleaseDate: fromStringToDate(sm.gradesReleaseDate),
      publishDate: fromStringToDate(sm.publishDate),
      submissionBegin: fromStringToDate(sm.submissionBegin),
      submissionEnd: fromStringToDate(sm.submissionEnd),
      createdBy: getUser(sm.createdById),
      createdDate: fromStringToDate(sm.createdDate),
      lastModifiedBy: getUser(sm.lastModifiedById),
      lastModifiedDate: fromStringToDate(sm.lastModifiedDate),
      files: files?.map(getFile) ?? [],
    };
  }


export const ActivityAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  one: convertOne,
  many: convertMany,
}
