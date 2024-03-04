import { createSelector } from "@ngrx/store";
import { HaveFilesSM } from "src/app/models/file-uploaded.model";
import { Selector } from "..";
import { FileUploadedSelectors } from "./file-uploaded.selector";

const selectOneList = (selector: Selector<HaveFilesSM>) => createSelector(
  selector,
  FileUploadedSelectors.basic.entities,
  (item, files) => item?.files.map(fileHash => files[fileHash] ?? undefined)
);

const selectManyLists = (selector: Selector<HaveFilesSM[]>) => createSelector(
  selector,
  FileUploadedSelectors.basic.entities,
  (list, files) => list?.map(item => item?.files.map(fileHash => files[fileHash] ?? undefined) ?? [])
);

const convertMany = (list: HaveFilesSM[]) => createSelector(
  FileUploadedSelectors.basic.entities,
  (files) => list?.map(item => item?.files.map(fileHash => files[fileHash] ?? undefined) ?? []) ?? []
);

const convertOne = (item: HaveFilesSM) => createSelector(
  FileUploadedSelectors.basic.entities,
  (files) => item?.files.map(fileHash => files[fileHash] ?? undefined) ?? []
);


export const FileUploadedAdvancedSelectors = {
  select: {
    one: selectOneList,
    many: selectManyLists,
  },
  convert: {
    one: convertOne,
    many: convertMany,
  },
  selectManyStrings: (selector: Selector<string[]>) => createSelector(
    selector,
    FileUploadedSelectors.basic.entities,
    (list, files) => list?.map(id => files[id] ?? undefined) ?? []
  )
}
