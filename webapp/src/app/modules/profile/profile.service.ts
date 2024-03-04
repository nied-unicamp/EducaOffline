import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { CourseJson } from 'src/app/models/course.model';
import { fromJsonToUser, User, UserJson } from 'src/app/models/user.model';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  static translationText = LANGUAGE.profile;

  readonly visitedProfile = new BehaviorSubject<User>(null);

  constructor(
    private sharedService: SharedService,
    private http: HttpClient) {
  }


  updateVisitedProfile(user: User) {
    this.visitedProfile.next(user);
  }

  updateProfile(userId: number, profile: UserJson) {
    const url = `users/${userId}`;

    return this.http.put<UserJson>(url, profile).pipe(
      map((json: UserJson) => fromJsonToUser(json))
    );
  }

  updateUserPassword(userId: number, userPassword: { newPassword: string, oldPassword: string }): Observable<any> {
    const url = `users/${userId}/password`;

    return this.http.put<UserJson>(url, userPassword).pipe(
      map(value => {
        if (value.name) {
          return value
        }
        return null;
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  updateProfilePhoto(userId: number, photo: File) {
    const url = `users/${userId}/picture`;

    return this.sharedService.uploadFiles([photo], url);
  }

  getProfilePhoto(userId: number) {
    return this.sharedService.downloadLink(
      `users/${userId}/picture`
    );
  }

  deleteProfilePhoto(userId: number) {
    const url = 'users/' + userId + '/picture';

    return this.http.delete(url);
  }

  getCoursesAsTeacher(userId: number): Observable<CourseJson[]> {
    const url = `users/${userId}/roles/3`;

    return this.http.get<CourseJson[]>(url).pipe(take(1));
  }

  getUser(userId: number): Observable<User> {
    const url = `users/${userId}`;


    return this.http.get<UserJson>(url).pipe(
      take(1),
      map(json => fromJsonToUser(json))
    );
  }

  getCoursesAsStudent(userId: number): Observable<CourseJson[]> {
    const url = `users/${userId}/roles/2`;

    return this.http.get<CourseJson[]>(url).pipe(take(1));
  }
}
