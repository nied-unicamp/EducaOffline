import { createSelector } from "@ngrx/store";
import { Selector } from "..";
import { MaterialFolder, MaterialFolderSM } from "src/app/models/material-folder.model";

const convert: (sm: MaterialFolderSM) => MaterialFolder = (sm: MaterialFolderSM) => {
  return !sm ? undefined : {
    ...sm
  };
}


const convertOneSel = (selector: Selector<MaterialFolderSM>) => createSelector(
  selector,
  (item) => convert(item)
);

const convertManySel = (selector: Selector<MaterialFolderSM[]>) => createSelector(
  selector,
  (items) => items?.map((item, index) =>
    convert(item)
  ) ?? []
);


const convertOne = (item: MaterialFolderSM) => createSelector(
  () => convert(item)
);

const convertMany = (items: MaterialFolderSM[]) => createSelector(
  () => items?.map((item, index) =>
    convert(item)
  ) ?? []
);

export const MaterialFolderAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  convert: {
    one: convertOne,
    many: convertMany,
  }
}
