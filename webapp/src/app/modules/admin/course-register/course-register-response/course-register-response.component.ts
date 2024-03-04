import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CourseRegisterService } from './../course-register.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';


@Component({
  selector: 'app-course-register-response',
  templateUrl: './course-register-response.component.html',
  styleUrls: ['./course-register-response.component.css']
})
export class CourseRegisterResponseComponent implements OnInit, OnDestroy {

  @Output() tryAgain: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() response: any;
  error: boolean;
  translationText: typeof LANGUAGE.courseRegister.CourseRegisterResponseComponent;
  private translationSubscription: Subscription | undefined;
  responseContent: any;

  constructor(
    private courseRegisterService: CourseRegisterService,
    private translationService: TranslationService
  ) {
    this.error = true;
   }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.courseRegister.CourseRegisterResponseComponent
      }
 	  );
    this.response.subscribe((data: any) => {
      console.log(data);
      this.responseContent = data;
      this.changeIsoToNormalDate()
      if(this.responseContent instanceof HttpErrorResponse){
        this.error = true;
      }else if(this.responseContent){
        this.error = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  private changeIsoToNormalDate() {
    this.responseContent.course.subscriptionBegin = this.normalizeDate(this.responseContent.course.subscriptionBegin);
    this.responseContent.course.subscriptionEnd = this.normalizeDate(this.responseContent.course.subscriptionEnd);
    this.responseContent.course.startDate = this.normalizeDate(this.responseContent.course.startDate);
    this.responseContent.course.endDate = this.normalizeDate(this.responseContent.course.endDate);
  }

  private normalizeDate(inputDate: string) {
    const date = new Date(inputDate);
    const dataFormatada = new DatePipe('en-US').transform(date, 'dd/MM/yyyy');
    return dataFormatada;
  }

  tryAgainClick() {
    this.tryAgain.emit(false);
  }

  copyResponseToclipBoard() {
    navigator.clipboard.writeText(`
    ${this.translationText.noError.courseId} ${this.responseContent.course.id}\n
    ${this.translationText.noError.courseName} ${this.responseContent.course.name}\n
    ${this.translationText.noError.teacherName} ${this.responseContent.user.name}\n
    ${this.translationText.noError.maxEstudents}  ${this.responseContent.course.noMaxStudents}\n
    ${this.translationText.noError.startCourse} ${this.responseContent.course.startDate}\n
    ${this.translationText.noError.endCourse} ${this.responseContent.course.endDate}\n
    ${this.translationText.noError.startRegister} ${this.responseContent.course.subscriptionBegin}\n
    ${this.translationText.noError.endRegister} ${this.responseContent.course.subscriptionEnd}\n`)
  }
}
