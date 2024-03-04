import { createSelector } from "@ngrx/store";
import { Activity } from "src/app/models/activity.model";
import { GradesInfo, GradesInfoSM } from "src/app/models/grades-info.model";
import { Selector } from "..";
import { ActivityAdvancedSelectors } from "../activity/activity.advanced.selector";
import { ActivitySelectors } from "../activity/activity.selector";
import { AppState } from "../state";

const selectActivityId = (selector: Selector<GradesInfoSM>) => createSelector(
  selector,
  (item) => item.activityId
);
const selectActivity = (selector: Selector<number>) => createSelector(
  selector,
  ActivitySelectors.basic.entities,
  (id, entities) => entities[id]
);


const convertOneSel = (selector: Selector<GradesInfoSM>) => createSelector(
  selector,
  ActivityAdvancedSelectors.sel.one(selectActivity(selectActivityId(selector))),
  (item, activity) => fromSM(item, activity)
);

const convertOne = (item: GradesInfoSM) => createSelector(
  ActivityAdvancedSelectors.sel.one(ActivitySelectors.byId(item.activityId)),
  (activity) => fromSM(item, activity)
);

const convertManySel = (selector: Selector<GradesInfoSM[]>) => createSelector(
  (state: AppState) => selector(state).map(value => convertOne(value)(state)),
  (items) => items
);

const convertMany = (items: GradesInfoSM[]) => createSelector(
  (state: AppState) => items.map(item => convertOne(item)(state)),
  (result) => result
);


const fromSM: (sm: GradesInfoSM, activity: Activity) => GradesInfo =
  (sm: GradesInfoSM, activity: Activity) => {
    const { activityId, ...rest } = sm;

    return !sm ? undefined : {
      ...rest,
      activity
    } as GradesInfo;
  }


export const GradesInfoAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  one: convertOne,
  many: convertMany,
}
