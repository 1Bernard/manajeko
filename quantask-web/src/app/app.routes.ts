import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing/pages/landing/landing.component').then(m => m.LandingComponent)
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
        canActivate: [GuestGuard]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/components/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/dashboard/pages/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
            },
            {
                path: 'project/:id',
                loadComponent: () => import('./features/dashboard/pages/project-board/project-board.component').then(m => m.ProjectBoardComponent)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./features/dashboard/pages/notification-page/notification-page.component').then(m => m.NotificationPageComponent)
            },
            {
                path: 'calendar',
                loadComponent: () => import('./features/dashboard/pages/calendar-page/calendar-page.component').then(m => m.CalendarPageComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/dashboard/pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
            }
        ]
    }
];
