import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-grades-caption',
  templateUrl: './grades-caption.component.html',
  styleUrls: ['./grades-caption.component.css']
})
export class GradesCaptionComponent implements OnInit, OnDestroy {
  @Input() complete: boolean = true;

  translationText: typeof LANGUAGE.grades.GradesPersonalComponent;

  private translationSubscription: Subscription | undefined;

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
