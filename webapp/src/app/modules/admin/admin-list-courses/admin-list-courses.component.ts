import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { AdminService } from './../admin.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { CourseActions } from 'src/app/state/course/course.actions';
import { Actions, ofType } from '@ngrx/effects';
import { filter, first, map, take } from 'rxjs/operators';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';


@Component({
  selector: 'app-admin-list-courses',
  templateUrl: './admin-list-courses.component.html',
  styleUrls: ['./admin-list-courses.component.css']
})
export class AdminListCoursesComponent implements OnInit, OnDestroy {

  /**
   * Activity identification
   *
   */
  @Input() activityId: number;
  courses: Course[];
  canAddMember$: Observable<boolean>;
  @ViewChild('modalError') modalError!: ModalFormComponent;
  @ViewChild('confirmDelete') confirmDelete!: ModalFormComponent;
  @ViewChild('errorMessage') errorMessage!: ElementRef;
  private translationSubscription: Subscription | undefined;
  
  constructor(
    private adminService: AdminService,
    private store: Store,
    private actions$: Actions,
    private translationService: TranslationService
  ) { }


  screenSize: 'small' | 'normal' | 'big' = 'big';

  translationText: typeof LANGUAGE.admin.AdminListCoursesComponent;

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.admin.AdminListCoursesComponent
      }
    );
    this.getCourses();
    this.canAddMember$ = this.store.select(ParticipationAdvancedSelectors.hasPermission('edit_course'));
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  getCourses() {
    this.adminService.getCourses().subscribe((res) => {
      this.courses = res;
    });
  }

  deleteCourse(enable: boolean, id: number) {
    if(enable) {
      this.store.dispatch(CourseActions.api.delete.request({
        input: {id}
      }))
      
      this.actions$.pipe(
        ofType(CourseActions.api.delete.success),
        map(() => {
          this.getCourses();
        }),
        take(1)
      ).subscribe()
      
      
      this.actions$.pipe(
        ofType(CourseActions.api.delete.error),
        filter(({input, error}) => input.id== id),
        map((error) => {
          const errorMessageElement = this.errorMessage.nativeElement as HTMLElement;
          errorMessageElement.innerText = this.translationText.deleteError;
          console.log("quantas vezes")
          this.modalError.open()
        }),
        take(1)
      ).subscribe()
    }
  };


  @HostListener('window:resize', ['$event'])
  updateScreenSize(event) {
    const size = window.screen.availWidth;

    if (size > 500) {
      this.screenSize = 'big';
    } else {
      this.screenSize = 'small';
    }
  }
}
