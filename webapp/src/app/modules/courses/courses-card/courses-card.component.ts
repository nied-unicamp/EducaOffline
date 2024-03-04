import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Activity } from 'src/app/models/activity.model';
import { Course } from 'src/app/models/course.model';
import { User } from 'src/app/models/user.model';
import { ActivityActions } from 'src/app/state/activity/activity.actions';
import { ActivityAdvancedSelectors } from 'src/app/state/activity/activity.advanced.selector';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { CourseActions } from 'src/app/state/course/course.actions';
import { ParticipationActions } from 'src/app/state/participation/participation.actions';
import { ParticipationSelectors } from 'src/app/state/participation/participation.selector';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { CoursesService } from '../courses.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { LANGUAGE } from 'src/app/dev/languages';


const TEACHER_ROLE_ID = 3;
const STUDENT_ROLE_ID = 2;

@Component({
  selector: 'app-course-card',
  templateUrl: './courses-card.component.html',
  styleUrls: ['./courses-card.component.css']
})

export class CoursesCardComponent implements OnInit, OnDestroy {
  translationText: typeof LANGUAGE.home.HomeCourseViewComponent;
  private translationSubscription: Subscription | undefined;
  @Input() course: Course;

  hiddenActivities = 0;
  dropdownId = '';
  activities$: Observable<Activity[]>;
  showCap$: Observable<boolean>;
  teacher$: Observable<User>;
  showAddParticipant$: Observable<boolean>;

  constructor(
    private store: Store,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.home.HomeCourseViewComponent
      }
 	  );
    this.setCapObservable();
    this.setAddParticipantObservable();
    this.setTeacherObservable();
    this.setActivitiesObservable();

    this.store.dispatch(ActivityActions.fetchAll.request({ input: { courseId: this.course.id } }))
    this.store.dispatch(ParticipationActions.fetchAllUsersWithRoles.request({ input: { courseId: this.course.id } }))
    this.dropdownId = 'dropdownBasic1-' + this.course.id;
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  toggle() {
    this.store.dispatch(CourseActions.offlineSync.change({
      id: this.course.id,
      enabled: !this.course.offlineSync?.enable
    }))
  }

  private getRoleId$(): Observable<number>{
    const user$ = this.store.select(UserSelectors.current);

    const roleId$ = user$.pipe(
      concatMap(user => user.isAdmin
        ? of(1)
        : this.store.select(ParticipationSelectors.byPartial(
          {
            courseId: this.course.id,
            userId: user.id
          })).pipe(
            map(ps => ps[0].roleId)
          )),
    );

    return roleId$
  }

  private setAddParticipantObservable() {
    const roleId$ = this.getRoleId$()

    this.showAddParticipant$ = roleId$.pipe(
      map((id) => {
        return  id != STUDENT_ROLE_ID;
      })
    )
  }

  private setCapObservable() {
    const roleId$ = this.getRoleId$()

    this.showCap$ = roleId$.pipe(
      map(id => id === TEACHER_ROLE_ID)
    )
  }

  private setTeacherObservable() {
    const teacherId$ = this.store.select(ParticipationSelectors.byPartial(
      {
        courseId: this.course?.id,
        roleId: TEACHER_ROLE_ID
      }
    )).pipe(
      map(ps => ps && ps.length > 0 ? ps[0].userId : null)
    );

    this.teacher$ = teacherId$.pipe(
      concatMap(id => this.store.select(UserSelectors.byId(id)))
    )
  }

  private setActivitiesObservable() {

    const now = new Date()
    const limit = new Date(now.valueOf() + 1000 * 60 * 60 * 24 * 15);
    const maxActivities = 3;

    const allActivities$ = this.store.select(ActivityAdvancedSelectors.sel.many(
      ActivitySelectors.byCourse.id.all(this.course.id)
    )).pipe(
      map(activities => activities?.filter(a => a.submissionEnd > now && a.submissionEnd < limit)),
      map(activities => activities?.sort((a, b) => a.submissionEnd.valueOf() - b.submissionEnd.valueOf()))
    )

    this.activities$ = allActivities$.pipe(
      map(activities => {
        if (activities.length > maxActivities) {
          this.hiddenActivities = activities.length - maxActivities;
          return activities.slice(0, 2)
        }

        this.hiddenActivities = 0;
        return activities;
      })
    )
  }
}
