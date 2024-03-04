import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { LoginSelectors } from 'src/app/state/login/login.selector';
import { AppState } from 'src/app/state/state';
import { CoursesService } from '../courses.service';
import { filter, take } from 'rxjs/operators';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { User } from 'src/app/models/user.model';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { CourseSelectors } from 'src/app/state/course/course.selector';

@Component({
  selector: 'app-course',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy {
  innerHeight = 0;
  offlineAlertHeight = 24;

  subs$: Subscription[] = [];

  isOffline$: Observable<boolean>
  hasToSync$: Observable<boolean>
  user$: Observable<User>;

  offlineNotificationText: typeof LANGUAGE.home.offlineNotification;
  offlineWarningText: typeof LANGUAGE.home.offlineWarning;

  private translationSubscription: Subscription | undefined;

  @ViewChild(ModalFormComponent, { static: false }) modalFormComponent: ModalFormComponent;

  constructor(
    private store: Store<AppState>,
    private coursesService: CoursesService,
    private translationService: TranslationService
  ) {
    this.isOffline$ = this.store.select(LoginSelectors.isOffline);
    this.hasToSync$ = this.coursesService.getHasToSyncStream();

    this.getScreenSize();
  }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
          (translation) => {
            this.offlineNotificationText = translation.home.offlineNotification
            this.offlineWarningText = translation.home.offlineWarning
          }
    );
    
    this.user$ = this.store.select(UserSelectors.current)
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
    this.subs$.forEach(s => s.unsubscribe());
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerHeight = window.innerHeight;
  }

  getHeightStyle(isOffline: boolean) {
    return `calc(${this.innerHeight}px - var(--menu-diff) - ${isOffline ? this.offlineAlertHeight : 0}px)`;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event:any) {
    let warn = false;
    this.isOffline$.pipe(
      take(1),
      filter(x => x)
    ).subscribe(() => warn = true);
    if(!warn) return null; // dont do anything if it's online

    this.modalFormComponent.open(); // open modal and warn if it's offline
    event.preventDefault();
    return (event.returnValue = "");
  }
}
