import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { CourseSM } from 'src/app/models/course.model';
import { Role } from 'src/app/models/role.model';
import { User } from 'src/app/models/user.model';
import { CourseKeyApiService } from 'src/app/services/api/course-key.api.service';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { RoleSelectors } from 'src/app/state/role/role.selector';
import { UserSelectors } from 'src/app/state/user/user.selector';

// Seletores para verificacao de necessidade de sincronização
import { ActivityEvaluationOfflineSelectors } from 'src/app/state/activity-evaluation/offline/activity-evaluation.offline.selector';
import { ActivitySubmissionOfflineSelectors } from 'src/app/state/activity-submission/offline/activity-submission.offline.selector';
import { ActivityOfflineSelectors } from 'src/app/state/activity/offline/activity.offline.selector';
import { CourseOfflineSelectors } from 'src/app/state/course/offline/course.offline.selector';
import { FileUploadedOfflineSelectors } from 'src/app/state/file-uploaded/offline/file-uploaded.offline.selector';
import { MaterialFolderOfflineSelectors } from 'src/app/state/material-folder/offline/material-folder.offline.selector';
import { MaterialOfflineSelectors } from 'src/app/state/material/offline/material.offline.selector';
import { WallCommentOfflineSelectors } from 'src/app/state/wall-comment/offline/wall-comment.offline.selector';
import { WallPostOfflineSelectors } from 'src/app/state/wall-post/offline/wall-post.offline.selector';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  static translationText = LANGUAGE.home;

  course$: Observable<any>;
  user$: Observable<User>;
  role$: Observable<Role>;

  constructor(private store: Store,
    private courseKeyApiService: CourseKeyApiService,
  ) {
    this.setObservables();
  }

  enrollCourseByKey(key: string): Observable<any> {
    return this.courseKeyApiService.enrollCourseByKey(key);
  }

  findCourseByKey(key: string): Observable<CourseSM> {
    return this.courseKeyApiService.findCourseByKey(key);
  }

  findOpenCourseByKey(key: string): Observable<CourseSM> {
    return this.courseKeyApiService.findOpenCourseByKey(key);
  }

  hasPermission(permission: string) {
    return this.role$.pipe(
      map(role => role?.permissions?.findIndex(p => p?.name === permission) >= 0)
    )
  }

  private setObservables() {
    this.course$ = this.store.select(CourseSelectors.current);
    this.user$ = this.store.select(UserSelectors.current);
    this.role$ = this.store.select(RoleSelectors.current);
  }

  getHasToSyncStream() {
    const selectors = [
      ActivityOfflineSelectors.hasToSync,
      ActivityEvaluationOfflineSelectors.hasToSync,
      ActivitySubmissionOfflineSelectors.hasToSync,
      CourseOfflineSelectors.hasToSync,
      FileUploadedOfflineSelectors.hasToSync,
      MaterialOfflineSelectors.hasToSync,
      MaterialFolderOfflineSelectors.hasToSync,
      WallCommentOfflineSelectors.hasToSync,
      WallPostOfflineSelectors.hasToSync,
      
      // Adicione aqui mais seletores se for necessário.
      // O seletor da nova Feature deve retornar true se é preciso sincronizar alterações e false caso contrário.
      // As operações de Requested, não contam como necessárias para sincronização

      // Esta função é responsável por juntar todos os valores em um só,
      // criando uma stream que retorna false apenas se nenhuma das features necessitar de sincronização.
    ];

    const selectorObservables$: Observable<boolean>[] = selectors.map(selector => this.store.select(selector));
    
    const combinedSelector$: Observable<boolean> = combineLatest([...selectorObservables$]).pipe(
      map(selectorValues => selectorValues.some(value => value))
    );

    return combinedSelector$;
  }
}
