import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FileUploaded } from 'src/app/models/file-uploaded.model';
import { SharedService } from './../shared.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnChanges, OnInit, OnDestroy {

  @Input() uploadedFiles: FileUploaded[] = [];

  @Output() remove: EventEmitter<FileUploaded[]> = new EventEmitter<FileUploaded[]>();
  @Output() add: EventEmitter<File[]> = new EventEmitter<File[]>();

  files: (File | FileUploaded)[] = [];

  modified = false;
  isDragging: boolean;

  translationText: typeof LANGUAGE.shared.FileUploadComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private sharedService: SharedService,
    private translationService: TranslationService
  ) {
    this.isDragging = false;
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

  ngOnChanges() {
    this.resetChanges();
  }


  /**
   * Should be executed every time the 'files' array is modified.
   *
   * Check the file list if any file was removed or added and update the modified 'variable'.
   * Update the outputs
   */
  checkList() {
    this.modified = this.getRemovedFiles().length > 0 || this.getFilesToUpload().length > 0;

    // Update the outputs
    this.add.emit(this.getFilesToUpload());
    this.remove.emit(this.getRemovedFiles());
  }

  resetChanges() {
    this.files = [];

    if (this.uploadedFiles) {
      this.uploadedFiles.forEach(file => {
        this.files.push(file);
      });
    }

    this.checkList();
  }

  removeAll() {
    this.files = [];
    this.checkList();
  }

  removeFile(id: number) {
    this.files.splice(id, 1);
    this.checkList();
  }

  /*------------------------- File acquisition methods -------------------------*/

  getRemovedFiles(): FileUploaded[] {
    const removedFiles = [] as FileUploaded[];

    if (this.uploadedFiles) {
      this.uploadedFiles.forEach(file => {
        if (this.files.findIndex(f => f === file) === -1) {
          removedFiles.push(file);
        }
      });
    }
    return removedFiles;
  }

  getFilesToUpload(): File[] {
    const files: File[] = [];

    // Filter files to upload
    if (this.files !== null) {
      this.files.forEach(file => {
        if (file instanceof File) {
          files.push(file);
        }
      });
    }

    return files;
  }

  addFiles(files: FileList) {
    for (let index = 0; index < files.length; index++) {
      // File to be added
      const newFile = files.item(index);

      // Search for file duplicates
      const ind = this.files.findIndex(item => item instanceof File && item.name === newFile.name);

      // If any duplicates are found, update the file list with the last selected
      if (ind !== -1) {
        this.files[ind] = newFile;
      } else { // Else just append the new file
        // this.files.push(newFile);
        this.files.unshift(newFile);
      }
    }
    this.checkList();
  }

  /*------------------------- Drag-and-drop methods -------------------------*/
  drop(event: DragEvent) {
    this.allowDrop(event);
    this.addFiles(event.dataTransfer.files);
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
