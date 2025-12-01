import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class GuestGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): Observable<boolean | UrlTree> {
        return this.authService.currentUser$.pipe(
            map(user => {
                if (user) {
                    // If user is logged in, redirect to dashboard
                    return this.router.createUrlTree(['/dashboard']);
                }
                // If user is not logged in, allow access to auth pages
                return true;
            })
        );
    }
}
