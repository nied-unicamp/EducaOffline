import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { MaterialActions } from 'src/app/state/material/material.actions';

@Component({
  selector: 'app-material-upload-files',
  templateUrl: './material-upload-files.component.html',
  styleUrls: ['./material-upload-files.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialUploadFilesComponent implements OnInit {
  files: File[] = [];
  courseId: number;

  @Input() folderId: number;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(CourseSelectors.currentId).subscribe(courseId => this.courseId = Number(courseId));
  }

  addFiles(files: FileList) {
    this.files = [];

    if (!files) {
      console.log('No files D=');
      return;
    }

    for (let index = 0; index < files.length; index++) {
      // File to be added
      this.files.push(files.item(index));
    }

    this.upload();
  }

  upload() {
    if (!this.files || this.files.length === 0) {
      return;
    }

    this.store.dispatch(MaterialActions.create.files.request({
      input: {
        files: this.files,
        courseId: this.courseId,
        folderId: this.folderId
      }
    }));
  }
}
