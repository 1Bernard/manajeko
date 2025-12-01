import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-angular';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastNotificationComponent } from '../../../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, AuthLayoutComponent, ToastNotificationComponent],
  template: `
    <app-auth-layout>
      <app-toast-notification 
        *ngIf="notification" 
        [type]="notification.type" 
        [message]="notification.message">
      </app-toast-notification>

      <div class="animate-in fade-in slide-in-from-right-8 duration-500">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p class="text-slate-500">Please enter your details to sign in.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div class="relative">
              <lucide-icon [img]="Mail" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
              <input 
                type="email" 
                formControlName="email"
                class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <lucide-icon [img]="Lock" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                formControlName="password"
                class="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                (click)="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <lucide-icon [img]="showPassword ? EyeOff : Eye" [size]="18"></lucide-icon>
              </button>
            </div>
            <div class="flex justify-end mt-2">
              <a routerLink="/auth/forgot-password" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </a>
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="isLoading || loginForm.invalid"
            class="w-full bg-[#1C1D22] text-white py-3.5 rounded-xl font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <lucide-icon *ngIf="isLoading" [img]="Loader2" [size]="20" class="animate-spin"></lucide-icon>
            <span *ngIf="!isLoading">Sign In</span>
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-gray-500">
          Don't have an account?
          <a routerLink="/auth/register" class="text-indigo-600 font-bold hover:underline">
            Create account
          </a>
        </div>
      </div>
    </app-auth-layout>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  notification: { type: 'success' | 'error', message: string } | null = null;

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Loader2 = Loader2;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notification = {
            type: 'success',
            message: 'Credentials valid. Please verify your identity.'
          };
          // Store email for OTP page
          sessionStorage.setItem('otp_email', email);
          setTimeout(() => {
            this.router.navigate(['/auth/verify-otp'], { replaceUrl: true });
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          this.notification = {
            type: 'error',
            message: error.error?.message || 'Login failed. Please try again.'
          };
          setTimeout(() => this.notification = null, 4000);
        }
      });
    }
  }
}
