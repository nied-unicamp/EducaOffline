import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course, fromJsonToCourse } from 'src/app/models/course.model';
import { CoursesService } from '../courses.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-home-enter-course',
  templateUrl: './courses-home-enter.component.html',
  styleUrls: ['./courses-home-enter.component.css']
})
export class CoursesHomeEnterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  course: Course;
  courseError: boolean;
  isProcessing: boolean;

  translationText: typeof LANGUAGE.home.HomeEnterComponent;
  private translationSubscription: Subscription | undefined;

  @Output() closeForm = new EventEmitter<void>();

  constructor(
    private coursesService: CoursesService,
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private translationService: TranslationService
  ) {
    this.form = this.fb.group({
      key: ['', [Validators.maxLength(6), Validators.required, Validators.minLength(6)]],
    });

    this.form.valueChanges.subscribe(value => {

      if (value.key.length === 6) {
        this.isProcessing = true;
        this.courseError = false;
        this.coursesService.findOpenCourseByKey(value.key).pipe(
          map(data => fromJsonToCourse(data)),
          catchError((error) => {
            return of(null);
          })
        ).subscribe(course => {
          if (course) {
            this.course = course;
            this.courseError = false;
          } else {
            this.courseError = true;
          }
          this.isProcessing = false;
        });
      } else {
        this.isProcessing = false;
        this.courseError = false;
        this.course = null;
      }
    });

  }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
          (translation) => {
            this.translationText = translation.home.HomeEnterComponent
          }
       );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  onSubmit(form) {
    this.coursesService.enrollCourseByKey(form.key).subscribe((data) => {
      this.closeForm.emit();
      this.router.navigate([`/courses/${this.course?.id}`], {
        queryParams: { refresh: true }
      });
    });
  }

  reset() {
    this.form.reset();
    this.course = null;
  }
}
