import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { interval, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, share, startWith, take, tap } from 'rxjs/operators';
import { ActivityAverageGrade } from 'src/app/models/activity-average-grade';
import { ActivityItem } from 'src/app/models/activity-item.model';
import { Activity, ActivityStates } from 'src/app/models/activity.model';
import { Course } from 'src/app/models/course.model';
import { GradesConfig } from 'src/app/models/grades-config';
import { GradesFinal } from 'src/app/models/grades-final.model';
import { ActivityItemAdvancedSelectors } from 'src/app/state/activity-item/activity-item.advanced.selector';
import { ActivityAdvancedSelectors } from 'src/app/state/activity/activity.advanced.selector';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { GradesConfigAdvancedSelectors } from 'src/app/state/grades-config/grades-config.advanced.selector';
import { GradesConfigSelectors } from 'src/app/state/grades-config/grades-config.selector';
import { GradesFinalActions } from 'src/app/state/grades-final/grades-final.actions';
import { GradesFinalAdvancedSelectors } from 'src/app/state/grades-final/grades-final.advanced.selector';
import { GradesFinalSelectors } from 'src/app/state/grades-final/grades-final.selector';
import { GradesInfoSelectors } from 'src/app/state/grades-info/grades-info.selector';
import { ParticipationActions } from 'src/app/state/participation/participation.actions';
import { ActivitiesService } from '../../activities/activities.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { GradesConfigActions } from 'src/app/state/grades-config/grades-config.actions';
import { MembersService } from '../../members/members.service';
import { FinalGrade } from 'src/app/models/final-grade';

@Component({
  selector: 'app-grades-course',
  templateUrl: './grades-course.component.html',
  styleUrls: ['./grades-course.component.css']
})
export class GradesCourseComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() sent: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('tr') tableHeader: ElementRef<HTMLTableRowElement>;
  @ViewChild('tableContainer', { static: false }) tableContainer: ElementRef;

  translationText: typeof LANGUAGE.grades.GradesCourseComponent;
  private translationSubscription: Subscription | undefined;
  courseId: number;

  headerSize$: Observable<string>;

  finalGrades$: Observable<GradesFinal[]>
  gradesConfig$: Observable<GradesConfig>
  items$: Observable<ActivityItem[]>
  activities$: Observable<Activity[]>
  averages$: Observable<ActivityAverageGrade[]>;
  finalAverage$: Observable<number>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private activitiesService: ActivitiesService,
    private translationService: TranslationService,
    private membersService: MembersService
  ) {
    this.route.data.subscribe((routeData: { course: Course }) => {
      this.courseId = routeData.course?.id;

      this.store.dispatch(GradesFinalActions.getOverview.request({
        input:
          { courseId: this.courseId }
      }));

      this.store.dispatch(GradesConfigActions.get.request({
        input:
          { courseId: this.courseId }
      }));

      this.store.dispatch(ParticipationActions.fetchAllUsersWithRoles.request({ input: { courseId: this.courseId } }))
    });
  }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.grades.GradesCourseComponent
      }
 	  );
    this.finalGrades$ = this.store.select(
      GradesFinalAdvancedSelectors.sel.many(
        GradesFinalSelectors.byCourseId(this.courseId)
      )
    );

    this.finalAverage$ = this.finalGrades$.pipe(
      map(grades => {
        if (!grades || grades.length === 0) {
          return 0;
        }
        return grades.map(grade => parseFloat(grade.score)).reduce((a, b) => a + b, 0) / grades.length;
      })
    );

    this.gradesConfig$ = this.store.select(
      GradesConfigAdvancedSelectors.sel.one(
        GradesConfigSelectors.byCourseId(this.courseId)
      )
    );

    this.items$ = this.store.select(
      ActivityItemAdvancedSelectors.sel.many(
        ActivityItemAdvancedSelectors.byCourseId(this.courseId)
      )
    );

    this.activities$ = this.store.select(ActivityAdvancedSelectors.sel.many(ActivitySelectors.byCourse.current.all)).pipe(
      map(activities => activities.sort(this.sortActivitiesByEndDate))
    );
    this.averages$ = this.store.select(GradesInfoSelectors.byCourseId(this.courseId))

    this.headerSize$ = interval(100).pipe(
      take(20),
      map(_ => this.tableHeader?.nativeElement.getClientRects()[0].height),
      map(height => height + 'px'),
      startWith('auto'),
      distinctUntilChanged<string>(deepEqual),
      share()
    )
  }

  ngAfterViewInit() {
    this.tableContainer.nativeElement.addEventListener('wheel', this.handleWheel.bind(this));
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
    this.tableContainer.nativeElement.removeEventListener('wheel', this.handleWheel.bind(this));
  }

  getItem(items: ActivityItem[], userId: number, activityId: number) {
    return items?.find(item =>
      item?.activity?.id === activityId && item?.user?.id === userId
    )
  }

  submissionPeriodEnded(activity: Activity) {
    const now = new Date();

    return activity.submissionEnd.getTime() < now.getTime()
  }

  getStatusText(activity: Activity, item?: ActivityItem) {
    const status = this.activitiesService.getActivityState(activity);

    switch (status) {
      case ActivityStates.GradesReleased:
        return item?.evaluation?.score.toFixed(1);
      case ActivityStates.SubmissionEnded:
        return item?.submission?.id
          ? this.translationText.submitted
          : this.translationText.notSubmitted;
      case ActivityStates.SubmissionStarted:
        return item?.submission?.id
          ? this.translationText.submitting
          : this.translationText.notSubmitting;
      default:
        return '-'
    }
  }

  getAverage(averages: ActivityAverageGrade[], activityId: number) {
    return averages?.find(average => average?.activityId === activityId)?.average.toFixed(1);
  }

  reload() {
    location.reload();
  }

  formatGrade(grade: string | number) : string {
    if(typeof grade === 'string') {
      if(grade.length == 0) return '-';
      grade = parseFloat(grade);
    }
    return grade.toFixed(1);
  }

  scrollActivity(direction: 1 | -1) {
    const container = this.tableContainer.nativeElement;
    container.scrollLeft += direction * 200;
  }

  handleWheel(e: WheelEvent) {
    const container = this.tableContainer.nativeElement;
    if (e.deltaY > 0) {
      container.scrollLeft += 40;
    } else {
      container.scrollLeft -= 40;
    }
    
    e.preventDefault();
  }

  userIdFromFinalGrade(index: number, finalGrade: FinalGrade) {
    return finalGrade.user?.id;
  }

  getPhotoUrlById(userid: number) {
    return this.membersService.getProfilePhoto(userid);
  }

  private sortActivitiesByEndDate(a: Activity, b: Activity) {
    // compara por data de fim primeiramente, se for a mesma usa ordem alfabética.
    return a.submissionEnd > b.submissionEnd ? -1 : (a.submissionEnd < b.submissionEnd ? 1 : a.title.localeCompare(b.title) );
  }
}
