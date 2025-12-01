import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Send, Loader2 } from 'lucide-angular';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastNotificationComponent } from '../../../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, AuthLayoutComponent, ToastNotificationComponent],
  template: `
    <app-auth-layout>
      <app-toast-notification 
        *ngIf="notification" 
        [type]="notification.type" 
        [message]="notification.message">
      </app-toast-notification>

      <div class="animate-in fade-in slide-in-from-left-8 duration-500">
        <a routerLink="/auth/login" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 group">
          <lucide-icon [img]="ArrowLeft" [size]="16" class="group-hover:-translate-x-1 transition-transform"></lucide-icon>
          Back to Login
        </a>
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
          <p class="text-slate-500">Enter your email and we'll send instructions.</p>
        </div>

        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              formControlName="email"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              placeholder="name@company.com"
            />
          </div>

          <button 
            type="submit" 
            [disabled]="isLoading || forgotForm.invalid"
            class="w-full bg-[#1C1D22] text-white py-3.5 rounded-xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <lucide-icon *ngIf="isLoading" [img]="Loader2" [size]="20" class="animate-spin"></lucide-icon>
            <ng-container *ngIf="!isLoading">
              <lucide-icon [img]="Send" [size]="18"></lucide-icon>
              <span>Send Link</span>
            </ng-container>
          </button>
        </form>
      </div>
    </app-auth-layout>
  `
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  notification: { type: 'success' | 'error', message: string } | null = null;

  readonly ArrowLeft = ArrowLeft;
  readonly Send = Send;
  readonly Loader2 = Loader2;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      const { email } = this.forgotForm.value;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notification = {
            type: 'success',
            message: 'If an account exists, we sent a recovery link.'
          };
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.notification = {
            type: 'error',
            message: error.error?.message || 'Something went wrong. Please try again.'
          };
          setTimeout(() => this.notification = null, 4000);
        }
      });
    }
  }
}
