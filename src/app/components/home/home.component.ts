import { Component } from '@angular/core';
import {AdminMenuComponent} from '../admin-menu/admin-menu.component';

@Component({
  selector: 'app-home',
  imports: [
    AdminMenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
