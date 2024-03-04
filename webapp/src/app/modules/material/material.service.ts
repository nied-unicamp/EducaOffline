import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { SharedApiService } from 'src/app/services/api/shared.api.service';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { LoginSelectors } from 'src/app/state/login/login.selector';

@Injectable()
export class MaterialService {

  static translationText = LANGUAGE.material;

  courseId: number;
  baseUrl: string;
  token: string;

  constructor(private sharedApiService: SharedApiService, private store: Store) {
    this.store.select(CourseSelectors.currentId).subscribe((data: number) => {
      this.courseId = Number(data);
    });

    this.store.select(LoginSelectors.state).pipe(
      take(1),
    ).subscribe(loginState => {
      this.baseUrl = loginState.apiUrl;
      this.token = loginState?.token?.value;
    });
  }

  getUrlTitle(link: string) {
    return this.sharedApiService.getUrlTitle(link);
  }

  downloadFolder(folderId: number) {
    const link = document.createElement('a');

    const fullUrl = this.baseUrl + `courses/${this.courseId}/materials/folders/${folderId}?access_token=${this.token}`;

    link.setAttribute('href', fullUrl);
    link.setAttribute('target', '_blank');
    link.style.display = 'none';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }
}
