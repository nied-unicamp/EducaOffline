import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from 'src/app/models/menu';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  items: Observable<MenuItem[]>;

  constructor(private menuService: MenuService) {
    this.items = this.menuService.getItems();
  }
}
