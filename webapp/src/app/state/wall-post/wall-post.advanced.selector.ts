import { createSelector } from "@ngrx/store";
import { fromStringToDate } from "src/app/models";
import { UserSM } from "src/app/models/user.model";
import { WallPost, WallPostSM } from "src/app/models/wall-post.model";
import { Selector } from "..";
import { UserSelectors } from "../user/user.selector";


const convertOneSel = (selector: Selector<WallPostSM>) => createSelector(
  selector,
  UserSelectors.entities,
  (item, users) => fromSM(item, (id: number) => users[id] ?? undefined)
);

const convertManySel = (selector: Selector<WallPostSM[]>) => createSelector(
  selector,
  UserSelectors.entities,
  (items, users) => items?.map(item =>
    fromSM(item, (id: number) => (users[id] ?? undefined))
  ) ?? []
);

const convertOne = (item: WallPostSM) => createSelector(
  UserSelectors.entities,
  (users) => fromSM(item, (id: number) => users[id] ?? undefined)
);

const convertMany = (items: WallPostSM[]) => createSelector(
  UserSelectors.entities,
  (users) => items?.map(item =>
    fromSM(item, (id: number) => (users[id] ?? undefined))
  ) ?? []
);

const fromSM: (sm: WallPostSM, getUser: (id: number) => UserSM) => WallPost =
  (sm: WallPostSM, getUser: (id: number) => UserSM) => {
    return !sm ? undefined : {
      ...sm,
      teacher: sm.teacher,
      createdBy: getUser(sm.createdById),
      createdDate: fromStringToDate(sm.createdDate),
      lastModifiedBy: getUser(sm.lastModifiedById),
      lastModifiedDate: fromStringToDate(sm.lastModifiedDate)
    };
  }


export const WallPostAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  one: convertOne,
  many: convertMany,
}
