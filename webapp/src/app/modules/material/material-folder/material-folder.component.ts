import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MaterialFolder } from 'src/app/models/material-folder.model';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { MaterialFolderActions } from 'src/app/state/material-folder/material-folder.actions';
import { MaterialService } from '../material.service';
import { Observable } from 'rxjs';
import { MaterialSelectors } from 'src/app/state/material/material.selector';
import { FileState } from 'src/app/models/file-uploaded.model';
import { MaterialFolderOfflineSelectors } from 'src/app/state/material-folder/offline/material-folder.offline.selector';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-material-folder',
  templateUrl: './material-folder.component.html',
  styleUrls: ['./material-folder.component.css']
})
export class MaterialFolderComponent implements OnInit {

  @Input() folder: MaterialFolder;
  @Input() canDelete: boolean;

  courseId: number;

  iconTitle = MaterialService.translationText.general.folder;

  folderHasItemsNotDeleted$: Observable<boolean>

  syncState$: Observable<FileState>;
  wasDeleted$: Observable<boolean>;

  constructor(private store: Store, private materialService: MaterialService) { }

  ngOnInit(): void {
    this.folderHasItemsNotDeleted$ = this.store.select(MaterialSelectors.folderHasItemsNotDeleted(this.folder.id));
    this.syncState$ = this.store.select(MaterialFolderOfflineSelectors.folderSyncState(this.folder.id));
    this.wasDeleted$ = this.syncState$.pipe(map(state => state == 'NeedsToBeDeleted'));
  }

  relativeLinkToFolder(): string {
    return `folder/${this.folder.id}`;
  }

  delete() {
    this.store.dispatch(MaterialFolderActions.delete.request({
      input: {
        courseId: this.courseId,
        folderId: this.folder?.id
      }
    }));
  }

  download() {
    this.materialService.downloadFolder(this.folder.id);
  }

}
