import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CourseSM } from 'src/app/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseKeyApiService {

  constructor(private http: HttpClient) { }

  enrollCourseByKey(key: string): Observable<any> {
    const url = `courses/enter/${key}`;

    return this.http.post(url, {}).pipe(take(1));
  }

  findCourseByKey(key: string): Observable<CourseSM> {
    const url = `courses/key/${key}`;

    return this.http.get<CourseSM>(url).pipe(take(1));
  }

  findOpenCourseByKey(key: string): Observable<CourseSM> {
    const url = `courses/open/key/${key}`;

    return this.http.get<CourseSM>(url).pipe(take(1));
  }

  getCourseKey(courseId: number): Observable<{ key: string }> {
    const url = `courses/${courseId}/key`;

    return this.http.get<{ key: string }>(url);
  }

  changeCourseKey(courseId: number): Observable<{ key: string }> {
    const url = `courses/${courseId}/key`;

    return this.http.put<{ key: string }>(url, {});
  }
}
