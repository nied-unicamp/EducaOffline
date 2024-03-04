import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { stringDateToISOString } from 'src/app/models';
import { Course, CourseForm, CourseJson, fromJsonToCourse } from 'src/app/models/course.model';
import { ParticipationSM } from 'src/app/models/participation.model';
import { CoursesApiService } from 'src/app/services/api/courses.api.service';


@Injectable()
export class CourseRegisterService {

    static translationText = LANGUAGE.courseRegister;

    constructor(private api: CoursesApiService) { }

    addCourse(course: CourseJson): Observable<Course> {
        course.startDate = stringDateToISOString(course.startDate);

        course.endDate = stringDateToISOString(course.endDate)

        course.subscriptionBegin = stringDateToISOString(course.subscriptionBegin);

        course.subscriptionEnd = stringDateToISOString(course.subscriptionEnd);

        return this.api.addCourse(course);
    }

    addUserWithRole(participation: ParticipationSM) {
        return this.api.addUserWithRole(participation);
    }
}
