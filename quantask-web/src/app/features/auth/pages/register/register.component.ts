import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Loader2, Mail, Smartphone } from 'lucide-angular';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastNotificationComponent } from '../../../../shared/components/toast-notification/toast-notification.component';
import { NgxIntlTelInputModule, SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, AuthLayoutComponent, ToastNotificationComponent, NgxIntlTelInputModule],
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
        
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p class="text-slate-500">Start managing your team effectively.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text" 
                formControlName="first_name"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                placeholder="Jane"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                formControlName="last_name"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              formControlName="email"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <ngx-intl-tel-input
              [cssClass]="'w-full'"
              [preferredCountries]="['us', 'gb']"
              [enableAutoCountrySelect]="true"
              [enablePlaceholder]="true"
              [searchCountryFlag]="true"
              [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"
              [selectFirstCountry]="false"
              [selectedCountryISO]="CountryISO.UnitedStates"
              [maxLength]="15"
              [phoneValidation]="true"
              [separateDialCode]="true"
              [numberFormat]="PhoneNumberFormat.International"
              formControlName="phone_number">
            </ngx-intl-tel-input>
          </div>

          <!-- OTP Method Selector -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Where should we send security codes?
            </label>
            <div class="grid grid-cols-2 gap-4">
              <button
                type="button"
                (click)="setOtpMethod('email')"
                [class]="'flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ' + (otpMethod === 'email' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-600')"
              >
                <lucide-icon [img]="Mail" [size]="18"></lucide-icon>
                <span class="font-medium">Email</span>
              </button>
              <button
                type="button"
                (click)="setOtpMethod('sms')"
                [class]="'flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ' + (otpMethod === 'sms' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-600')"
              >
                <lucide-icon [img]="Smartphone" [size]="18"></lucide-icon>
                <span class="font-medium">SMS</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                formControlName="password"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                placeholder="••••••"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
              <input 
                type="password" 
                formControlName="password_confirmation"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                placeholder="••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="isLoading || registerForm.invalid"
            class="w-full bg-[#1C1D22] text-white py-3.5 rounded-xl font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <lucide-icon *ngIf="isLoading" [img]="Loader2" [size]="20" class="animate-spin"></lucide-icon>
            <span *ngIf="!isLoading">Create Account</span>
          </button>
        </form>
      </div>
    </app-auth-layout>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  otpMethod: 'email' | 'sms' = 'email';
  notification: { type: 'success' | 'error', message: string } | null = null;

  readonly ArrowLeft = ArrowLeft;
  readonly Loader2 = Loader2;
  readonly Mail = Mail;
  readonly Smartphone = Smartphone;

  // Phone input configuration
  readonly SearchCountryField = SearchCountryField;
  readonly CountryISO = CountryISO;
  readonly PhoneNumberFormat = PhoneNumberFormat;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      first_name: [''],
      last_name: [''],
      phone_number: [''],
      otp_method: ['email']
    });
  }

  setOtpMethod(method: 'email' | 'sms') {
    this.otpMethod = method;
    this.registerForm.patchValue({ otp_method: method });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { password, password_confirmation } = this.registerForm.value;

      if (password !== password_confirmation) {
        this.notification = { type: 'error', message: "Passwords don't match" };
        setTimeout(() => this.notification = null, 4000);
        return;
      }

      this.isLoading = true;

      // Extract phone number - ngx-intl-tel-input returns an object
      const formData = { ...this.registerForm.value };
      if (formData.phone_number && typeof formData.phone_number === 'object') {
        formData.phone_number = formData.phone_number.internationalNumber || formData.phone_number.e164Number || '';
      }

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notification = {
            type: 'success',
            message: `Account created! We sent a code to your ${this.otpMethod === 'sms' ? 'phone' : 'email'}.` + (response.otp_code ? ` (Code: ${response.otp_code})` : '')
          };
          sessionStorage.setItem('otp_email', this.registerForm.value.email);
          sessionStorage.setItem('otp_method', this.otpMethod);
          setTimeout(() => {
            this.router.navigate(['/auth/verify-otp']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.notification = {
            type: 'error',
            message: error.error?.message || 'Registration failed. Please try again.'
          };
          setTimeout(() => this.notification = null, 4000);
        }
      });
    }
  }
}
