import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MaterialService } from '../material.service';
import { MaterialFolder } from 'src/app/models/material-folder.model';
import { Material } from 'src/app/models/material.model';
import { MaterialActions } from 'src/app/state/material/material.actions';
import { Store } from '@ngrx/store';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { Subscription } from 'rxjs';
import { LANGUAGE } from 'src/app/dev/languages';

@Component({
  selector: 'app-material-move',
  templateUrl: './material-move.component.html',
  styleUrls: ['./material-move.component.css']
})
export class MaterialMoveComponent implements OnInit, OnChanges, OnDestroy {

  @Input() folders: MaterialFolder[] = null;
  @Input() material: Material = null;

  @Output() closeForm = new EventEmitter<void>();
  @Output() sent = new EventEmitter<void>();

  folderOptions: MaterialFolder[] = null;
  courseId: number;

  formFolder: FormGroup;

  translationText: typeof LANGUAGE.material.MaterialMoveComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private translationService: TranslationService
  ) {
    this.store.select(CourseSelectors.currentId).subscribe((data: number) => {
      this.courseId = Number(data);
    });
  }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.material.MaterialMoveComponent
      }
 	  );
    this.formFolder = this.fb.group({
      folder: [this.material.folder]
    });
    this.buildFolderOptions();
  }

  ngOnChanges(): void {
    this.buildFolderOptions();
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  setFolder(): void {
    this.formFolder = this.fb.group({
      folder: [this.material.folder]
    });
  }

  onSubmit() {

    const selectedFolder = Number(this.formFolder.value.folder);

    if (this.material.folder != selectedFolder) {
      this.store.dispatch(MaterialActions.changeMaterialFolder.request({
        input: {
          courseId: this.courseId,
          materialId: this.material?.id,
          folderId: selectedFolder
        }
      }))
    }

    this.sent.emit();
  }

  buildFolderOptions() {
    if ((!this.folderOptions && !this.folders) || (this.translationText == undefined)) return;
    this.folderOptions = [{ id: -1, title: this.translationText.rootName, description: "" }, ...this.folders];
  }
}
