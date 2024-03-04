import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { EditFilesForm } from 'src/app/models/activity.model';
import { FileUploaded, filesAreEqualWithoutSha3hex } from 'src/app/models/file-uploaded.model';
import { SharedService } from '../shared.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';

const initialState: EditFilesForm = {
  toDelete: [],
  toUpload: [],
  uploaded: []
}

@Component({
  selector: 'app-file-edit-upload',
  templateUrl: './file-edit-upload.component.html',
  styleUrls: ['./file-edit-upload.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileEditUploadComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileEditUploadComponent),
      multi: true
    }
  ]
})
export class FileEditUploadComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {

  modified = false;
  isEditing = false;
  isDragging: boolean;


  translationText: typeof LANGUAGE.shared.FileUploadComponent;
  private translationSubscription: Subscription | undefined;


  static update: BehaviorSubject<EditFilesForm> = new BehaviorSubject<EditFilesForm>(initialState);
  value$: Observable<EditFilesForm>
  value: EditFilesForm;

  filesToDisplay$: Observable<(File | FileUploaded)[]>

  // ControlValueAccessor variables
  onBlur: () => void;
  onChange: (value: EditFilesForm) => void;

  constructor(
    private translationService: TranslationService
  ) {
    this.value$ = FileEditUploadComponent.update.asObservable().pipe(
      debounceTime(500),
      tap(value => {
        this.value = value
        this.onChange(value)
      }),
    );
    this.isDragging = false;

    this.filesToDisplay$ = this.value$.pipe(
      map(value => [...value.toUpload, ...value.uploaded])
    )
  }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
          (translation) => {
            this.translationText = translation.shared.FileUploadComponent
          }
    );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  updateValue(newValue: EditFilesForm) {
    FileEditUploadComponent.update.next(newValue);
  }

  /********* ControlValueAccessor Interface  ***********/

  writeValue(obj: EditFilesForm): void {
    if (!obj) {
      this.updateValue(initialState);
    } else {
      this.updateValue(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onBlur = fn;
  }

  /************* Validator Interface *************/

  validate(control: AbstractControl): ValidationErrors {
    const { toDelete, toUpload, uploaded } = FileEditUploadComponent.update.getValue();

    if (toDelete instanceof Array
      && toUpload instanceof Array
      && uploaded instanceof Array
    ) {
      return null;
    }

    return {
      invalidForm: {
        valid: false,
        message: 'Files are invalid'
      }
    };
  }

  updateModified() {
    this.value$.subscribe(value => {
      this.modified = value.toDelete.length > 0 || value.toUpload.length > 0;
    })
  }

  resetChanges(value: EditFilesForm) {
    this.updateValue({
      toDelete: [],
      toUpload: [],
      uploaded: [...value.toDelete, ...value.uploaded]
    });
  }

  removeAll(value: EditFilesForm) {
    this.updateValue({
      toDelete: [...value.toDelete, ...value.uploaded],
      toUpload: [],
      uploaded: []
    });
  }

  removeFile(file: File | FileUploaded, value: EditFilesForm) {

    this.modified = true;
    const newValue = { ...value };

    if (file instanceof File) {
      newValue.toUpload = value.toUpload.filter(f => f !== file)
    } else {
      newValue.toDelete = value.toDelete.concat(file);
      newValue.uploaded = value.uploaded.filter(f => !filesAreEqualWithoutSha3hex(f, file));
    }

    this.updateValue(newValue);
  }

  /*------------------------- File acquisition methods -------------------------*/


  addFiles(files: FileList, value: EditFilesForm) {
    const toUpload = [...value.toUpload];

    for (let index = 0; index < files.length; index++) {
      // File to be added
      const newFile = files.item(index);

      // Search for file duplicates
      const ind = toUpload.findIndex(item => item instanceof File && item.name === newFile.name);

      // If any duplicates are found, update the file list with the last selected
      if (ind !== -1) {
        toUpload[ind] = newFile;
      } else { // Else just append the new file
        // filesToUpload.push(newFile);
        toUpload.unshift(newFile);
      }
    }

    this.updateValue({
      ...value,
      toUpload
    })
  }

  /*------------------------- Drag-and-drop methods -------------------------*/
  drop(event: DragEvent, value: EditFilesForm) {
    this.allowDrop(event);
    this.addFiles(event.dataTransfer.files, value);
    this.isDragging = false;
  }

  allowDrop(event: DragEvent) {
    this.isDragging = true;

    // Prevents the default browser action, that is to deny the file drop
    event.preventDefault();

    // Prevent any parent handlers from being notified of the event
    event.stopImmediatePropagation();
  }

  endDrop(event: DragEvent) {
    this.isDragging = false;

    event.preventDefault();

    event.stopPropagation();
  }
}
