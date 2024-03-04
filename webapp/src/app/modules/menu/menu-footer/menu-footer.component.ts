import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from 'src/app/models/menu';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-menu-footer',
  templateUrl: './menu-footer.component.html',
  styleUrls: ['./menu-footer.component.css']
})
export class MenuFooterComponent {

  items: Observable<MenuItem[]>;

  constructor(private menuService: MenuService) {
    this.items = this.menuService.getItems();
  }
}
