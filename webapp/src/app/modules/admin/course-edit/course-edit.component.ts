import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { Course, CourseJson, CourseSM, fromJsonToCourse, fromJsonToCourseSM } from 'src/app/models/course.model';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { CourseActions } from 'src/app/state/course/course.actions';


/*
Esse componente só opera on-line, pois faz parte do modulo do admin.
*/

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent implements OnInit, OnDestroy {

  @Output() fecharModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() existingCourse: Course;
  
  response: boolean = false;
  isComponentAlive: boolean = true;
  translationText: typeof LANGUAGE.courseRegister.CourseRegisterFormComponent
  private translationSubscription: Subscription | undefined;
  submitted = false;
  error: { message: string } = { message: "teste" }
  courseUpdate: CourseJson;
  form: FormGroup;
  memberList: number[];
  userRoles: number[];

  active = true;

  formErrors = {
    name: '',
    info: '',
    key: '',
    professor: '',
    subscriptionBegin: '',
    subscriptionEnd: '',
    startDate: '',
    endDate: '',
    noMaxStudents: 0,
    theacherEmail: ''
  };


  constructor(
    private fb: FormBuilder, 
    private store: Store, 
    private router: Router,
    private actions$: Actions,
    private translationService: TranslationService
  ) {
      this.isComponentAlive = true;
    }

  /**
   * Na inicialização cria o formulario.
   */
  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.courseRegister.CourseRegisterFormComponent
      }
 	);
    this.newForm();
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  newForm() {
    this.courseUpdate = {} as CourseJson;
    this.buildForm();
    this.active = false;
    setTimeout(() => this.active = true, 0);
  }

  buildForm(): void {
    this.form = this.fb.group({
      courseName: [this.courseUpdate?.name, [Validators.required, Validators.minLength(3)]],
      info: [this.courseUpdate?.info, [Validators.required]],
      subscriptionBegin: [this.courseUpdate?.subscriptionBegin, [Validators.required, this.DateValidator]],
      subscriptionEnd: [this.courseUpdate?.subscriptionEnd, [Validators.required, this.DateValidator]],
      startDate: [this.courseUpdate?.startDate, [Validators.required, this.DateValidator]],
      endDate: [this.courseUpdate?.endDate, [Validators.required, this.DateValidator]],
      noMaxStudents: [this.courseUpdate?.noMaxStudents, [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

    this.patchValue();

    this.form.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  patchValue() {
    this.form.patchValue({
      courseName: this.existingCourse.name, 
      info: this.existingCourse.info,
      subscriptionBegin: this.existingCourse.subscriptionBegin.toISOString().substring(0, 10),
      subscriptionEnd: this.existingCourse.subscriptionEnd.toISOString().substring(0, 10),
      startDate: this.existingCourse.startDate.toISOString().substring(0, 10),
      endDate: this.existingCourse.endDate.toISOString().substring(0, 10),
      noMaxStudents: this.existingCourse.noMaxStudents
    })
  }

  DateValidator(control) {
    const selectedDate = new Date(control.value);
    const minYear = 1;
    const maxYear = 9999;
  
    const selectedYear = selectedDate.getFullYear();
  
    if (selectedYear < minYear || selectedYear > maxYear) {
      return { invalidYear: true };
    }
  
    return null;
  }

  onValueChanged(data?: any) {
    if (!this.form) { 
      return; 
    }

    const form = this.form;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      
      if (control && control.dirty && !control.valid) {
        const messages = this.translationText?.validationMessages;
        this.formErrors[field] = messages[field].required
      }
    }
  }

  tryAgain() {
    this.submitted = false;
  }

  resetComponent() {
    this.submitted = false;
    this.error = { message: '' };
    this.patchValue();
  }

  attState(value: boolean) {
    this.submitted = value;
  }

  fechar() {
    this.fecharModal.emit(true);
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;
    this.courseUpdate = this.form.value;
    this.courseUpdate.name = this.form.value.courseName;
    this.edit();
  }

  private edit() {
    let courseSend: CourseSM;
    courseSend = fromJsonToCourseSM(this.courseUpdate);
    console.log(courseSend)
    this.store.dispatch(CourseActions.api.update.request({ input: {id: this.existingCourse.id, body: courseSend} }));

    this.actions$.pipe(
      ofType(CourseActions.api.update.success),
      map(response => {
        this.response = true
      })
    ).subscribe();

    this.actions$.pipe(
      ofType(CourseActions.api.update.error),
      filter(({ input }) => input.id == this.existingCourse.id),
      map(({input, error}) => {
        console.log("chamou handle error")
        this.handleError(input, error)
        this.response = false
      })
    ).subscribe()
  }

  handleError(input: any, error: any) {
    let { message } = error;
    let errorMessage: string;
  
    switch (message) {
      case this.translationText.errorMessages.subscriptionDate:
        errorMessage = this.translationText.errorMessages.subscriptionDate;
        break;
      case this.translationText.errorMessages.courseDate:
        errorMessage = this.translationText.errorMessages.courseDate;
        break;
      default:
        errorMessage = this.translationText.updateError;
    }
  
    this.error.message = errorMessage;
    console.log(errorMessage)
  }

 
}

