import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { ActivitiesService } from '../../activities.service';
import { LANGUAGE } from '../../../../dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-activities-menu',
  templateUrl: './activities-menu.component.html',
  styleUrls: ['./activities-menu.component.css']
})

export class ActivitiesMenuComponent implements OnInit, OnDestroy{

  canCreate$: Observable<boolean>;
  courseId$: Observable<number>;

  translationText: typeof LANGUAGE.activities.ActivitiesMenuComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private store: Store,
    private translationService: TranslationService
  ) {
    this.courseId$ = this.store.select(CourseSelectors.currentId).pipe(map(id => Number(id)));
    this.canCreate$ = this.store.select(ParticipationAdvancedSelectors.hasPermission('create_activities'))
  }

  ngOnInit(): void {

    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesMenuComponent
      }
    );
  }
  
  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }
}
