import { Injectable } from '@angular/core';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types';
import { Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { MenuItem } from 'src/app/models/menu';
import { UserSM } from 'src/app/models/user.model';
import { selectRouteParam } from 'src/app/state/router/router.selector';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { SharedService } from '../shared/shared.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { LANGUAGE } from 'src/app/dev/languages';


@Injectable()
export class MenuService {

  translationText: typeof LANGUAGE.course.LeftMenuComponent
  private translationSubscription: Subscription | undefined;

  home_items: MenuItem[];
  admin_items: MenuItem[];

  constructor(
    private sharedService: SharedService,
    private store: Store,
    private translationService: TranslationService
  ) { 
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.course.LeftMenuComponent
        this.setLanguageItems();
      }
    );
  
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  setLanguageItems(): void {
    this.home_items = [{
      icon_type: 'fas',
      icon: 'book-open',
      link: `/courses`,
      text: this.translationText.courses
    },
    {
      icon_type: 'far',
      icon: 'calendar-alt',
      link: `/calendar`,
      text: this.translationText.calendar
    },
    {
      icon_type: 'far',
      icon: 'chart-bar',
      link: `/grades`,
      text: this.translationText.performance
    }];

    this.admin_items = [{
      icon_type: 'fas',
      icon: 'book-open',
      link: `/admin/courses`,
      text: this.translationText.courses
    },
    {
      icon_type: 'fas',
      icon: 'user-shield',
      link: `/admin/list`,
      text: this.translationText.admins
    }]
  }

  getItems(): Observable<MenuItem[]> {
    const info$: Observable<[string, UserSM]> = combineLatest([
      this.store.select(selectRouteParam('courseId')),
      this.store.select(UserSelectors.current)
    ])

    return info$.pipe(
      distinctUntilChanged<[string, UserSM]>(deepEqual),
      map(([courseId, user]) => {
        if (courseId) {
          return this.getCourse(Number(courseId));
        } else if (user?.isAdmin) {
          return this.admin_items;
        }

        return this.home_items;
      }),
      startWith([]),
    )
  }

  private getCourse(courseId: number): MenuItem[] {
    return [
      {
        icon_type: 'far',
        icon: 'newspaper',
        link: `/courses/${courseId}/wall`,
        text: this.translationText?.wall
      },
      {
        icon_type: 'fas',
        icon: 'box-open',
        link: `/courses/${courseId}/material`,
        text: this.translationText.materials
      },
      {
        icon_type: 'fas',
        icon: 'tasks',
        link: `/courses/${courseId}/activities`,
        text: this.translationText.activities
      },
      {
        icon_type: 'custom' as IconPrefix,
        icon: 'grades' as IconName,
        link: `/courses/${courseId}/grades`,
        text: this.translationText.grades
      },
      {
        icon_type: 'fas',
        icon: 'user-friends',
        link: `/courses/${courseId}/members`,
        text: this.translationText.participants
      },
      {
        icon_type: 'far',
        icon: 'calendar-alt',
        link: `/courses/${courseId}/calendar`,
        text: this.translationText.calendar
      },
    ];
  }


  getProfilePhoto(userId: number) {
    const url = this.sharedService.downloadLink(
      'users/' + userId + '/picture'
    )

    return url;
  }
}
