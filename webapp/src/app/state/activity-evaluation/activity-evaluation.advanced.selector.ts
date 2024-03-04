import { createSelector } from "@ngrx/store";
import { fromStringToDate } from "src/app/models";
import { ActivityEvaluation, ActivityEvaluationSM } from "src/app/models/activity-evaluation.model";
import { UserSM } from "src/app/models/user.model";
import { Selector } from "..";
import { UserSelectors } from "../user/user.selector";


const convertOneSel = (selector: Selector<ActivityEvaluationSM>) => createSelector(
  selector,
  UserSelectors.entities,
  (item, users) => fromSM(item, (id: number) => users[id] ?? undefined)
);

const convertManySel = (selector: Selector<ActivityEvaluationSM[]>) => createSelector(
  selector,
  UserSelectors.entities,
  (items, users) => items?.map(item =>
    fromSM(item, (id: number) => (users[id] ?? undefined))
  ) ?? []
);

const convertOne = (item: ActivityEvaluationSM) => createSelector(
  UserSelectors.entities,
  (users) => fromSM(item, (id: number) => users[id] ?? undefined)
);

const convertMany = (items: ActivityEvaluationSM[]) => createSelector(
  UserSelectors.entities,
  (users) => items?.map(item =>
    fromSM(item, (id: number) => (users[id] ?? undefined))
  ) ?? []
);

const fromSM: (sm: ActivityEvaluationSM, getUser: (id: number) => UserSM) => ActivityEvaluation =
  (sm: ActivityEvaluationSM, getUser: (id: number) => UserSM) => {

    return !sm ? undefined : {
      ...sm,
      lastModifiedBy: getUser(sm.lastModifiedById),
      lastModifiedDate: fromStringToDate(sm.lastModifiedDate)
    };
  }


export const ActivityEvaluationAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  one: convertOne,
  many: convertMany,
}
