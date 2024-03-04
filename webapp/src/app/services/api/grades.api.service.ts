import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ActivityItemJson } from 'src/app/models/activity-item.model';
import { GradesConfigForm, GradesConfigJson } from 'src/app/models/grades-config';
import { GradesFinalJson, GradesOverviewJson } from 'src/app/models/grades-final.model';
import { GradesInfoJson } from 'src/app/models/grades-info.model';
import { GradesUserOverviewJson } from 'src/app/models/grades-user-overview';

@Injectable({
  providedIn: 'root'
})
export class GradesApiService {
  constructor(private http: HttpClient) { }

  /// FOI
  getOverview(courseId: number): Observable<GradesOverviewJson> {
    const url = `courses/${courseId}/grades/overview`;

    return this.http.get<GradesOverviewJson>(url).pipe(take(1));
  }

  /// FOI
  getUserOverview({ courseId, userId }: { courseId: number; userId: number; }): Observable<GradesUserOverviewJson> {
    const url = `courses/${courseId}/grades/users/${userId}/overview`;

    return this.http.get<GradesUserOverviewJson>(url).pipe(take(1));
  }

  getGrades(courseId: number): Observable<ActivityItemJson[]> {
    const url = `courses/${courseId}/grades`;

    return this.http.get<ActivityItemJson[]>(url).pipe(take(1));
  }

  /// FOI
  getSummary(courseId: number): Observable<GradesInfoJson[]> {
    const url = `courses/${courseId}/grades/activities/summary`;

    return this.http.get<GradesInfoJson[]>(url).pipe(take(1));
  }

  /// FOI
  getConfig(courseId: number): Observable<GradesConfigJson> {
    const url = `courses/${courseId}/grades/config`;

    return this.http.get<GradesConfigJson>(url).pipe(take(1))
  }

  /// FOI
  getFinalGrade(courseId: number): Observable<GradesFinalJson> {
    const url = `courses/${courseId}/grades/result`;

    return this.http.get<GradesFinalJson>(url).pipe(take(1));
  }

  /// FOI
  getFinalGrades(courseId: number): Observable<GradesFinalJson[]> {
    const url = `courses/${courseId}/grades/results`;

    return this.http.get<GradesFinalJson[]>(url).pipe(take(1));
  }

  /// FOI
  editWeights({ courseId, form }: { courseId: number; form: GradesConfigForm; }): Observable<GradesConfigJson> {
    const url = `courses/${courseId}/grades/config`;

    return this.http.post<GradesConfigJson>(url, form).pipe(take(1));
  }

  /// FOI
  useArithmeticMean(courseId: number) {
    const url = `courses/${courseId}/grades/config/useAverage`;

    return this.http.post<GradesConfigJson>(url, null).pipe(take(1));
  }
}
