import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news/news.component';
import { NewsService } from './news.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NewsComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    SharedModule,
    RouterModule
  ],
  providers: [
    NewsService
  ],
  exports: [
    NewsComponent
  ]
})
export class NewsModule { }
