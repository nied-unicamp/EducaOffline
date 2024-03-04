import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { FileState, FileUploaded } from 'src/app/models/file-uploaded.model';
import { FileApiService } from 'src/app/services/api/file.api.service';
import { getFileId } from 'src/app/state/file-uploaded/file-uploaded.state';
import { LoginSelectors } from 'src/app/state/login/login.selector';
import { SharedService } from './../shared.service';


@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.css']
})
export class FileItemComponent implements OnInit {

  @Input() file: (File | FileUploaded);
  @Input() editable = false;
  @Input() willDelete = false;
  @Output() remove: EventEmitter<boolean> = new EventEmitter<boolean>();

  translationText: any = {};
  baseUrl: string;
  token: string;

  constructor(private store: Store, private sharedService: SharedService, private fileApi: FileApiService) { }


  ngOnInit(): void {
    this.store.select(LoginSelectors.state).pipe(
      take(1),
    ).subscribe(loginState => {
      this.baseUrl = loginState.apiUrl;
      this.token = loginState?.token?.value;
    });
  }



  getLink(): string {
    if (this.file instanceof File) {
      return null;
    }

    return this.baseUrl + this.file?.downloadUri + `?access_token=${this.token}`;
  }

  getFileIconClass(): IconProp {
    if (this.file instanceof File) {
      return this.sharedService.getFileIconClass(this.file.type);
    } else {
      return this.sharedService.getFileIconClass(this.file?.mimeType);
    }
  }

  getFileSize(): string {
    let size = 0;

    if (this.file instanceof File) {
      size = this.file.size;
    } else {
      size = this.file?.byteSize;
    }
    // Transforms a byte size to an human readable size string
    return this.sharedService.byteSizeString(size);
  }

  getFileName(): string {
    if (this.file instanceof File) {
      return this.file.name;
    } else {
      return this.file?.fileName;
    }
  }

  /**
   * To remove the file, update 'willDelete' for showing purposes and emit the remove event
   */
  updateRemovalStatus(): void {
    this.willDelete = !this.willDelete;
    this.remove.emit(this.willDelete);
  }

  isUploaded(): boolean {
    return !(this.file instanceof File);
  }


  openLocalFile(event: Event) {
    if (this.file instanceof File) {
      return
    }

    const myFile = this.file


    let fileId = getFileId(myFile);

    if ([
      FileState.Downloaded,
      FileState.NeedsToBeUploaded,
      FileState.IsUploading
    ].includes(myFile.status.currently)) {
      event.preventDefault();
      console.warn('Preventing default!!')
    } else {
      console.warn('Downloading directly!!')
      return;
    }

    this.fileApi.getFile<Blob>(fileId).subscribe(
      file => {

        console.log({ fileId, file })
        const url = URL.createObjectURL(file)
        var a = document.createElement("a");
        a.href = url;
        // a.target = 'texto';
        // Don't set download attribute
        a.download = myFile.fileName;
        a.click();

        // window.open(url, '_blank');

        setTimeout(() => {
          URL.revokeObjectURL(url)
        }, 500);
      }
    )
  }
}
