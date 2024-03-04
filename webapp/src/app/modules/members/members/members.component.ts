import { LoginSelectors } from 'src/app/state/login/login.selector';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { RoleSM } from 'src/app/models/role.model';
import { User } from 'src/app/models/user.model';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { ParticipationActions } from 'src/app/state/participation/participation.actions';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { LoginState as State } from 'src/app/state/login/login.state';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { LANGUAGE } from 'src/app/dev/languages';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit, OnDestroy {
  courseId: number;
  canAddMember$: Observable<boolean>;

  translationText: typeof LANGUAGE.members.MembersComponent;
  private translationSubscription: Subscription | undefined;

  users$: Observable<User[][]>
  myId$: Observable<number>

  activeRoles$: Observable<RoleSM[]>
  roles$: Observable<RoleSM[]>
  isAdmin$: Observable<boolean>

  filter$: BehaviorSubject<RoleSM>
  sortBy$: BehaviorSubject<string>
  reverseSort$: BehaviorSubject<boolean>

  sortText;
  sortOptions;

  setObservables() {
    this.sortText = { name: this.translationText?.name /* , creationDate: 'Data de criação' */ };
    this.sortOptions = Object.keys(this.sortText);
    this.canAddMember$ = this.store.select(ParticipationAdvancedSelectors.hasPermission('edit_course'));

    // UI Controls
    this.filter$ = new BehaviorSubject(null);
    this.sortBy$ = new BehaviorSubject('name');
    this.reverseSort$ = new BehaviorSubject(false);

    // Users and respective roles in the course
    const allUsersAndRoles$ = this.store.select(ParticipationAdvancedSelectors.ofCurrentCourse.usersAndRoles).pipe(
      distinctUntilChanged<{ user: User, role: RoleSM }[]>(deepEqual),
    )

    // All roles active in this course. To be used in filter selection
    this.activeRoles$ = this.store.select(ParticipationAdvancedSelectors.ofCurrentCourse.uniqueRoles).pipe(
      distinctUntilChanged<RoleSM[]>(deepEqual),
    );

    // Roles to display
    this.roles$ = this.filter$.pipe(
      switchMap((role) => !role
        ? this.activeRoles$
        : of([role])
      ),
      distinctUntilChanged<RoleSM[]>(deepEqual),
    );

    // Group users by role
    const usersGroupedByRole$ = combineLatest([this.roles$, allUsersAndRoles$]).pipe(
      distinctUntilChanged<[RoleSM[], { user: User, role: RoleSM }[]]>(deepEqual),
      map(([roles, usersAndRoles]) => roles.map(role =>
        usersAndRoles.filter(ur => ur.role.id === role.id)
          ?.map(ur => ur?.user)
      )),
    )
    this.myId$ = this.store.select(LoginSelectors.loggedUserId);

    // Sort user inside each role
    this.users$ = combineLatest([usersGroupedByRole$, this.sortBy$, this.reverseSort$, this.myId$]).pipe(
      map(([userGroups, sortBy, reverse, myId]) => userGroups.map(
        users => {
          const rev = reverse ? -1 : 1;

          // TODO: Implement other sorting methods besides using the user name
          return users.sort((a, b) => {
            if (a.id==myId) {
              return -1
            } else if (b.id==myId) {
              return 1
            }
            return a.name.localeCompare(b.name) * rev
          } )
        }
      )),
      distinctUntilChanged<User[][]>(deepEqual),
    )

    //set user ID

   /*  console.log("\n\n ");
    this.myId$.subscribe((valor:number)=> {
      console.log({valor});
    })
    console.log("\n\n "); */
  }

  constructor(
    private store: Store,
    private translationService: TranslationService
  ) {
  }

  ngOnInit() {

    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.members.MembersComponent
      }
 	  );
    // Get current course id
    this.store.select(CourseSelectors.currentId).pipe(
      distinctUntilChanged()
    ).subscribe({ next: (id: number) => this.courseId = id });

    this.setObservables();

    this.store.dispatch(ParticipationActions.fetchAllUsersWithRoles.request({ input: { courseId: this.courseId } }));
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  reverse() {
    this.reverseSort$.next(!this.reverseSort$.getValue());
  }

  filter(role: RoleSM) {
    this.filter$.next(role);
  }

  sort(value: string) {
    this.sortBy$.next(value);
  }

  getFilterText(r: RoleSM) {
    return !r
      ? this.translationText?.all
      : r.name === 'TEACHER'
        ? this.translationText?.teachers
        : r.name === 'STUDENT'
          ? this.translationText?.students
          : this.translationText?.admins
  }
}
