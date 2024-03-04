import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getNotificationsFromCourse(courseId: number): Observable<any[]> {
    const url = `notifications/courses/${courseId}`;

    return this.http.get<any[]>(url);
  }

  getNotifications(): Observable<any[]> {
    const url = `notifications`;

    return this.http.get<any[]>(url);
  }
}
