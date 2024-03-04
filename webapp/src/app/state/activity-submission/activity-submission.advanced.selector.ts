import { createSelector } from "@ngrx/store";
import { fromStringToDate } from "src/app/models";
import { ActivitySubmission, ActivitySubmissionSM } from "src/app/models/activity-submission.model";
import { FileUploadedSM } from "src/app/models/file-uploaded.model";
import { UserSM } from "src/app/models/user.model";
import { Selector } from "..";
import { FileUploadedSelectors } from "../file-uploaded/file-uploaded.selector";
import { UserSelectors } from "../user/user.selector";


const convertOneSel = (selector: Selector<ActivitySubmissionSM>) => createSelector(
  selector,
  UserSelectors.entities,
  FileUploadedSelectors.basic.entities,
  (item, users, files) => fromSM(
    item,
    (id: number) => users[id] ?? undefined,
    (hash: string) => files[hash] ?? undefined,
  )
);

const convertManySel = (selector: Selector<ActivitySubmissionSM[]>) => createSelector(
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

const convertOne = (item: ActivitySubmissionSM) => createSelector(
  UserSelectors.entities,
  FileUploadedSelectors.basic.entities,
  (users, files) => fromSM(
    item,
    (id: number) => users[id] ?? undefined,
    (hash: string) => files[hash] ?? undefined,
  )
);

const convertMany = (items: ActivitySubmissionSM[]) => createSelector(
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
  sm: ActivitySubmissionSM,
  getUser: (id: number) => UserSM,
  getFile: (hash: string) => FileUploadedSM,
) => ActivitySubmission =
  (
    sm: ActivitySubmissionSM,
    getUser: (id: number) => UserSM,
    getFile: (hash: string) => FileUploadedSM,
  ) => {

    const { files, ...rest } = { ...sm }

    return !sm ? undefined : {
      ...rest,
      lastModifiedBy: getUser(sm.lastModifiedById),
      lastModifiedDate: fromStringToDate(sm.lastModifiedDate),
      createdBy: getUser(sm.createdById),
      createdDate: fromStringToDate(sm.createdDate),
      files: files?.map(getFile) ?? [],
    };
  }


export const ActivitySubmissionAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  one: convertOne,
  many: convertMany,
}
