import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Course } from 'src/app/models/course.model';
import { Role } from 'src/app/models/role.model';
import { UserSM } from 'src/app/models/user.model';
import { CourseAdvancedSelectors } from 'src/app/state/course/course.advanced.selectors';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { ParticipationActions } from 'src/app/state/participation/participation.actions';
import { RoleSelectors } from 'src/app/state/role/role.selector';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { CoursesService } from '../courses.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { LANGUAGE } from 'src/app/dev/languages';

@Component({
  selector: 'app-home',
  templateUrl: './courses-home.component.html',
  styleUrls: ['./courses-home.component.css']
})
export class CoursesHomeComponent implements OnInit, OnDestroy {

  translationText: typeof LANGUAGE.home.HomeComponent;

  private translationSubscription: Subscription | undefined;

  courses$: Observable<Course[]>
  activeCourses$: Observable<Course[]>;
  endedCourses$: Observable<Course[]>;
  roles$: Observable<Role[]>
  isAdmin$: Observable<boolean>

  filter$: BehaviorSubject<Role>
  sortBy$: BehaviorSubject<string>
  reverseSort$: BehaviorSubject<boolean>

  sortText;
  sortOptions;

  trackCourse(index: number, course: Course) {
    return course?.id;
  }

  isCourseActive(course: Course): boolean {
    const currentDate = new Date();
    return course.startDate <= currentDate && course.endDate >= currentDate;
  }
  
  hasCourseEnded(course: Course): boolean {
    const currentDate = new Date();
    return course.endDate < currentDate;
  }

  setObservables() {
    this.filter$ = new BehaviorSubject(null);
    this.sortBy$ = new BehaviorSubject('creationDate');
    this.reverseSort$ = new BehaviorSubject(false);

    this.isAdmin$ = this.store.select(UserSelectors.current).pipe(
      distinctUntilChanged<UserSM>(deepEqual),
      map(user => user?.isAdmin),
    );

    const allCourses$ = this.isAdmin$.pipe(
      switchMap(isAdmin => isAdmin
        ? this.store.select(CourseAdvancedSelectors.sel.many(CourseSelectors.all))
        : this.store.select(CourseAdvancedSelectors.sel.many(CourseSelectors.ofCurrentUser))
      ),
      distinctUntilChanged<Course[]>(deepEqual),
    );

    const filteredCourses$ = this.filter$.pipe(

      switchMap((role) => !role
        ? allCourses$
        : this.store.select(CourseAdvancedSelectors.sel.many(CourseSelectors.ofCurrentUserAndRoleId(role.id)))
      ),
      distinctUntilChanged<Course[]>(deepEqual),
    );

    this.courses$ = combineLatest([filteredCourses$, this.sortBy$, this.reverseSort$]).pipe(
      map(([courses, sort, reverse]) => {
        const rev = reverse ? -1 : 1;

        if (sort === 'name') {
          return courses.sort((a, b) => a.name.localeCompare(b.name) * rev)
        }
        return courses.sort((a, b) => (a.startDate.getTime() - b.startDate.getTime()) * rev)
      }),

      // Only update if changed, to prevent rebuilding the child component
      distinctUntilChanged<Course[]>(deepEqual),
    );

    this.activeCourses$ = this.courses$.pipe(
      map(courses => courses.filter(course => this.isCourseActive(course))),
      distinctUntilChanged<Course[]>(deepEqual)
    );
  
    this.endedCourses$ = this.courses$.pipe(
      map(courses => courses.filter(course => this.hasCourseEnded(course))),
      distinctUntilChanged<Course[]>(deepEqual)
    );  
  }

  constructor(
    private store: Store,
    private translationService: TranslationService
  ) {
  }

  

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.home.HomeComponent
      }
 	  );
    this.sortText = { name: this.translationText.sortName, creationDate: this.translationText.sortCreationDate };
    this.sortOptions = Object.keys(this.sortText);
    this.setObservables();
    this.store.dispatch(ParticipationActions.fetchRolesAndCourses.request());
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  reverse() {
    this.reverseSort$.next(!this.reverseSort$.getValue());
  }

  filter(role: Role) {
    this.filter$.next(role);
  }

  sort(value: string) {
    this.sortBy$.next(value);
  }

  filterName(role: Role) {
    return !role
      ? 'All courses'
      : role.name === 'TEACHER'
        ? this.translationText.filterEnrolledAsTeacher
        : role.name === 'STUDENT'
          ? this.translationText.filterEnrolledAsStudent
          : role.name;
  }
}
