import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { RolesAndCourses } from 'src/app/models/participation.model';
import { RoleSM } from 'src/app/models/role.model';
import { UserSM } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipationApiService {

  constructor(private http: HttpClient) { }

  getUserWithRoles(courseId: number): Observable<{ user: UserSM, role: RoleSM }[]> {
    const url = `courses/${courseId}/users`;
    return this.http.get<{ user: UserSM, role: RoleSM }[]>(url).pipe(take(1));
  }

  getCoursesWithRoles(): Observable<RolesAndCourses> {
    const url = `me/roles`;
    return this.http.get<RolesAndCourses>(url).pipe(take(1));
  }

  getRole(courseId: number, userId: number): Observable<RoleSM> {
    const url = `courses/${courseId}/users/${userId}`;
    return this.http.get<RoleSM>(url).pipe(take(1));
  }

  getTeachersInCourse(courseId: number): Observable<UserSM[]> {
    const url = `courses/${courseId}/roles/3`;
    return this.http.get<UserSM[]>(url).pipe(take(1));
  }
}
