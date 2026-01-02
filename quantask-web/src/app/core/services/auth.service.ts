import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    id: string;
    email: string;
    firstName: string;
    first_name?: string; // Backend snake_case
    lastName: string;
    last_name?: string; // Backend snake_case
    fullName: string;
    initials: string;
    otpMethod: string;
    createdAt: string;
    avatar?: string;
    avatar_url?: string; // Add avatar_url to match backend response
    role?: string;
    location?: string;
    bio?: string;
    phone?: string;
    job_title?: string; // Add job_title
    phoneNumber?: string; // Add phoneNumber to match register logic
}

export interface AuthResponse {
    user?: { data: { id: string; attributes: User } };
    token?: string;
    otpRequired?: boolean;
    otp_code?: string; // For demo/dev purposes
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        // Defer loading to avoid circular dependency with HTTP interceptor
        setTimeout(() => this.loadUserFromStorage(), 0);
    }

    private loadUserFromStorage(): void {
        const token = this.getToken();
        if (token) {
            this.getCurrentUser().subscribe({
                next: (user) => this.currentUserSubject.next(user),
                error: (err) => {
                    console.error('Failed to load user', err);
                    if (err.status === 401) {
                        this.logout();
                    }
                }
            });
        }
    }

    register(data: {
        email: string;
        password: string;
        password_confirmation: string;
        first_name: string;
        last_name: string;
        phone_number?: string;
        otp_method?: string;
    }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, {
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            otp_method: data.otp_method || 'email'
        }).pipe(
            tap(response => {
                if (response.token) {
                    this.setToken(response.token);
                    if (response.user?.data.attributes) {
                        this.currentUserSubject.next(response.user.data.attributes);
                    }
                }
            })
        );
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
            email,
            password
        });
    }

    resendOtp(email: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/resend-otp`, {
            email
        });
    }

    verifyOtp(email: string, otpCode: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/verify-otp`, {
            email,
            otp_code: otpCode
        }).pipe(
            tap(response => {
                if (response.token) {
                    this.setToken(response.token);
                    if (response.user?.data.attributes) {
                        this.currentUserSubject.next(response.user.data.attributes);
                    }
                }
            })
        );
    }

    forgotPassword(email: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/forgot-password`, {
            email
        });
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/auth/reset-password`, {
            token,
            new_password: newPassword
        });
    }

    getCurrentUser(): Observable<User> {
        return this.http.get<{ data: { attributes: User } }>(`${environment.apiUrl}/auth/me`).pipe(
            tap(response => {
                if (response.data?.attributes) {
                    this.currentUserSubject.next(response.data.attributes);
                }
            }),
            map(response => response.data.attributes)
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    updateProfile(data: { 
        first_name: string; 
        last_name: string; 
        job_title?: string;
        bio?: string;
        location?: string;
        avatar?: File 
    }): Observable<User> {
        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        if (data.job_title) formData.append('job_title', data.job_title);
        if (data.bio) formData.append('bio', data.bio);
        if (data.location) formData.append('location', data.location);
        if (data.avatar) formData.append('avatar', data.avatar);

        return this.http.patch<{ data: { attributes: User } }>(`${environment.apiUrl}/auth/me`, formData).pipe(
            tap(response => {
               if (response.data?.attributes) {
                   this.currentUserSubject.next(response.data.attributes);
               }
            }),
            map(response => response.data.attributes)
        );
    }
}
