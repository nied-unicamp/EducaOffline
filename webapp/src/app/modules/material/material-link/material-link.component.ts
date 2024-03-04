import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { Material } from 'src/app/models/material.model';
import { MaterialService } from '../material.service';
import { MaterialFolder } from 'src/app/models/material-folder.model';
import { Store } from '@ngrx/store';
import { MaterialActions } from 'src/app/state/material/material.actions';
import { Observable } from 'rxjs';
import { FileState } from 'src/app/models/file-uploaded.model';
import { MaterialOfflineSelectors } from 'src/app/state/material/offline/material.offline.selector';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-material-link',
  templateUrl: './material-link.component.html',
  styleUrls: ['./material-link.component.css']
})
export class MaterialLinkComponent implements OnInit {

  @Input() material: Material;
  @Input() canDelete: boolean;
  @Input() folders: MaterialFolder[];

  courseId: number;
  dateReadable: string;
  dateFull: string;
  sizeStr: string;

  iconTitle = MaterialService.translationText.general.link;

  syncState$: Observable<FileState>;
  wasDeleted$: Observable<boolean>;

  constructor(private route: ActivatedRoute, 
              private store: Store) {
    this.route.data.subscribe((data: { course: Course }) => {
      this.courseId = data.course?.id;
    });
  }

  ngOnInit() {
    this.dateFull = this.material?.lastModifiedDate.toLocaleString('pt-BR');
    // this.dateReadable = this.sharedService.dateString(this.material?.lastModifiedDate);
    this.dateReadable = this.dateFull;
    this.syncState$ = this.store.select(MaterialOfflineSelectors.materialSyncState(this.material.id));
    this.wasDeleted$ = this.syncState$.pipe(map(state => state == 'NeedsToBeDeleted'));
  }

  openModal() {
  }

  delete() {
    this.store.dispatch(MaterialActions.delete.request({
      input: {
        courseId: this.courseId,
        materialId: this.material.id
      }
    }))
  }

}
