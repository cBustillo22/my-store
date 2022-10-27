import { Component, Input } from '@angular/core';
import { Category } from 'src/app/models/product-api.model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  showMenu: boolean = false;
  @Input() categories: Category[] = [];

  constructor() { }

  toggleSideBar() {
    this.showMenu = !this.showMenu
  }

}
