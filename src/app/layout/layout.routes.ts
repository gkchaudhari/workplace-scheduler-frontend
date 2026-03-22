import { Routes } from '@angular/router';

export const LAYOUT_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'rooms',
    loadComponent: () => import('../features/rooms/rooms').then((m) => m.Rooms),
  },
];
