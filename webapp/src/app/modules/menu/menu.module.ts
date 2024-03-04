import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuFooterComponent } from './menu-footer/menu-footer.component';
import { MenuHeaderComponent } from './menu-header/menu-header.component';
import { MenuService } from './menu.service';
import { MenuComponent } from './menu/menu.component';
import { NewsModule } from '../news/news.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    MenuFooterComponent,
    MenuHeaderComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    NewsModule,
    NgbModule
  ],
  exports: [
    MenuFooterComponent,
    MenuHeaderComponent,
    MenuComponent
  ],
  providers: [
    MenuService
  ]
})
export class MenuModule { }
