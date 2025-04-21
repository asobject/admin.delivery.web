import { Routes } from '@angular/router';
import {NonAuthGuard} from './_guards/nonAuth.guard';
import {HomeComponent} from './components/home/home.component';
import {AuthGuard} from './_guards/auth.guard';
import {AuthRedirectorGuard} from './_guards/auth-redirector.guard';

export const routes: Routes = [
  {path: '', canActivate: [AuthRedirectorGuard],children:[]},
  {path: 'home', component: HomeComponent,canActivate:[AuthGuard]},
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [NonAuthGuard]
  },
  {
    path: 'admin/editor/point',
    loadComponent: () => import('./components/editor-point/editor-point.component').then(m => m.EditorPointComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/editor/order',
    loadComponent:()=>import('./components/editor-order/editor-order.component').then(m => m.EditorOrderComponent),
    canActivate: [AuthGuard]
  }
];
