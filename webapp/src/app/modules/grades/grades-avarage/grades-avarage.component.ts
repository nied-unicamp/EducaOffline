import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-grades-avarage',
  templateUrl: './grades-avarage.component.html',
  styleUrls: ['./grades-avarage.component.css']
})
export class GradesAvarageComponent implements OnInit, OnDestroy {
  translationText: typeof LANGUAGE.grades.GradesPersonalComponent;

  private translationSubscription: Subscription | undefined;

  @Input() finalGradeScore: string;
  
  constructor(private translationService: TranslationService) { }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.grades.GradesPersonalComponent
      }
 	  );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }
}
