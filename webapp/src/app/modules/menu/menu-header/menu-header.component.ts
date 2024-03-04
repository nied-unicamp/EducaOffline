import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { LoginActions } from 'src/app/state/login/login.actions';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { MenuService } from '../menu.service';
import { SharedService } from './../../shared/shared.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { LANGUAGE } from 'src/app/dev/languages';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.css']
})
export class MenuHeaderComponent implements OnInit, OnDestroy {

  title$: Observable<string>
  photoUrl$: Observable<string>;
  private translationSubscription: Subscription | undefined;
  translationText: typeof LANGUAGE.home.HomeComponent;

  constructor(
    private store: Store,
    private router: Router,
    private sharedService: SharedService,
    private menuService: MenuService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.home.HomeComponent
        this.title$ = this.store.select(CourseSelectors.current).pipe(
          map(c => c?.name),
          distinctUntilChanged<string>(),
          map(n => n ?? this.translationText.myCourses)
        )
      }
 	  );
    this.setObservables();
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  setObservables() {
    this.title$ = this.store.select(CourseSelectors.current).pipe(
      map(c => c?.name),
      distinctUntilChanged<string>(),
      map(n => n ?? this.translationText.myCourses)
    )

    this.photoUrl$ = this.store.select(UserSelectors.current).pipe(
      distinctUntilChanged<User>(deepEqual),
      map(u => u?.picture
        ? this.menuService.getProfilePhoto(u.id)
        : null)
    )
  }

  logout() {
    console.log('Goodbye!');
    this.store.dispatch(LoginActions.clear())
    this.router.navigate(['/login']);
  }
}
