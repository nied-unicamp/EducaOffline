import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { MaterialService } from '../material.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-material-edit-dropdown',
  templateUrl: './material-edit-dropdown.component.html',
  styleUrls: ['./material-edit-dropdown.component.css']
})
export class MaterialEditDropdownComponent implements OnInit, OnDestroy {
  @ViewChild('modalEdit') modalEditRef!: ModalFormComponent;
  @ViewChild('modalMove') modalMoveRef!: ModalFormComponent;

  @Input() id: number;
  @Input() type: 'file' | 'link' | 'folder';
  @Input() hasEdit: string = "false";
  @Input() hasMove: string = "false";
  @Input() hasDelete: string = "false";
  @Input() hasDownload: string = "false";
  @Input() courseId: number;
  @Input() disableDeleteButton: boolean = false;
  @Input() disabled: boolean = false;
  @Input() customOptions: {title: string; icon: IconProp; cb: () => void;}[];

  @Output() openEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() downloadEmitter: EventEmitter<void> = new EventEmitter<void>();

  dropdownId = '';

  translationText: typeof LANGUAGE.material.MaterialDropdownComponent;
  private translationSubscription: Subscription | undefined;
  optionsText: { edit?: string, move?: string, delete?: string, download?: string }; // set in ngOnInit

  constructor(
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.material.MaterialDropdownComponent
      }
 	  );
    this.dropdownId = 'dropdownMaterial-' + this.type + '-' + this.id;
    this.optionsText = this.translationText[this.type];
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  deleteEmit() {
    this.deleteEmitter.emit();
  }

  closeEditModal(ok: boolean) {
    this.modalEditRef.close(ok);
  }

  closeMoveModal(ok: boolean) {
    this.modalMoveRef.close(ok);
  }

  openEmit() {
    setTimeout(() => this.openEvent.emit());
  }
}
