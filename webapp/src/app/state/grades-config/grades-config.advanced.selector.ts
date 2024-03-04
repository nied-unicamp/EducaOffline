import { createSelector } from "@ngrx/store";
import { fromSMToLastModified, fromStringToDate } from "src/app/models";
import { Activity } from "src/app/models/activity.model";
import { Course } from "src/app/models/course.model";
import { GradesConfig, GradesConfigSM } from "src/app/models/grades-config.model";
import { UserSM } from "src/app/models/user.model";
import { Selector } from "..";
import { ActivityAdvancedSelectors } from "../activity/activity.advanced.selector";
import { ActivitySelectors } from "../activity/activity.selector";
import { CourseAdvancedSelectors } from "../course/course.advanced.selectors";
import { CourseSelectors } from "../course/course.selector";
import { AppState } from "../state";
import { UserSelectors } from "../user/user.selector";


const selectCourseId = (selector: Selector<GradesConfigSM>) => createSelector(
  selector,
  (item) => item?.courseId ?? -1
);

const selectCourse = (selector: Selector<number>) => createSelector(
  selector,
  CourseSelectors.entities,
  (id, entities) => entities[id] ?? undefined
);

const selectGradedActivityIds = (selector: Selector<GradesConfigSM>) => createSelector(
  selector,
  (item) => item?.gradedActivities ?? []
);

const selectNotGradedActivityIds = (selector: Selector<GradesConfigSM>) => createSelector(
  selector,
  (item) => item?.notGradedActivities ?? []
);

const selectActivities = (selector: Selector<number[]>) => createSelector(
  selector,
  ActivitySelectors.basic.entities,
  (ids, entities) => ids.map(id => entities[id]) ?? []
);

const convertOneSel = (selector: Selector<GradesConfigSM>) => createSelector(
  selector,
  CourseAdvancedSelectors.sel.one(selectCourse(selectCourseId(selector))),
  ActivityAdvancedSelectors.sel.many(selectActivities(selectGradedActivityIds(selector))),
  ActivityAdvancedSelectors.sel.many(selectActivities(selectNotGradedActivityIds(selector))),
  UserSelectors.entities,
  (item, course, graded, notGraded, users) => fromSM(item, course, graded, notGraded, (id) => users[id])
);

const convertOne = (item: GradesConfigSM) => createSelector(
  CourseAdvancedSelectors.sel.one(CourseSelectors.byId(item.courseId)),
  ActivityAdvancedSelectors.sel.many(ActivitySelectors.byIds(item.gradedActivities)),
  ActivityAdvancedSelectors.sel.many(ActivitySelectors.byIds(item.notGradedActivities)),
  UserSelectors.entities,
  (course, graded, notGraded, users) => fromSM(item, course, graded, notGraded, (id) => users[id])
);

const convertManySel = (selector: Selector<GradesConfigSM[]>) => createSelector(
  (state: AppState) => selector(state).map(value => convertOne(value)(state)),
  (items) => items
);

const convertMany = (items: GradesConfigSM[]) => createSelector(
  (state: AppState) => items.map(item => convertOne(item)(state)),
  (result) => result
);


const fromSM: (sm: GradesConfigSM, course: Course, graded: Activity[], notGraded: Activity[], getUser: (id: number) => UserSM) => GradesConfig =
  (sm: GradesConfigSM, course: Course, graded: Activity[], notGraded: Activity[], getUser: (id: number) => UserSM) => {

    return !sm ? undefined : {
      id: sm.id,
      course,
      defaultWeight: sm.defaultWeight,
      finalGradesReleased: fromStringToDate(sm.finalGradesReleased),
      gradedActivities: graded,
      notGradedActivities: notGraded,
      useArithmeticMean: sm.useArithmeticMean,
      ...fromSMToLastModified(getUser)(sm)
    } as GradesConfig;
  }


export const GradesConfigAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  one: convertOne,
  many: convertMany,
}
