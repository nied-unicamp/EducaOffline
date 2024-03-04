import { createSelector } from "@ngrx/store";
import { Course } from "src/app/models/course.model";
import { GradesFinal, GradesFinalSM } from "src/app/models/grades-final.model";
import { UserSM } from "src/app/models/user.model";
import { Selector } from "..";
import { CourseAdvancedSelectors } from "../course/course.advanced.selectors";
import { CourseSelectors } from "../course/course.selector";
import { AppState } from "../state";
import { UserSelectors } from "../user/user.selector";


const selectCourseId = (selector: Selector<GradesFinalSM>) => createSelector(
  selector,
  (item) => item.courseId
);
const selectCourse = (selector: Selector<number>) => createSelector(
  selector,
  CourseSelectors.entities,
  (id, entities) => entities[id]
);


const convertOneSel = (selector: Selector<GradesFinalSM>) => createSelector(
  selector,
  CourseAdvancedSelectors.sel.one(selectCourse(selectCourseId(selector))),
  UserSelectors.entities,
  (final, course, users) => fromSM(
    final, course,
    (id: number) => users[id] ?? undefined,
  )
);

const convertOne = (final: GradesFinalSM) => createSelector(
  CourseAdvancedSelectors.sel.one(CourseSelectors.byId(final.courseId)),
  UserSelectors.byId(final.userId),
  (course, user) => ({
    course, user,
    score: final.score,
  }) as GradesFinal
);

const convertManySel = (selector: Selector<GradesFinalSM[]>) => createSelector(
  (state: AppState) => selector(state).map(value => convertOne(value)(state)),
  (finals) => finals
);

const convertMany = (finals: GradesFinalSM[]) => createSelector(
  (state: AppState) => finals.map(final => convertOne(final)(state)),
  (result) => result
);

const fromSM: (
  sm: GradesFinalSM,
  course: Course,
  getUser: (id: number) => UserSM,
) => GradesFinal = (
  sm: GradesFinalSM,
  course: Course,
  getUser: (id: number) => UserSM,
  ) => {

    return {
      course,
      user: getUser(sm.userId),
      score: sm?.score,
    };
  }


export const GradesFinalAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  one: convertOne,
  many: convertMany,
}
