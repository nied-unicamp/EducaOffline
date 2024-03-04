import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromArray2 } from 'src/app/models';
import { fromJsonToUserAndRole, UserAndRole } from 'src/app/models/participation.model';
import { CourseKeyApiService } from 'src/app/services/api/course-key.api.service';
import { ParticipationApiService } from 'src/app/services/api/participation.api.service';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class MembersService {
  constructor(
    private sharedService: SharedService,
    private courseKeyApiService: CourseKeyApiService,
    private participationApiService: ParticipationApiService
  ) { }

  getMembers(courseId: number): Observable<UserAndRole[]> {
    return this.participationApiService.getUserWithRoles(courseId).pipe(
      map(fromArray2(fromJsonToUserAndRole))
    );
  }

  getProfilePhoto(userId: number) {
    return this.sharedService.downloadLink(`users/${userId}/picture`);
  }

  getCourseKey(courseId: number): Observable<{ key: string }> {
    return this.courseKeyApiService.getCourseKey(courseId);
  }

  changeCourseKey(courseId: number): Observable<any> {
    return this.courseKeyApiService.changeCourseKey(courseId);
  }
}
