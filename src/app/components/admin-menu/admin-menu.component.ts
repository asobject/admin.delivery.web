import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {PanelMenu} from 'primeng/panelmenu';
import {Card} from 'primeng/card';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  imports: [
    PanelMenu,
    Card,
    RouterLink,
  ],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss'
})
export class AdminMenuComponent implements OnInit {
  items!: MenuItem[];
  ngOnInit():void  {
    this.items = [
      {
        label: 'Управление пунктами',
        icon: 'pi pi-map-marker',
        routerLink: '/admin/editor/point'
      },
      {
        label: 'Управление доставками',
        icon: 'pi pi-truck',
        routerLink: '/admin/editor/order'
      },
      {
        label: 'Управление работниками',
        icon: 'pi pi-briefcase',
      },
      {
        label: 'Управление администраторами',
        icon: 'pi pi-exclamation-triangle',
      }
    ]
  }
}
