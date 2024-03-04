import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types';
import { Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { concatMap, distinctUntilChanged, filter, map, share, take, takeLast, tap } from 'rxjs/operators';
import { Activity, ActivitySM, ActivityStates } from 'src/app/models/activity.model';
import { ActivityItemSelectors } from 'src/app/state/activity-item/activity-item.selector';
import { ActivitySubmissionActions } from 'src/app/state/activity-submission/activity-submission.actions';
import { ActivityActions } from 'src/app/state/activity/activity.actions';
import { ActivityAdvancedSelectors } from 'src/app/state/activity/activity.advanced.selector';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { LoginSelectors } from 'src/app/state/login/login.selector';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { selectRouteParam } from 'src/app/state/router/router.selector';
import { ActivitiesService } from '../../activities.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FileUploadedSelectors } from 'src/app/state/file-uploaded/file-uploaded.selector';
import { Course, CourseSM } from 'src/app/models/course.model';
import { ActivityOfflineSelectors } from 'src/app/state/activity/offline/activity.offline.selector';
import { IdAndGroupId } from 'src/app/state/shared/template.state';
import { GradesFinalActions } from 'src/app/state/grades-final/grades-final.actions';
import { ActivityEvaluationActions } from 'src/app/state/activity-evaluation/activity-evaluation.actions';
import { ActivitiesApiService } from 'src/app/services/api/activities.api.service';
import { ActivityItem, ActivityItemSM } from 'src/app/models/activity-item.model';
import { ActivityItemActions } from 'src/app/state/activity-item/activity-item.actions';
import { Actions, ofType } from '@ngrx/effects';
import { ActivityOfflineActions } from 'src/app/state/activity/offline/activity.offline.actions';
import { WallPostForm, WallPostSM } from 'src/app/models/wall-post.model';
import { WallService } from 'src/app/modules/wall/wall.service';
import { WallPostActions } from 'src/app/state/wall-post/wall-post.actions';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { User } from 'src/app/models/user.model';
import { WallPostSelectors } from 'src/app/state/wall-post/wall-post.selector';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';


const blankStatusIcon = ['far', 'circle'] as [IconPrefix, IconName];
const filledStatusIcon = ['fas', 'circle'] as [IconPrefix, IconName]

type IconStatus = {
  text: string;
  textClosed: string;
  icons: [IconPrefix, IconName][];
}

type StatusText = typeof ActivitiesService.translationText.ActivitiesItemComponent.statusText;

@Component({
  selector: 'app-activities-item',
  templateUrl: './activities-item.component.html',
  styleUrls: ['./activities-item.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        width: '10px'
      })),
      state('closed', style({
        width: 'calc(100% - 50px)',
      })),
      transition('open <=> closed', [
        animate('0.15s')
      ]),
    ]),

    trigger('shownHidden', [
      state('shown', style({
        display: 'flex',
        opacity: 1
      })),
      state('hidden', style({
        display: 'none',
        opacity: 0,
      })),
      transition('* => *', [
        animate('0.1s')
      ])
    ]),
  ],
})
export class ActivitiesItemComponent implements OnInit, OnDestroy {

  @Input() item: Activity;

  courseId$: Observable<number>;
  activity: Activity;
  activity$: Observable<Activity>;
  activityStatus$: Observable<ActivityStates>;

  public get states(): typeof ActivityStates {
    return ActivityStates;
  }

  translationText: typeof LANGUAGE.activities.ActivitiesItemComponent;
  translationTextPost: typeof LANGUAGE.wall.WallPostComponent;

  private translationSubscription: Subscription | undefined;

  courseId: number;
  files$: Observable<number>;
  currentActivity$: Observable<ActivitySM>;
  course: CourseSM;
  userId: number;
  submissionId: number;

  canceledMarker: string = '[CANCELED | n1i2e3d4]';

  isOpen = true;

  roleId: number;
  status$: Observable<IconStatus>;
  canEdit$: Observable<boolean>;
  canDelete$: Observable<boolean>;
  isOffline$: Observable<boolean>;
  wasCreatedOffline: boolean = false;
  canBeEdited: boolean;
  canBeDeleted: boolean;
  canBeCanceled: boolean;
  wasDeleted: Observable<boolean>;

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private activitiesService: ActivitiesService,
    private activitiesApiService: ActivitiesApiService,
    private actions: Actions,
    private translationService: TranslationService
  ) {

    this.store.select(CourseSelectors.currentId).subscribe(id => {
      this.courseId = id;
    })
    // select the current course
    this.store.select(CourseSelectors.byId(this.courseId)).subscribe((course) =>{
      this.course = course
    })
    // check if it is offline
    this.isOffline$ = this.store.select(LoginSelectors.isOffline);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
    this.translationSubscription.unsubscribe();
  }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesItemComponent
        this.translationTextPost = translation.wall.WallPostComponent
      }
    );

    this.isOpen = false;
    this.canEdit$ = this.store.select(ParticipationAdvancedSelectors.hasPermission('update_activities'));
    this.canDelete$ = this.store.select(ParticipationAdvancedSelectors.hasPermission('delete_activities'));

    this.activity = this.item;
    
    // get userId
    this.store.select(LoginSelectors.loggedUserId).pipe(
      take(1)).subscribe((userId) => this.userId = userId)
    
    // get user role
    this.store.select(ParticipationAdvancedSelectors.currentRole).pipe(
      take(1)
    ).subscribe((role) => this.roleId = role.id)

    // check if the activity was created offline (to define the icons)
    this.store.select(ActivityOfflineSelectors.created.ids).subscribe((ids) => {
      ids.forEach((idAndGroup) => {
        if (idAndGroup.id == this.activity.id) {
          this.wasCreatedOffline = true
        }
      })
    })

    // list activity item from all activities (to find submission id)
    this.store.dispatch(ActivityItemActions.fetchAll.request({
      input: {
        courseId: this.courseId,
        activityId: this.activity.id
      }
    }))

    // select the files from the current activity
    this.files$ = this.store.select(ActivitySelectors.files(this.activity.id));

    this.currentActivity$ = this.store.select(ActivitySelectors.byId(this.activity.id));

    // if user is a student
    if (this.roleId == 2) {
      // list all submissions
      this.store.dispatch(ActivitySubmissionActions.getMine.request({
        input: {
          activityId: this.activity.id,
          courseId: this.courseId
        }
      }))


      // list activity item from all activities (to find submission id)
      this.store.dispatch(ActivityItemActions.fetchAll.request({
        input: {
          courseId: this.courseId,
          activityId: this.activity.id
        }
      }))

      
      // list activity item from all activities (to find submission id)
      this.store.dispatch(ActivityItemActions.fetchAll.request({
        input: {
          courseId: this.courseId,
          activityId: this.activity.id
        }
      }))

      this.actions.pipe(
        ofType(ActivityItemActions.fetchAll.success),
        take(1),
        tap(({ input }) => {
          // get submission id selecting activity item by activity and user ids
          this.store.select(ActivityItemSelectors.byActivityIdAndUserId({activityId: this.activity.id, userId: this.userId})).pipe(
            take(1)
          ).subscribe((item) => this.submissionId = item?.submissionId)

          console.log(this.submissionId);

          if (this.submissionId) {
            // list all submission files
            this.store.dispatch(ActivitySubmissionActions.listFiles.request({
              input: {
                courseId: this.courseId,
                activityId: this.activity.id,
                submissionId: this.submissionId,
                userId: this.userId
              }
            }))
          }
        })
      ).subscribe(); 
    }
    // if user is a teacher
    if (this.roleId == 3) {
      
      // load all files references for each submission
      this.actions.pipe(
        ofType(ActivityItemActions.fetchAll.success),
        take(1),
        concatMap(({ input }) => this.store.select(ActivityItemSelectors.byActivityId(this.activity.id)).pipe(
          take(1),
          tap((item) => {
            
            item.forEach(item => {
              if (item.submissionId) {
                this.store.dispatch(ActivitySubmissionActions.listFiles.request({
                  input: {
                    courseId: this.courseId,
                    activityId: this.activity.id,
                    submissionId: item.submissionId,
                    userId: item.userId
                  }
                }))
              }
            })
          })
        ))
        
      ).subscribe();
    }
    this.wasDeleted = this.store.select(ActivityOfflineSelectors.deleted.ids).pipe(
      map(ids => {
        let idsNumber = ids.map(id => parseInt(id))
        return idsNumber.includes(this.activity.id)
      }),
    )
    this.setActivityObservables();
  }

  delete(enable: boolean) {
    if (enable) {
      this.store.dispatch(ActivityActions.delete.request({
        input: {
          courseId: this.courseId,
          id: this.activity.id
        }
      }))
    }
  }

  cancel(enable: boolean) {

    if (!enable) { return; }
    
    let id: number = this.activity.id;

    this.delete(enable);

    if (!this.wasCreatedOffline) {
      const textForm: string = this.canceledMarker + this.translationTextPost.activityPost.title1 + " \"" + this.activity.title + "\" " +
                            this.translationTextPost.activityPost.title3;

      const form: WallPostForm = {
        text: textForm,
        isFixed: false
      }

      console.log('criação do post despachada');
      this.store.dispatch(WallPostActions.api.byCourse.id.createWithCreatedById.request({
        input: {
          courseId: this.courseId,
          userId: 1,
          body: form
        }
      }));
    } else {
      let publishedPost: WallPostSM;

      this.store.select(WallPostSelectors.byActivityId(id)).pipe(
        map((post) => publishedPost = post)
      ).subscribe()

      if (publishedPost) {
        console.log(publishedPost)
        this.store.dispatch(WallPostActions.basic.remove.one({
          data: publishedPost.id
        }))
      }
      
    }
    
  }

  toggle(value?: boolean) {
    if (value === undefined) {
      this.isOpen = !this.isOpen;
    } else {
      this.isOpen = value;
    }
  }

  private setIconsStateObservables() {

    const canEditIsSubmitted$ = this.canEdit$.pipe(
      take(1),
      concatMap(canEdit => canEdit
        ? of({ canEdit, submitted: false })
        : this.store.select(LoginSelectors.loggedUserId).pipe(
          concatMap(userId => this.store.select(ActivityItemSelectors.byActivityIdAndUserId({
            activityId: this.item.id,
            userId
          })).pipe(
            map(item => ({ canEdit, submitted: item?.submissionId > 0 }))
          )
          )
        )
      ),
      share(),
    );


    this.status$ = combineLatest([
      of(this.translationText.statusText),
      this.activity$.pipe(
        distinctUntilChanged<Activity>(deepEqual)
      ),
      this.activityStatus$,
      canEditIsSubmitted$
    ]).pipe(
      map(([myText, activity, status, { canEdit, submitted }]) => canEdit
        ? this.getTeacherIcons(activity, status, myText)
        : this.getStudentIcons(submitted, activity, status, myText)
      )
    )
  }

  getCurrentIconPosition(status: IconStatus) {
    let position = 4;

    while (status.icons[position] === blankStatusIcon) {
      position--;
    }

    return position
  }

  private getTeacherIcons(activity: Activity, status: ActivityStates, myText: StatusText) {

    const publicationDateText = ' ' + activity?.publishDate.toLocaleDateString("PT-BR")
    const submissionEndDateText = ' ' + activity?.submissionEnd.toLocaleDateString("PT-BR")

    const icons = {
      Scheduled: {
        text: myText.forTeachers.scheduled,
        textClosed: myText.forTeachers.scheduledClosed + publicationDateText,
        icons: [
          ['far', 'clock'],
          blankStatusIcon,
          blankStatusIcon,
          blankStatusIcon,
          blankStatusIcon,
        ] as [IconPrefix, IconName][],
      },
      Published: {
        text: myText.forTeachers.published,
        textClosed: myText.forTeachers.published,
        icons: [
          filledStatusIcon,
          ['far', 'check-circle'],
          blankStatusIcon,
          blankStatusIcon,
          blankStatusIcon,
        ] as [IconPrefix, IconName][]
      },
      OnSubmissionPeriod: {
        text: myText.forTeachers.submissionPeriod,
        textClosed: myText.forTeachers.submissionPeriodClosed + submissionEndDateText,
        icons: [
          filledStatusIcon,
          filledStatusIcon,
          ['fas', 'user-clock'],
          blankStatusIcon,
          blankStatusIcon,
        ] as [IconPrefix, IconName][]
      },
      Evaluate: {
        text: myText.forTeachers.evaluationPeriod,
        textClosed: myText.forTeachers.evaluationPeriodClosed,
        icons: [
          filledStatusIcon,
          filledStatusIcon,
          filledStatusIcon,
          ['fas', 'edit'],
          blankStatusIcon,
        ] as [IconPrefix, IconName][]
      },
      GradesReleased: {
        text: myText.forTeachers.evaluated,
        textClosed: myText.forTeachers.evaluated,
        icons: [
          filledStatusIcon,
          filledStatusIcon,
          filledStatusIcon,
          filledStatusIcon,
          ['far', 'grades' as IconName],
        ] as [IconPrefix, IconName][]
      },
    }

    switch (status) {
      case (ActivityStates.Scheduled):
        return icons.Scheduled;
      case (ActivityStates.Published):
        return icons.Published;
      case (ActivityStates.SubmissionStarted):
        return icons.OnSubmissionPeriod;
      case (ActivityStates.SubmissionEnded):
        return icons.Evaluate;
      case (ActivityStates.GradesReleased):
        return icons.GradesReleased;
      default:
        if (!activity?.id) {
          return icons.Scheduled;
        }

        throw new Error(`Unknown activity (id=${activity?.id}) state: ${status}`);
    }
  }

  private getStudentIcons(submitted: boolean, activity: Activity, status: ActivityStates, myText: StatusText) {
    const submissionEndDateText = ' ' + activity?.submissionEnd.toLocaleDateString("PT-BR")

    const icons = {
      Published: {
        text: myText.forStudents.published,
        textClosed: myText.forStudents.publishedClosed,
        icons: [
          ['far', 'eye'],
          blankStatusIcon,
          blankStatusIcon,
          blankStatusIcon,
          blankStatusIcon,
        ] as [IconPrefix, IconName][]
      },
      NotSubmittedYet: {
        text: myText.forStudents.submissionPeriod,
        textClosed: myText.forStudents.submissionPeriodClosed + submissionEndDateText,
        icons: [
          filledStatusIcon,
          ['fas', 'user-edit'],
          blankStatusIcon,
          blankStatusIcon,
          blankStatusIcon,
        ] as [IconPrefix, IconName][]
      },
      OnPeriodSubmitted: {
        text: myText.forStudents.submitted,
        textClosed: myText.forStudents.submissionPeriodClosed + submissionEndDateText,
        icons: [
          filledStatusIcon,
          filledStatusIcon,
          ['fas', 'user-check'],
          blankStatusIcon,
          blankStatusIcon,
        ] as [IconPrefix, IconName][]
      },
      WaitingForEvaluation: {
        text: myText.forStudents.submitted,
        textClosed: myText.forStudents.evaluationPeriodClosed,
        icons: [
          filledStatusIcon,
          filledStatusIcon,
          filledStatusIcon,
          ['fas', 'user-clock'],
          blankStatusIcon,
        ] as [IconPrefix, IconName][]
      },
      WaitingForEvaluationWithoutSubmission: {
        text: myText.forStudents.evaluationNotSubmitted,
        textClosed: myText.forStudents.evaluationPeriodClosed,
        icons: [
          filledStatusIcon,
          filledStatusIcon,
          ['fas', 'times'],
          ['fas', 'user-clock'],
          blankStatusIcon,
        ] as [IconPrefix, IconName][]
      },
      GradesReleased: {
        text: myText.forStudents.evaluated,
        textClosed: myText.forStudents.evaluated,
        icons: [
          filledStatusIcon,
          filledStatusIcon,
          filledStatusIcon,
          filledStatusIcon,
          ['far', 'grades' as IconName],
        ] as [IconPrefix, IconName][]
      },
      GradesReleasedWithoutSubmission: {
        text: myText.forStudents.evaluated,
        textClosed: myText.forStudents.evaluated,
        icons: [
          filledStatusIcon,
          filledStatusIcon,
          ['fas', 'times'],
          filledStatusIcon,
          ['far', 'grades' as IconName],
        ] as [IconPrefix, IconName][]
      }
    }

    switch (status) {
      case (ActivityStates.Published):
        return icons.Published;
      case (ActivityStates.SubmissionStarted):
        return submitted
          ? icons.OnPeriodSubmitted
          : icons.NotSubmittedYet;
      case (ActivityStates.SubmissionEnded):
        return submitted
          ? icons.WaitingForEvaluation
          : icons.WaitingForEvaluationWithoutSubmission;
      case (ActivityStates.GradesReleased):
        return submitted
          ? icons.GradesReleased
          : icons.GradesReleasedWithoutSubmission;
      default:
        throw new Error(`Unknown state for activity id=${activity.id} state: ${status}`);
    }
  }

  private setActivityObservables() {

    this.courseId$ = this.store.select(selectRouteParam('courseId')).pipe(
      map(id => Number(id))
    )

    this.subscriptions.push(
      this.courseId$.subscribe(id => this.courseId = id)
    )

    this.store.dispatch(ActivityActions.listFiles.request({
      input: {
        courseId: this.courseId,
        id: this.activity.id
      }
    }))

    this.activity$ = this.store.select(ActivityAdvancedSelectors.sel.one(ActivitySelectors.byId(this.activity.id)))
    this.activityStatus$ = this.activity$.pipe(
      map(activity => this.activitiesService.getActivityState(activity))
    );

    this.activityStatus$.subscribe(activityState => this.canBeEdited = (activityState == ActivityStates.Scheduled || activityState == ActivityStates.Published))

    this.activityStatus$.subscribe(activityState => this.canBeDeleted = (activityState == ActivityStates.Scheduled))

    this.activityStatus$.subscribe(activityState => this.canBeCanceled = (activityState == ActivityStates.Published))
    this.setIconsStateObservables()
  }
}
