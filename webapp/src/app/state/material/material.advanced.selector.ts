import { createSelector } from "@ngrx/store";
import { fromStringToDate } from "src/app/models";
import { FileUploaded } from "src/app/models/file-uploaded.model";
import { Material, MaterialSM } from "src/app/models/material.model";
import { UserSM } from "src/app/models/user.model";
import { Selector } from "..";
import { FileUploadedAdvancedSelectors } from "../file-uploaded/file-uploaded.advanced.selector";
import { UserSelectors } from "../user/user.selector";


const convert: (sm: MaterialSM, convertedFiles: FileUploaded[], getUser: (id: number) => UserSM) => Material =
  (sm: MaterialSM, convertedFiles: FileUploaded[], getUser: (id: number) => UserSM) => {

    return !sm ? undefined : {
      ...sm,
      files: convertedFiles,
      createdBy: getUser(sm.createdById),
      createdDate: fromStringToDate(sm.createdDate),
      lastModifiedBy: getUser(sm.lastModifiedById),
      lastModifiedDate: fromStringToDate(sm.lastModifiedDate)
    };
  }


const convertOneSel = (selector: Selector<MaterialSM>) => createSelector(
  selector,
  FileUploadedAdvancedSelectors.select.one(selector),
  UserSelectors.entities,
  (item, files, users) => convert(item, files, (id: number) => users[id] ?? undefined)
);

const convertManySel = (selector: Selector<MaterialSM[]>) => createSelector(
  selector,
  FileUploadedAdvancedSelectors.select.many(selector),
  UserSelectors.entities,
  (items, files, users) => items?.map((item, index) => convert(item, files[index], (id: number) => users[id] ?? undefined)) ?? []
);


const convertOne = (item: MaterialSM) => createSelector(
  UserSelectors.entities,
  FileUploadedAdvancedSelectors.convert.one(item),
  (users, files) => convert(item, files, (id: number) => users[id] ?? undefined)
);

const convertMany = (items: MaterialSM[]) => createSelector(
  UserSelectors.entities,
  FileUploadedAdvancedSelectors.convert.many(items),
  (users, files) => items?.map((item, index) =>
    convert(item, files[index], (id: number) => (users[id] ?? undefined))
  ) ?? []
);

export const MaterialAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  convert: {
    one: convertOne,
    many: convertMany,
  }
}
