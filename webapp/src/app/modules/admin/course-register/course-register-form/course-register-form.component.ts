import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'logrocket';
import { EMPTY, ErrorObserver, Subscription, pipe, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Course, CourseJson } from 'src/app/models/course.model';
import { ParticipationSM } from 'src/app/models/participation.model';
import { User, UserJson } from 'src/app/models/user.model';
import { UserApiService } from 'src/app/services/api/user.api.service';
import { CourseRegisterService } from './../course-register.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { LANGUAGE } from 'src/app/dev/languages';


/*
Esse componente só opera on-line, pois fazs parte do modulo do admin.
*/

@Component({
  selector: 'app-course-register-form',
  providers: [CourseRegisterService],
  templateUrl: './course-register-form.component.html',
  styleUrls: ['./course-register-form.component.css']
})
export class CourseRegisterFormComponent implements OnInit, OnDestroy {

  @Output() response: EventEmitter<any> = new EventEmitter<any>();

  translationText: typeof LANGUAGE.courseRegister.CourseRegisterFormComponent;
  private translationSubscription: Subscription | undefined;
  submitted = false;
  course: CourseJson;
  teacher: UserJson;
  form: FormGroup;
  memberList: number[];
  userRoles: number[];

  private static TEACHER_ROLE = 3;

  active = true;

  formErrors = {
    courseName: '',
    info: '',
    subscriptionBegin: '',
    subscriptionEnd: '',
    startDate: '',
    endDate: '',
    noMaxStudents: 0,
    teacherEmail: ''
  };


  constructor(
    private fb: FormBuilder,
    private courseRegisterService: CourseRegisterService,
    private userApi: UserApiService,
    private router: Router,
    private translationService: TranslationService
  ) { }

  attState(value: boolean) {
    this.submitted = value;
  }

  onSubmit() {
    this.submitted = true;
    this.setCourse(this.form);
    this.setTeacher(this.form);
  }

  setCourse(form: FormGroup) {
    this.course.startDate = form.value.startDate;
    this.course.endDate = form.value.endDate;
    this.course.subscriptionBegin = form.value.subscriptionBegin;
    this.course.subscriptionEnd = form.value.subscriptionEnd;
    this.course.name = form.value.courseName;
    this.course.noMaxStudents = form.value.noMaxStudents;
    this.course.info = form.value.info;
  }

  setTeacher(form: FormGroup) {
    this.userApi.getUserByEmail(form.value.teacherEmail).pipe(
      map(res => {
        if(res instanceof HttpErrorResponse){
          this.response.emit(res)
          return throwError(res);
        }else {
          this.teacher = res as UserJson;
          this.addCourse(this.course);
        }
      }),
      catchError(error => {
        this.response.emit(error);
        return EMPTY;
      })
    ).subscribe()
  }

  addCourse(course: CourseJson) {
    this.courseRegisterService.addCourse(course).pipe(
      tap(res => {
        this.addTeacher(res);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log("erro ao criar curso:", error);
        this.response.emit(error);
        return throwError(error);
      })
    ).subscribe()
  }

  addTeacher(res: any) {
    let body = {} as ParticipationSM;
    body.courseId = res.id;
    body.userId = this.teacher.id;
    body.roleId = CourseRegisterFormComponent.TEACHER_ROLE;
    this.courseRegisterService.addUserWithRole(body).subscribe(
      (res) => {
        this.response.emit(res);
      }
    );
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
    this.course = {} as CourseJson;
    this.teacher = {} as UserJson;
    this.buildForm();
    this.active = false;
    setTimeout(() => this.active = true, 0);
  }

  buildForm(): void {
    this.form = this.fb.group({
      courseName: [this.course?.name, [Validators.required, Validators.minLength(5)]],
      info: [this.course?.info, [Validators.required, Validators.minLength(5)]],
      subscriptionBegin: [this.course?.subscriptionBegin, [Validators.required, this.DateValidator]],
      subscriptionEnd: [this.course?.subscriptionEnd, [Validators.required,this.DateValidator, ]],
      startDate: [this.course?.startDate, [Validators.required, this.DateValidator]],
      endDate: [this.course?.endDate, [Validators.required, this.DateValidator]],
      noMaxStudents: [this.course?.noMaxStudents, [Validators.required, Validators.pattern('^[0-9]+$')]],
      teacherEmail: [this.teacher.email, [Validators.required, Validators.email]]
    });

    this.form.valueChanges
      .subscribe(data => {
        this.onValueChanged(data)
        console.log("change")
      });

    this.onValueChanged();
  }

  DateValidator(control: AbstractControl): ValidationErrors | null {
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

  subscriptionDateValidator(control: AbstractControl): ValidationErrors | null {
    const subscriptionBegin = new Date(this.form.get('subscriptionBegin').value);
    const subscriptionEnd = new Date(control.value);
  
    if (subscriptionEnd < subscriptionBegin) {
      return { invalidSubscriptionDate: true };
    }
  
    return null;
  }
}
