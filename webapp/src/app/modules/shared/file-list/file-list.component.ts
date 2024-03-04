import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TrackByFunction } from '@angular/core';
import { FileUploaded } from 'src/app/models/file-uploaded.model';
import { getFileId } from 'src/app/state/file-uploaded/file-uploaded.state';
import { SharedService } from './../shared.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';


@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit, OnDestroy {

  @Input() files: (File | FileUploaded)[];
  @Output() filesChanged: EventEmitter<(File | FileUploaded)[]> = new EventEmitter();
  @Input() editable = false;
  @Input() modified = false;
  @Output() check: EventEmitter<void> = new EventEmitter<void>();
  @Output() undo: EventEmitter<void> = new EventEmitter<void>();

  translationText: typeof LANGUAGE.shared.FileListComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private sharedService: SharedService,
    private translationService: TranslationService
  ) {
    this.restoreFiles();
  }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
          (translation) => {
            this.translationText = translation.shared.FileListComponent
          }
    );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  trackFile: TrackByFunction<File | FileUploaded> = (index: number, file) => {
    if (file instanceof File) {
      return file.name;
    } else if (!!file) {
      return getFileId(file);
    }

    return null;
  }

  removeFile(id: number) {
    if (this.editable) {
      // Remove the specified item
      this.files.splice(id, 1);

      // Ask the parent component to check the file list, because it was updated
      this.check.emit();
    }
  }

  removeAll() {
    if (this.editable) {

      // Remove all items
      this.files.splice(0, this.files.length);

      // Ask the parent component to check the file list, because it was updated
      this.check.emit();
    }
  }

  restoreFiles() {
    this.undo.emit();
  }

}
