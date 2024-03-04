import { createSelector } from "@ngrx/store";
import { ActivityEvaluation } from "src/app/models/activity-evaluation.model";
import { ActivityItem, ActivityItemSM } from "src/app/models/activity-item.model";
import { ActivitySubmission } from "src/app/models/activity-submission.model";
import { Activity } from "src/app/models/activity.model";
import { UserSM } from "src/app/models/user.model";
import { Selector } from "..";
import { ActivityEvaluationAdvancedSelectors } from "../activity-evaluation/activity-evaluation.advanced.selector";
import { ActivityEvaluationSelectors } from "../activity-evaluation/activity-evaluation.selector";
import { ActivitySubmissionAdvancedSelectors } from "../activity-submission/activity-submission.advanced.selector";
import { ActivitySubmissionSelectors } from "../activity-submission/activity-submission.selector";
import { ActivityAdvancedSelectors } from "../activity/activity.advanced.selector";
import { ActivitySelectors } from "../activity/activity.selector";
import { AppState } from "../state";
import { UserSelectors } from "../user/user.selector";
import { ActivityItemSelectors } from "./activity-item.selector";


const selectActivityId = (selector: Selector<ActivityItemSM>) => createSelector(
  selector,
  (item) => item?.activityId
);
const selectActivity = (selector: Selector<number>) => createSelector(
  selector,
  ActivitySelectors.basic.entities,
  (id, entities) => entities[id] ?? undefined
);
const selectSubmissionId = (selector: Selector<ActivityItemSM>) => createSelector(
  selector,
  (item) => item?.submissionId
);
const selectSubmission = (selector: Selector<number>) => createSelector(
  selector,
  ActivitySubmissionSelectors.basic.entities,
  (id, entities) => !id ? undefined : entities[id] ?? undefined
);
const selectEvaluationId = (selector: Selector<ActivityItemSM>) => createSelector(
  selector,
  (item) => item?.evaluationId
);
const selectEvaluation = (selector: Selector<number>) => createSelector(
  selector,
  ActivityEvaluationSelectors.basic.entities,
  (id, entities) => !id ? undefined : entities[id] ?? undefined
);


const convertOneSel = (selector: Selector<ActivityItemSM>) => createSelector(
  selector,
  ActivityAdvancedSelectors.sel.one(selectActivity(selectActivityId(selector))),
  ActivitySubmissionAdvancedSelectors.sel.one(selectSubmission(selectSubmissionId(selector))),
  ActivityEvaluationAdvancedSelectors.sel.one(selectEvaluation(selectEvaluationId(selector))),
  UserSelectors.entities,
  (item, activity, submission, evaluation, users) => fromSM(
    item, activity, submission, evaluation,
    (id: number) => users[id] ?? undefined,
  )
);

const convertOne = (item: ActivityItemSM) => createSelector(
  ActivityAdvancedSelectors.sel.one(ActivitySelectors.byId(item?.activityId)),
  ActivitySubmissionAdvancedSelectors.sel.one(ActivitySubmissionSelectors.byId(item?.submissionId)),
  ActivityEvaluationAdvancedSelectors.sel.one(ActivityEvaluationSelectors.byId(item?.evaluationId)),
  UserSelectors.byId(item?.userId),
  (activity, submission, evaluation, user) => ({
    activity, submission, evaluation, user
  } as ActivityItem)
);

const convertManySel = (selector: Selector<ActivityItemSM[]>) => createSelector(
  (state: AppState) => selector(state).map(value => convertOne(value)(state)),
  (items) => items
);

const convertMany = (items: ActivityItemSM[]) => createSelector(
  (state: AppState) => items.map(item => convertOne(item)(state)),
  (result) => result
);

const fromSM: (
  sm: ActivityItemSM,
  activity: Activity,
  submission: ActivitySubmission,
  evaluation: ActivityEvaluation,
  getUser: (id: number) => UserSM,
) => ActivityItem = (
  sm: ActivityItemSM,
  activity: Activity,
  submission: ActivitySubmission,
  evaluation: ActivityEvaluation,
  getUser: (id: number) => UserSM,
  ) => {

    return {
      activity, submission, evaluation,
      user: getUser(sm?.userId),
    };
  }


const selectByCourseId = (courseId: number) => createSelector(
  ActivitySelectors.byCourse.id.ids(courseId),
  ActivityItemSelectors.basic.all,
  (activityIds, items) => activityIds?.map(id =>
    items?.filter(item => item?.activityId === id) ?? []
  )
    .filter(myItems => myItems.length > 0)
    .reduce((a, b) => a.concat(b), [])
    ?? []
);

export const ActivityItemAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  one: convertOne,
  many: convertMany,
  byCourseId: selectByCourseId
}
