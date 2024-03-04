import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { concatMap, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { ActivityItem, ActivityItemSM } from 'src/app/models/activity-item.model';
import { Activity, ActivityStates } from 'src/app/models/activity.model';
import { User } from 'src/app/models/user.model';
import { ActivitiesApiService } from 'src/app/services/api/activities.api.service';
import { ActivityItemActions } from 'src/app/state/activity-item/activity-item.actions';
import { ActivityItemAdvancedSelectors } from 'src/app/state/activity-item/activity-item.advanced.selector';
import { ActivityItemSelectors } from 'src/app/state/activity-item/activity-item.selector';
import { ParticipationActions } from 'src/app/state/participation/participation.actions';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { ActivitiesService } from '../activities.service';
import { ActivitySubmissionActions } from 'src/app/state/activity-submission/activity-submission.actions';
import { GradesFinalActions } from 'src/app/state/grades-final/grades-final.actions';
import { ActivityEvaluationActions } from 'src/app/state/activity-evaluation/activity-evaluation.actions';
import { ActivityActions } from 'src/app/state/activity/activity.actions';
import { WallPostActions } from 'src/app/state/wall-post/wall-post.actions';
import { WallPostForm } from 'src/app/models/wall-post.model';
import { WallService } from '../../wall/wall.service';
import { SharedService } from '../../shared/shared.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-activities-list-students',
  templateUrl: './activities-list-students.component.html',
  styleUrls: ['./activities-list-students.component.css']
})
export class ActivitiesListStudentsComponent implements OnInit, OnDestroy {
  translationText: typeof LANGUAGE.activities.ActivitiesListStudentsComponent;
  translationTextPost: typeof LANGUAGE.wall.WallPostComponent;
  translationTextConfirmDelete: typeof LANGUAGE.shared.ConfirmDeleteComponent;
  private translationSubscription: Subscription | undefined;

  @Input() activityStatus: ActivityStates;
  @Input() activity: Activity;
  @Input() courseId: number;

  allItems$: Observable<ActivityItem[]>;
  allStudents$: Observable<User[]>;
  usersWithoutSubmission$: Observable<User[]>;

  evaluatedItems$: Observable<ActivityItem[]>;
  submittedButNotEvaluated$: Observable<ActivityItem[]>;
  itemsToEvaluate$: Observable<ActivityItem[]>;

  screenSize: 'small' | 'normal' | 'big' = 'big';
  collapseList = false;

  gradeReleasedMarker = '[GRADES | n1i2e3d4]';

  public get states(): typeof ActivityStates {
    return ActivityStates;
  }

  constructor(private store: Store, private activitiesApi: ActivitiesApiService, private translationService: TranslationService) { }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesListStudentsComponent
        this.translationTextPost = translation.wall.WallPostComponent
        this.translationTextConfirmDelete = translation.shared.ConfirmDeleteComponent
      }
    );
    this.setObservables();
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  setObservables() {
    
    // dispatch a fetchAll of activities items to update activity items entities
    this.store.dispatch(ActivityItemActions.fetchAll.request({
      input: {
        activityId: this.activity.id,
        courseId: this.courseId
      }
    }));

    this.allItems$ = this.store.select(ActivityItemAdvancedSelectors.sel.many(
      ActivityItemSelectors.byActivityId(this.activity.id)
    ))
    /*
    this.allItems$.pipe(
      map((items) => items.map((item) => {
        console.log(item)
        this.store.dispatch(ActivityEvaluationActions.get.request({
          input: {
            courseId: this.courseId,
            activityId: item.activity.id,
            submissionId: item.submission.id
          }
        }))
        return item
      })),
    )
    */
    this.store.dispatch(ParticipationActions.fetchAllUsersWithRoles.request({
      input: {
        courseId: this.courseId
      }
    }))

    const studentRoleIds$ = this.store.select(ParticipationAdvancedSelectors.ofCurrentCourse.uniqueRoles).pipe(
      map(roles => roles?.filter(role =>
        role.permissions.some(permission => permission.name == 'create_activity_submissions') ?? []
      )),
      map(roles => roles.map(role => role.id))
    )

    this.allStudents$ = this.store.select(
      ParticipationAdvancedSelectors.ofCurrentCourse.usersAndRoles
    ).pipe(
      withLatestFrom(studentRoleIds$),
      map(([usersAndRoles, roleIds]) => usersAndRoles
        .filter(item => roleIds.includes(item.role.id))
        .map(item => item.user)
      )
    )

    this.evaluatedItems$ = this.allItems$.pipe(
      map(items => items?.filter(item => item?.evaluation?.id) ?? [])
    )

    this.usersWithoutSubmission$ = combineLatest([this.allStudents$, this.allItems$]).pipe(
      map(([users, items]) => users?.filter(user => !items.some(item => item.user?.id === user.id)) ?? [])
    );

    this.submittedButNotEvaluated$ = combineLatest([this.allItems$, this.evaluatedItems$]).pipe(
      map(([all, evaluated]) => all?.filter(item => !evaluated.some(e => e.user.id === item.user.id)) ?? []),
      map(items => items.filter(item => item?.submission?.id)),
    )

    this.itemsToEvaluate$ = combineLatest([this.submittedButNotEvaluated$, this.usersWithoutSubmission$]).pipe(
      map(([toEval, users]) => [
        ...toEval,
        ...users.map(user => {
          return { activity: this.activity, user } as ActivityItem;
        })
      ])
    )
  }

  @HostListener('window:resize')
  checkWidth(): void {
    const size = window.screen.availWidth;
    console.log({ size })

    if (size > 500) {
      this.screenSize = 'big';
    } else {
      this.screenSize = 'small';
    }
  }

  toggleVisibility() {
    this.collapseList = !this.collapseList;
  }

  releaseGrades(enable: boolean) {

    if (!enable) { return; }

    this.store.dispatch(ActivityActions.releaseGrades.request({
      input: {
        id: this.activity.id,
        courseId: this.courseId
      }
    }));

    const textForm: string = this.gradeReleasedMarker + this.translationTextPost.activityPost.title4 + " \"" + this.activity.title + "\" " +
                            this.translationTextPost.activityPost.title5;

    const form: WallPostForm = {
      text: textForm,
      isFixed: false
    }

    this.store.dispatch(WallPostActions.api.byCourse.id.createWithCreatedById.request({
      input: {
        courseId: this.courseId,
        userId: 1,
        body: {
          text: textForm,
          isFixed: false
        }
      }
    }))
    this.activity.gradesReleaseDate = new Date();
    this.activityStatus = this.states.GradesReleased;
  }
}
