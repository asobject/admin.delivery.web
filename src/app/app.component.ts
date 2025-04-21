import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';
import {HeaderComponent} from './components/header/header.component';
import {UserService} from './_services/user/user.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialog, Toast, HeaderComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'admin.delivery';
  constructor(public userService: UserService) {}
}
