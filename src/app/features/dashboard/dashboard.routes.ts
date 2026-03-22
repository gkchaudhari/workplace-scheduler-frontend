import { Routes } from "@angular/router";

export const DASHBOARD_ROUTES: Routes = [
    {
        path:'',
        loadComponent: () => import('./dashboard').then(c => c.Dashboard)
    },
    {
        path:'book-room',
        loadComponent: () => import('./book-room/book-room').then(c => c.BookRoom)
    }
]
