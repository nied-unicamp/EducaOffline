import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { CourseSM } from 'src/app/models/course.model';
import { CourseActions } from 'src/app/state/course/course.actions';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { CoursesApiService } from '../api/courses.api.service';

@Injectable({
  providedIn: 'root'
})
export class CourseResolverService implements Resolve<CourseSM> {
  constructor(private courseApiService: CoursesApiService, private router: Router, private store: Store) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CourseSM> {
    const courseId = Number(route.paramMap.get('courseId'));

    if (isNaN(courseId)) {
      return this.fail();
    }

    return this.store.select(CourseSelectors.byId(courseId)).pipe(
      take(1),
      tap({
        next: course => {
          if (!(course?.id)) {
            throw new Error('No course found');
          }
        }
      }),
      catchError(_ => {
        return this.courseApiService.getCourse(courseId).pipe(
          tap(course => this.store.dispatch(CourseActions.api.fetchOne.success({ input: { id: courseId }, data: course }))),
          catchError((error: HttpErrorResponse) => {
            console.log('Error on trying to resolve course:' + courseId + '\n' + error);
            return this.fail();
          })
        );
      })
    )
  }

  fail(): Observable<CourseSM> {
    this.router.navigate(['/courses']);
    return EMPTY;
  }

}
