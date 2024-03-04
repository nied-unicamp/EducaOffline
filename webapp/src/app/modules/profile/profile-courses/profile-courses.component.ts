import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CourseJson } from 'src/app/models/course.model';
import { ProfileService } from '../profile.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { Subscription } from 'rxjs';
import { LANGUAGE } from 'src/app/dev/languages';

@Component({
  selector: 'app-profile-courses',
  templateUrl: './profile-courses.component.html',
  styleUrls: ['./profile-courses.component.css']
})
export class ProfileCoursesComponent implements OnInit, OnDestroy {

  @Input() userId: number;
  cursos: CourseJson[][] = [];

  translationText: typeof LANGUAGE.profile.ProfileCoursesComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private profileService: ProfileService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.profile.ProfileCoursesComponent
      }
 	  );
    this.profileService.getCoursesAsTeacher(this.userId).subscribe((data: CourseJson[]) => {
      this.cursos.push(data);
    });

    this.profileService.getCoursesAsStudent(this.userId).subscribe((data: CourseJson[]) => {
      this.cursos.push(data);
    });
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }
}
