import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MaterialFolder } from 'src/app/models/material-folder.model';
import { MaterialService } from '../material.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-material-menu',
  templateUrl: './material-menu.component.html',
  styleUrls: ['./material-menu.component.css']
})
export class MaterialMenuComponent implements OnInit, OnDestroy{

  @Input() canUpload: boolean;
  @Input() folder: MaterialFolder;

  translationText: typeof LANGUAGE.material;
  private translationSubscription: Subscription | undefined;

  constructor(
    private translationService: TranslationService,
    private materialService: MaterialService
  ) { }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
          (translation) => {
            this.translationText = translation.material
          }
       );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
	}  

  downloadFolder() {
    this.materialService.downloadFolder(this.folder.id);
  }
}
