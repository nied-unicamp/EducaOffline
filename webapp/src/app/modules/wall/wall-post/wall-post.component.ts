import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription, race } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Activity } from 'src/app/models/activity.model';
import { WallPost } from 'src/app/models/wall-post.model';
import { ActivityActions } from 'src/app/state/activity/activity.actions';
import { ActivityAdvancedSelectors } from 'src/app/state/activity/activity.advanced.selector';
import { ActivitySelectors } from 'src/app/state/activity/activity.selector';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { UserAdvancedSelectors } from 'src/app/state/user/user.advanced.selector';
import { WallPostActions } from 'src/app/state/wall-post/wall-post.actions';
import { WallService } from '../wall.service';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { User } from 'src/app/models/user.model';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-wall-post',
  templateUrl: './wall-post.component.html',
  styleUrls: ['./wall-post.component.css']
})

export class WallPostComponent implements OnInit, OnDestroy {
  translationText: typeof LANGUAGE.wall.WallPostComponent;
  private translationSubscription: Subscription | undefined;

  @Input() wallPost: WallPost;

  isActivity: boolean;
  activityPostText: Observable<string>;
  activity: Observable<Activity>;
  canceledMarker: string = '[CANCELED | n1i2e3d4]';
  gradeReleasedMarker = '[GRADES | n1i2e3d4]';
  avarageUpdateMarker = '[AVERAGE | n1i2e3d4]';
  canceledActivity: boolean;
  gradeReleased: boolean;
  averageUpdate: boolean;

  canDelete: Observable<boolean>;
  canPin: Observable<boolean>;

  courseId: number;
  expanded = true;

  profilePictureLink: Observable<string>;

  constructor(
    private actions$: Actions,
    private store: Store,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.wall.WallPostComponent
      }
 	  );
    this.isActivity = this.wallPost?.activityId > 0;
    this.store.select(CourseSelectors.currentId).pipe(take(1)).subscribe(id => this.courseId = Number(id));
    this.profilePictureLink = this.store.select(UserAdvancedSelectors.pictureLink.userId, { userId: this.wallPost.createdBy?.id });

    this.setPermissionObservables();

    this.canceledActivity = this.wallPost.text.includes(this.canceledMarker) && 
                            (this.wallPost?.createdBy?.isAdmin || !this.wallPost?.createdBy);
    this.gradeReleased = this.wallPost.text.includes(this.gradeReleasedMarker) &&
                            (this.wallPost?.createdBy?.isAdmin || !this.wallPost?.createdBy);
    this.averageUpdate = this.wallPost.text.includes(this.avarageUpdateMarker) &&
                            (this.wallPost?.createdBy?.isAdmin || !this.wallPost?.createdBy);

    if (this.isActivity) {
      this.setActivityPostObservables();
    }
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  setPermissionObservables() {
    this.canDelete = this.store.select(ParticipationAdvancedSelectors.hasPermission('delete_post'));
    this.canPin = this.store.select(ParticipationAdvancedSelectors.hasPermission('delete_post'));
  }

  setActivityPostObservables() {
    this.store.dispatch(ActivityActions.fetchOne.request({ input: { courseId: this.courseId, id: this.wallPost.activityId } }));

    this.activity = this.store.select(ActivityAdvancedSelectors.sel.one(ActivitySelectors.byId(this.wallPost.activityId)));

    this.activityPostText = this.activity.pipe(
      map(activity => {
        const txt = this.translationText.activityPost;

        const title = `${txt.title1} "${activity?.title}" ${txt.title2}`;

        const date1 = `${activity?.submissionBegin?.toLocaleDateString()} ${txt.atHours} ${activity?.submissionBegin?.toLocaleTimeString()}`;
        const date2 = `${activity?.submissionEnd?.toLocaleDateString()} ${txt.atHours} ${activity?.submissionEnd?.toLocaleTimeString()}`;
        const dates = `${txt.dates} ${date1} ${txt.untilDate} ${date2}`

        if (activity?.gradeWeight > 0) {
          return `${title}. ${dates}. ${txt.graded}`
        }

        return `${title}. ${dates}.`;
      }
      )
    )
  }

  deletePost(confirmed: boolean) {
    const id = this.wallPost.id;

    if (!confirmed) {
      return;
    }

    this.store.dispatch(WallPostActions.api.byCourse.current.delete.request({
      input: { id }
    }));


    const success$ = this.actions$.pipe(
      ofType(WallPostActions.api.byCourse.current.delete.success),
      filter(({ input }) => input.id === id),
    );

    const error$ = this.actions$.pipe(
      ofType(WallPostActions.api.byCourse.current.delete.error),
      filter(({ input }) => input.id === id),
    );

    const offlineError$ = this.actions$.pipe(
      ofType(WallPostActions.api.byCourse.current.delete.offlineError),
      filter(({ input }) => input.id === id),
    );

    race(success$, error$).pipe(take(1)).subscribe();
    offlineError$.pipe(take(1)).subscribe();
  }

  favoriteToggle() {
    this.store.dispatch(WallPostActions.api.byCourse.current.favorite.request({
      input: {
        id: this.wallPost.id,
        to: !this.wallPost.favorite
      }
    }));
  }

  likeToggle() {
    this.store.dispatch(WallPostActions.api.byCourse.current.like.request({
      input: {
        id: this.wallPost.id,
        to: !this.wallPost.liked
      }
    }));
  }

  pinToggle() {
    this.store.dispatch(WallPostActions.api.byCourse.current.pin.request({
      input: {
        id: this.wallPost.id,
        to: !this.wallPost.isFixed
      }
    }));
  }
}
