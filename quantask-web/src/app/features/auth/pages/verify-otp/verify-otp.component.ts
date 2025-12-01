import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, ShieldCheck, Loader2, RefreshCw } from 'lucide-angular';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastNotificationComponent } from '../../../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, AuthLayoutComponent, ToastNotificationComponent],
  template: `
    <app-auth-layout>
      <app-toast-notification 
        *ngIf="notification" 
        [type]="notification.type" 
        [message]="notification.message">
      </app-toast-notification>

      <div class="animate-in fade-in zoom-in duration-300 text-center">
        <div class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <lucide-icon [img]="ShieldCheck" [size]="32"></lucide-icon>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Verify it's you</h2>
        <p class="text-gray-500 mb-8 max-w-[280px] mx-auto">
          We sent a 6-digit code to your {{ otpMethod === 'sms' ? 'phone' : 'email' }}
          <br/><span class="font-semibold text-gray-900">{{ email }}</span>
        </p>

        <form [formGroup]="otpForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="flex justify-center gap-2">
            <input 
              type="text" 
              maxlength="6"
              formControlName="otp_code"
              (input)="onOtpInput($event)"
              class="w-48 text-center text-3xl font-bold tracking-widest py-3 border-b-2 border-gray-200 focus:border-indigo-600 outline-none bg-transparent transition-colors"
              placeholder="000000"
              autofocus
            />
          </div>

          <button 
            type="submit" 
            [disabled]="isLoading || otpForm.invalid || otpForm.value.otp_code.length < 4"
            class="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <lucide-icon *ngIf="isLoading" [img]="Loader2" [size]="20" class="animate-spin"></lucide-icon>
            <span *ngIf="!isLoading">Verify Code</span>
          </button>
        </form>

        <div class="mt-8">
          <button 
            (click)="resendCode()"
            [disabled]="isLoading"
            class="text-sm text-gray-500 hover:text-indigo-600 font-medium flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            <lucide-icon [img]="RefreshCw" [size]="14"></lucide-icon> Resend Code
          </button>
        </div>
      </div>
    </app-auth-layout>
  `
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  otpForm: FormGroup;
  isLoading = false;
  email: string = '';
  otpMethod: string = 'email';
  notification: { type: 'success' | 'error', message: string } | null = null;
  private popStateListener: (() => void) | null = null;

  readonly ShieldCheck = ShieldCheck;
  readonly Loader2 = Loader2;
  readonly RefreshCw = RefreshCw;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.otpForm = this.fb.group({
      otp_code: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit() {
    // Prevent browser back/forward navigation
    history.pushState(null, '', location.href);
    this.popStateListener = () => {
      history.pushState(null, '', location.href);
    };
    window.addEventListener('popstate', this.popStateListener);
    this.email = sessionStorage.getItem('otp_email') || '';
    this.otpMethod = sessionStorage.getItem('otp_method') || 'email';

    if (!this.email) {
      this.router.navigate(['/auth/login']);
    }
  }

  onOtpInput(event: any) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.otpForm.patchValue({ otp_code: value });
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      const { otp_code } = this.otpForm.value;

      this.authService.verifyOtp(this.email, otp_code).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notification = {
            type: 'success',
            message: 'Verification successful! Redirecting...'
          };
          sessionStorage.removeItem('otp_email');
          sessionStorage.removeItem('otp_method');
          setTimeout(() => {
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.notification = {
            type: 'error',
            message: error.error?.message || 'Invalid code. Please try again.'
          };
          setTimeout(() => this.notification = null, 4000);
        }
      });
    }
  }

  resendCode() {
    this.notification = {
      type: 'success',
      message: 'A new code has been sent!'
    };
    setTimeout(() => this.notification = null, 4000);
  }

  ngOnDestroy() {
    // Clean up the popstate listener when component is destroyed
    if (this.popStateListener) {
      window.removeEventListener('popstate', this.popStateListener);
    }
  }
}
