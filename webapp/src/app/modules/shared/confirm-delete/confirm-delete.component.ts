import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from './../shared.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent implements OnInit, OnDestroy {

  @ViewChild('content', { static: true }) content: ElementRef;
  @Input() title: string;
  @Input() toDelete: boolean;
  @Input() text: string;
  @Output() ok: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Reference to the modal that enables closing it with .ts commands
   */
  modalRef: NgbActiveModal;

  translationText: typeof LANGUAGE.shared.ConfirmDeleteComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private modalService: NgbModal,
    private sharedService: SharedService,
    private translationService: TranslationService
  ) { }


  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.shared.ConfirmDeleteComponent
      }
 	  );
    if (!this.title) {
      this.title = this.translationText?.title;
    }
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  open() {
    this.modalRef = this.modalService.open(this.content);
    console.log('Abrindo modal');
  }
}
