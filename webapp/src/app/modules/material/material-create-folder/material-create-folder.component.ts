import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MaterialFolder } from 'src/app/models/material-folder.model';
import { Form } from 'src/app/templates/form';
import { MaterialService } from '../material.service';
import { MaterialFolderActions } from 'src/app/state/material-folder/material-folder.actions';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-material-create-folder',
  templateUrl: './material-create-folder.component.html',
  styleUrls: ['./material-create-folder.component.css']
})
export class MaterialCreateFolderComponent extends Form<MaterialFolder> implements OnInit, OnDestroy{
  @ViewChild('descriptionTextarea') descriptionTextarea!: ElementRef<HTMLTextAreaElement>;

  @Input() folder: MaterialFolder = null;

  @Output() sent: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeForm = new EventEmitter<void>();

  translationText: typeof LANGUAGE.material.MaterialCreateFolderComponent;
  private translationSubscription: Subscription | undefined;

  formErrors = {
    title: '',
    description: ''
  }

  constructor(
    injectorObj: Injector,
    private store: Store,
    private translationService: TranslationService
  ) {
    super(injectorObj);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
          (translation) => {
            this.translationText = translation.material.MaterialCreateFolderComponent
          }
       );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  getBlank(): MaterialFolder {
    return {} as MaterialFolder;
  }

  valuePointer() {
    return this.folder;
  }

  protected buildForm(): FormGroup {

    const form = this.fb.group({
      title: [this.value.title, [
        Validators.required,
        Validators.maxLength(255),
      ]],
      description: [this.value?.description, [
        Validators.maxLength(255),
      ]]
    });

    return form;
  }

  protected create(): void {

    const materialFolderForm = this.form.value;

    this.store.dispatch(MaterialFolderActions.create.request({
      input: {
        body: materialFolderForm,
        courseId: this.courseId
      }
    }))

    this.closeForm.emit();
  }

  edit() {
    const materialFolderForm = this.form.value;

    this.store.dispatch(MaterialFolderActions.edit.request({
      input: {
        courseId: this.courseId,
        folderId: this.folder?.id,
        body: materialFolderForm
      }
    }))

    this.closeForm.emit();
  }

  autoGrowTextZone() {
    const textArea = this.descriptionTextarea.nativeElement;
    if (!textArea || !textArea.style) return;
    const prevOverflow = textArea.style.overflow;
    textArea.style.height = '0px';
    textArea.style.overflow = 'hidden';
    textArea.style.height = `${textArea.scrollHeight + 5}px`;
    textArea.style.overflow = prevOverflow;
  }
}
