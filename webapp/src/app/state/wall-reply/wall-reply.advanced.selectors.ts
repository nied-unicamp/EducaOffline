import { createSelector } from "@ngrx/store";

import { fromStringToDate } from "src/app/models";
import { UserSM } from "src/app/models/user.model";
import { WallReply, WallReplySM } from "src/app/models/wall-comment.model";
import { Selector } from "..";
import { UserSelectors } from "../user/user.selector";


const convertOneSel = (selector: Selector<WallReplySM>) => createSelector(
  selector,
  UserSelectors.entities,
  (item, users) => fromSM(item, (id: number) => users[id] ?? undefined)
);

const convertManySel = (selector: Selector<WallReplySM[]>) => createSelector(
  selector,
  UserSelectors.entities,
  (items, users) => items?.map(item =>
    fromSM(item, (id: number) => (users[id] ?? undefined))
  ) ?? []
);

const convertOne = (item: WallReplySM) => createSelector(
  UserSelectors.entities,
  (users) => fromSM(item, (id: number) => users[id] ?? undefined)
);

const convertMany = (items: WallReplySM[]) => createSelector(
  UserSelectors.entities,
  (users) => items?.map(item =>
    fromSM(item, (id: number) => (users[id] ?? undefined))
  ) ?? []
);

const fromSM: (sm: WallReplySM, getUser: (id: number) => UserSM) => WallReply =
  (sm: WallReplySM, getUser: (id: number) => UserSM) => {
    return !sm ? undefined : {
      ...sm,
      createdBy: getUser(sm.createdById),
      createdDate: fromStringToDate(sm.createdDate),
      lastModifiedBy: getUser(sm.lastModifiedById),
      lastModifiedDate: fromStringToDate(sm.lastModifiedDate)
    };
  }


export const WallReplyAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  one: convertOne,
  many: convertMany,
}
