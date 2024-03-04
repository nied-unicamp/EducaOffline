import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MembersService } from '../members.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-members-add',
  templateUrl: './members-add.component.html',
  styleUrls: ['./members-add.component.css']
})
export class MembersAddComponent implements OnInit, OnDestroy {

  key: string;
  @Input() courseId: number;
  @Output() closeForm = new EventEmitter<void>();

  translationText: typeof LANGUAGE.members.MembersAddComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private membersService: MembersService,
    private translationService: TranslationService
  ) {
  }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.members.MembersAddComponent
      }
 	  );
    this.membersService.getCourseKey(this.courseId).subscribe((data: { key: string }) => {
      this.key = data.key;
    });
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  refreshKey() {
    this.membersService.changeCourseKey(this.courseId).subscribe((data: { key: string }) => {
      this.key = data.key;
    });
  }

  copyKey(key: string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (key));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
}
