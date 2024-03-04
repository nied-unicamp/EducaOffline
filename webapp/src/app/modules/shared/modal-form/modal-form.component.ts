import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from './../shared.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.css']
})
export class ModalFormComponent implements OnInit, OnDestroy {

  @ViewChild('content', { static: true }) content: ElementRef;
  @Input() title: string;
  @Input() screenSize: 'sm' | 'md' | 'lg' | 'xl';
  @Input() centered = false;
  @Output() ok: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();

  modalRef: NgbActiveModal;
  translationText: typeof LANGUAGE.shared.ModalFormComponent;
  private translationSubscription: Subscription | undefined;
  closed = true;

  constructor(
    private modalService: NgbModal,
    private sharedService: SharedService,
    private translationService: TranslationService
  ) { }


  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.shared.ModalFormComponent
      }
 	  );
    if (this.title === null) {
      this.title = this.translationText?.title;
    }
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  /**
   * Open an NgBootstrap modal
   *
   */
  open() {
    const options: NgbModalOptions = {};
    options.centered = this.centered;

    if (this.screenSize) {
      options.size = this.screenSize;
    }

    this.modalRef = this.modalService.open(this.content, options);

    this.closed = false;
    console.log('Opening modal: ' + this.title);
  }

  dismiss() {
    this.closed = true;
    this.modalRef.dismiss('Cross click');
    console.log('Dismissing modal: ' + this.title);
    this.ok.emit(false);
    this.modalClosed.emit();
  }

  close(ok?: boolean) {
    this.closed = true;
    this.modalRef.close();
    console.log('Closing modal: ' + this.title);
    this.modalClosed.emit();
    if (ok !== null) {
      this.ok.emit(ok);
    }
  }
}
