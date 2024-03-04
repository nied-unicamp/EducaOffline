import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { fromArray2 } from 'src/app/models';
import { Course, CourseJson, fromJsonToCourse } from 'src/app/models/course.model';
import { fromJsonToUser, User, UserJson } from 'src/app/models/user.model';

@Injectable()
export class AdminService {

  static translationText = LANGUAGE.admin;

  constructor(private http: HttpClient) { }


  getAdmins(): Observable<Array<User>> {
    const url = 'admins';

    return this.http.get<UserJson[]>(url).pipe(
      map(fromArray2(fromJsonToUser))
    );
  }

  getCourses(): Observable<Array<Course>> {
    const url = 'courses';

    return this.http.get<CourseJson[]>(url).pipe(
      map(fromArray2(fromJsonToCourse))
    );
  }
}
