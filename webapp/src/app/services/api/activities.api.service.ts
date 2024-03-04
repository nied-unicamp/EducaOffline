import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ActivityEvaluationForm, ActivityEvaluationJson } from 'src/app/models/activity-evaluation.model';
import { ActivityItemJson } from 'src/app/models/activity-item.model';
import { ActivitySubmissionForm, ActivitySubmissionJson } from 'src/app/models/activity-submission.model';
import { ActivityFormJson, ActivityJson } from 'src/app/models/activity.model';
import { FileState, FileUploaded, FileUploadedJson } from 'src/app/models/file-uploaded.model';
import { UserSM } from 'src/app/models/user.model';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { patchFilesWithUrl } from 'src/app/state/file-uploaded/file-uploaded.state';


@Injectable({
  providedIn: 'root'
})
export class ActivitiesApiService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }


  /************************** ActivityJson **************************/

  createActivity(activity: ActivityFormJson, courseId: number): Observable<ActivityJson> {
    const url = `courses/${courseId}/activities`;

    return this.http.post<ActivityJson>(url, activity).pipe(take(1));
  }

  editActivity(activity: ActivityFormJson, courseId: number, activityId: number): Observable<ActivityJson> {
    const url = `courses/${courseId}/activities/${activityId}`;

    return this.http.put<ActivityJson>(url, activity).pipe(take(1));
  }

  getActivities(courseId: number): Observable<ActivityJson[]> {
    const url = `courses/${courseId}/activities`;

    return this.http.get<ActivityJson[]>(url).pipe(take(1), map(items => items.map(item => ({
      ...item,
      files: patchFilesWithUrl(item?.files, `${url}/${item.id}/files`)
    }))));
  }

  getActivity(data: { activityId: number, courseId: number }): Observable<ActivityJson> {
    const url = `courses/${data.courseId}/activities/${data.activityId}`;

    return this.http.get<ActivityJson>(url).pipe(take(1), map(item => ({
      ...item,
      files: patchFilesWithUrl(item?.files, `${url}/${item.id}/files`)
    })));
  }

  deleteActivity({ courseId, activityId }: { courseId: number; activityId: number; }): Observable<void> {
    const url = `courses/${courseId}/activities/${activityId}`;

    return this.http.delete(url).pipe(
      map((_) => { })
    );
  }

  releaseGrades(courseId: number, activityId: number): Observable<ActivityJson> {
    const url = `courses/${courseId}/grades/activities/${activityId}/release`;

    return this.http.post<ActivityJson>(url, {}).pipe(take(1));
  }

  getActivitiesByGrade(courseId: number): Observable<{ withoutGrades: ActivityJson[], withGrades: ActivityJson[] }> {
    const url = `courses/${courseId}/activities/byGrade`;

    return this.http.get<{ withGrades: ActivityJson[], withoutGrades: ActivityJson[] }>(url).pipe(take(1));
  }

  getActivityFiles(data: { courseId: number, activityId: number }): Observable<FileUploadedJson[]> {
    const url = `courses/${data.courseId}/activities/${data.activityId}/files`;

    return this.http.get<FileUploadedJson[]>(url).pipe(
      map(json => patchFilesWithUrl(json, url)),
    );
  }

  getActivityGrades(courseId: number, activityId: number): Observable<any> {
    const url = `courses/${courseId}/grades/activities/${activityId}`;

    return this.http.get(url);
  }

  /**************************** Submission **************************/

  createSubmission({ form, courseId, activityId }: { form: ActivitySubmissionForm; courseId: number; activityId: number; }): Observable<ActivitySubmissionJson> {
    const url = `courses/${courseId}/activities/${activityId}/submission`;

    return this.http.post<ActivitySubmissionJson>(url, form).pipe(
      take(1)
    );
  }

  editSubmission({ form, courseId, activityId }: { form: ActivitySubmissionForm; courseId: number; activityId: number; }): Observable<ActivitySubmissionJson> {
    const url = `courses/${courseId}/activities/${activityId}/submission`;

    return this.http.put<ActivitySubmissionJson>(url, form).pipe(
      take(1)
    );
  }

  getStudents(courseId: number): Observable<UserSM[]> {
    const url = `courses/${courseId}/roles/2/`;

    return this.http.get<UserSM[]>(url).pipe(take(1));
  }

  getSubmissions({ courseId, activityId }: { courseId: number; activityId: number; }): Observable<ActivitySubmissionJson[]> {
    const url = `courses/${courseId}/grades/activities/${activityId}/submissions`;

    return this.http.get<ActivitySubmissionJson[]>(url).pipe(
      take(1)
    );
  }

  getMySubmission({ courseId, activityId }: { courseId: number; activityId: number; }): Observable<ActivitySubmissionJson> {
    const url = `courses/${courseId}/activities/${activityId}/submission`;

    return this.http.get<ActivitySubmissionJson>(url).pipe(
      take(1)
    );
  }

  getActivityItems({ courseId, activityId }: { courseId: number; activityId: number; }): Observable<ActivityItemJson[]> {
    const url = `courses/${courseId}/grades/activities/${activityId}/`;

    return this.http.get<ActivityItemJson[]>(url).pipe(
      take(1),
      map(items => items.map(item => {
        if (item?.submission?.files?.length > 0) {
          item.submission.files = item.submission.files.map(file => {
            const fileUrl = `courses/${courseId}/activities/${activityId}/items/${item.user.id}/submission/files/${encodeURIComponent(file.fileName)}`
            file.downloadUri = this.sharedService.downloadLink(fileUrl)

            return file;
          })
        }
        return item;
      }))
    );
  }

  getSubmissionFiles(courseId: number, activityId: number): Observable<FileUploaded[]> {
    const url = `courses/${courseId}/activities/${activityId}/submission/files`;

    return this.http.get<FileUploadedJson[]>(url).pipe(
      map(files => files.map(file => ({
        ...file, status: {
          currently: FileState.NotPresentLocally,
          lastModified: (new Date()).toISOString(),
          progress: 0
        },
        downloadUri: `courses/${courseId}/activities/${activityId}/submission/files/${encodeURIComponent(file.fileName)}`
      } as FileUploaded))),
      catchError((response: any) => {

        if (response instanceof HttpErrorResponse && response.status == 404) {
          return of([]);
        }

        return throwError(response);
      })
    );
  }

  getSubmissionFilesFromAnotherUser(courseId: number, activityId: number, userId: number): Observable<FileUploadedJson[]> {
    const url = `courses/${courseId}/activities/${activityId}/items/${userId}/submission/files`;

    return this.http.get<FileUploadedJson[]>(url).pipe(
      map(json => json.map(file => {
        file.downloadUri = this.sharedService.downloadLink(url + '/' + encodeURIComponent(file.fileName));
        return file;
      }))
    );
  }

  deleteSubmission({ courseId, activityId, submissionId }: { courseId: number; activityId: number; submissionId: number; }): Observable<any> {
    const url = `courses/${courseId}/activities/${activityId}/submissions/${submissionId}`

    return this.http.delete(url);
  }

  deleteSubmissionFile({ courseId, activityId, fileName }: { courseId: number; activityId: number; fileName: string }): Observable<any> {
    const url = `courses/${courseId}/activities/${activityId}/submission/files/${fileName}`
    return this.http.delete(url);
  }


  createEvaluation({ courseId, activityId, userId, form }: { courseId: number; activityId: number; userId: number; form: ActivityEvaluationForm; }): Observable<ActivityEvaluationJson> {
    const url = `courses/${courseId}/activities/${activityId}/items/${userId}/evaluation`;

    return this.http.post<ActivityEvaluationJson>(url, form).pipe(
      take(1)
    );
  }

  getEvaluation({ courseId, activityId, submissionId }: { courseId: number; activityId: number; submissionId: number; }): Observable<ActivityEvaluationJson> {
    const url = `courses/${courseId}/activities/${activityId}/submissions/${submissionId}/evaluation`;

    return this.http.get<ActivityEvaluationJson>(url).pipe(
      take(1),
      catchError(_ => {
        return of(null);
      })
    );
  }

  editEvaluation({ courseId, activityId, userId, form }: { courseId: number; activityId: number; userId: number; form: ActivityEvaluationForm; }): Observable<ActivityEvaluationJson> {
    const url = `courses/${courseId}/activities/${activityId}/items/${userId}/evaluation`;

    return this.http.put<ActivityEvaluationJson>(url, form).pipe(
      take(1)
    );

  }
}
