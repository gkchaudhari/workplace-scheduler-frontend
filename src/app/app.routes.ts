import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((mod) => mod.AUTH_ROUTES),
  },
  {
    path: '',
    loadComponent: () => import('./layout/app-layout').then((m) => m.AppLayout),
    loadChildren: () => import('./layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
  },
];
