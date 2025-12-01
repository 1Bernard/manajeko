import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Loader2 } from 'lucide-angular';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastNotificationComponent } from '../../../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-reset-password',
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
        <a routerLink="/auth/login" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 group">
          <lucide-icon [img]="ArrowLeft" [size]="16" class="group-hover:-translate-x-1 transition-transform"></lucide-icon>
          Back to Login
        </a>
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900 mb-2">Set New Password</h1>
          <p class="text-slate-500">Enter your new password below.</p>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              type="password" 
              formControlName="password"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              formControlName="password_confirmation"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            [disabled]="isLoading || resetForm.invalid"
            class="w-full bg-[#1C1D22] text-white py-3.5 rounded-xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <lucide-icon *ngIf="isLoading" [img]="Loader2" [size]="20" class="animate-spin"></lucide-icon>
            <span *ngIf="!isLoading">Reset Password</span>
          </button>
        </form>
      </div>
    </app-auth-layout>
  `
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isLoading = false;
  resetToken: string = '';
  notification: { type: 'success' | 'error', message: string } | null = null;

  readonly ArrowLeft = ArrowLeft;
  readonly Loader2 = Loader2;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'] || '';
    });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const { password, password_confirmation } = this.resetForm.value;

      if (password !== password_confirmation) {
        this.notification = { type: 'error', message: "Passwords don't match" };
        setTimeout(() => this.notification = null, 4000);
        return;
      }

      this.isLoading = true;
      this.authService.resetPassword(this.resetToken, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notification = {
            type: 'success',
            message: 'Password reset successful! Redirecting to login...'
          };
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.notification = {
            type: 'error',
            message: error.error?.message || 'Reset failed. Please try again.'
          };
          setTimeout(() => this.notification = null, 4000);
        }
      });
    }
  }
}
