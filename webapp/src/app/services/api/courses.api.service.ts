import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CourseForm, CourseJson, CourseSM, fromJsonToCourse } from 'src/app/models/course.model';
import { ParticipationSM } from 'src/app/models/participation.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesApiService {

  constructor(private http: HttpClient) { }

  addCourse(course: CourseJson) {
    const url = 'courses';
    
    return this.http.post<CourseJson>(url, course).pipe(
      map(data => fromJsonToCourse(data))
    );
  }

  getCourses(): Observable<CourseSM[]> {
    return this.http.get<CourseSM[]>('courses').pipe(take(1));
  }

  getCourse(courseId: number | string): Observable<CourseSM> {
    const url = `courses/${courseId}`;

    return this.http.get<CourseSM>(url).pipe(take(1));
  }

  deleteCourse(courseId: number): Observable<any> {
    const url = `courses/${courseId}`;

    return this.http.delete(url).pipe(take(1));
  }

  updateCourse(courseId: number, body: CourseSM): Observable<CourseJson> {
    const url = `courses/${courseId}`;

    return this.http.put<CourseJson>(url, body).pipe(take(1));
  }

  createCourse(body: CourseSM): Observable<CourseSM> {
    const url = `courses/`;

    return this.http.post<CourseSM>(url, body).pipe(take(1));
  }

  addUserWithRole(participation: ParticipationSM) {
    const url = `courses/${participation.courseId}/users`;

    return this.http.post<CourseSM>(url, participation).pipe(take(1));
  }

  // List by Role

  getCoursesAsTeacher(userId: number): Observable<CourseSM[]> {
    const url = `users/${userId}/roles/3`;

    return this.http.get<CourseSM[]>(url).pipe(take(1));
  }

  getCoursesAsStudent(userId: number): Observable<CourseSM[]> {
    const url = `users/${userId}/roles/2`;

    return this.http.get<CourseSM[]>(url).pipe(take(1));
  }

}
