import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseSM } from 'src/app/models/course.model';
import { UserSM } from './../../offline-models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  constructor(private http: HttpClient) { }


  getAdmins(): Observable<UserSM[]> {
    const url = `admins`;

    return this.http.get(url).pipe(
      map((res: UserSM[]) => res)
    );
  }

  getCourses(): Observable<CourseSM[]> {
    const url = `courses/`;

    return this.http.get(url).pipe(
      map((list: CourseSM[]) => list)
    );
  }
}
