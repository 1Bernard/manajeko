import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../../../core/services/auth.service';
import { LucideAngularModule, User as UserIcon, MapPin, Briefcase, Mail, Phone, Camera, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Profile Settings</h1>
        <p class="text-gray-500 mt-2">Manage your account information and preferences.</p>
      </div>

      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Banner/Header -->
        <div class="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div class="absolute -bottom-16 left-8">
            <div class="relative group">
               <!-- Avatar Display -->
               <img *ngIf="this.currentUser?.avatar_url || this.currentUser?.avatar; else avatarFallback" 
                    [src]="this.currentUser?.avatar_url || this.currentUser?.avatar" 
                    class="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md bg-white">
                
               <ng-template #avatarFallback>
                  <div class="w-32 h-32 rounded-full border-4 border-white bg-indigo-50 flex items-center justify-center shadow-md text-3xl font-bold text-indigo-600">
                      {{ currentUser?.initials || 'U' }}
                  </div>
               </ng-template>

               <!-- Upload Overlay -->
               <label class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <lucide-icon [img]="Camera" class="text-white" [size]="24"></lucide-icon>
                  <input type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*">
               </label>
            </div>
          </div>
        </div>

        <div class="pt-20 px-8 pb-8">
           <!-- Profile Form -->
           <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <!-- First Name -->
                <div>
                   <label class="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                   <input type="text" formControlName="first_name" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900">
                </div>

                <!-- Last Name -->
                <div>
                   <label class="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                   <input type="text" formControlName="last_name" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900">
                </div>

                <!-- Email (Read-only) -->
                <div class="md:col-span-2">
                   <label class="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                   <div class="relative">
                      <lucide-icon [img]="Mail" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
                      <input type="email" [value]="currentUser?.email" disabled class="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed">
                   </div>
                </div>

                <!-- Job Title -->
                <div>
                   <label class="block text-sm font-bold text-gray-700 mb-1">Job Title</label>
                   <div class="relative">
                      <lucide-icon [img]="Briefcase" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
                      <input type="text" formControlName="job_title" placeholder="e.g. Senior Developer" class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900">
                   </div>
                </div>

                <!-- Location -->
                <div>
                   <label class="block text-sm font-bold text-gray-700 mb-1">Location</label>
                   <div class="relative">
                      <lucide-icon [img]="MapPin" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
                      <input type="text" formControlName="location" placeholder="e.g. San Francisco, CA" class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900">
                   </div>
                </div>

                <!-- Bio -->
                <div class="md:col-span-2">
                   <label class="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                   <textarea formControlName="bio" [attr.maxlength]="300" rows="4" placeholder="Tell us a little about yourself..." class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900 resize-none"></textarea>
                   <p class="text-xs text-gray-400 mt-1 text-right">{{ bioLength }}/300 characters</p>
                </div>
              </div>

              <div class="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                 <button type="button" class="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                 <button type="submit" [disabled]="isSaving" class="px-6 py-2.5 text-sm font-bold text-white bg-[#1C1D22] hover:bg-gray-900 rounded-xl shadow-lg shadow-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    <lucide-icon *ngIf="isSaving" [img]="Loader2" [size]="16" class="animate-spin"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  selectedFile: File | null = null;
  isSaving = false;

  readonly UserIcon = UserIcon;
  readonly MapPin = MapPin;
  readonly Briefcase = Briefcase;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Camera = Camera;
  readonly Loader2 = Loader2;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      job_title: [''],
      location: [''],
      bio: ['']
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          first_name: user.firstName, // Note: AuthService transforms keys to camelCase? Need to check
          last_name: user.lastName,
          job_title: user.job_title,
          location: user.location,
          bio: user.bio
        });
        
        // Handle name mapping if AuthService doesn't transform all (our interface has firstName but API sends first_name usually, 
        // need to check if AuthService standardizes this mapping. Assuming standard mapping based on User interface.)
        // Checked User interface in step 7130: has firstName, lastName (camel) but updated Auth service maps response data.attributes.
        // Wait, backend JSON:API serializer sends snake_case unless configured otherwise.
        // Let's check AuthService.getCurrentUser and mapping logic.
        // Step 7100: "map(response => response.data.attributes)". 
        // Step 7120 (Serializer): attributes :email, :first_name, :last_name...
        // So the objects coming from backend are SNAKE_CASE.
        // BUT the frontend Interface `User` (Step 7130) has `firstName`, `lastName` (camelCase) AND `first_name`, `last_name`?
        // Step 7130: 
        // 9:     firstName: string;
        // 10:    lastName: string;
        // ...
        // 15:    avatar?: string;
        
        // Wait, looking at Step 7100 (original file), lines 9-10 are `firstName`, `lastName`.
        // But the backend serializer (Step 7120) sends `first_name`, `last_name`.
        // Does the frontend auto-transform keys? Or is the interface actually mismatching the runtime object?
        // Angular HttpClient does NOT auto-transform keys.
        // So `response.data.attributes` will strictly have `first_name`.
        // If the interface says `firstName`, then `user.firstName` will be undefined at runtime!
        // I need to be careful here. I should check if I need to use `first_name` in the form patch.
        // Let's assume the OBJECT at runtime keys are `first_name`.
        
        // Correcting form patch to use potential snake_case properties if they exist on the object, 
        // or safer: access via any
        const u = user as any;
        this.profileForm.patchValue({
            first_name: u.first_name || u.firstName,
            last_name: u.last_name || u.lastName,
            job_title: u.job_title,
            location: u.location,
            bio: u.bio
        });
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.currentUser) {
            // Optimistic display
            this.currentUser = { ...this.currentUser, avatar_url: e.target.result };
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSaving = true;
      const formVal = this.profileForm.value;
      
      this.authService.updateProfile({
        first_name: formVal.first_name,
        last_name: formVal.last_name,
        job_title: formVal.job_title,
        location: formVal.location,
        bio: formVal.bio,
        avatar: this.selectedFile || undefined
      }).subscribe({
        next: (updatedUser) => {
          this.isSaving = false;
          // Toast or notification could go here
        },
        error: (err) => {
          console.error('Profile update failed', err);
          this.isSaving = false;
        }
      });
    }
  }
  get bioLength(): number {
    const bio = this.profileForm.get('bio')?.value || '';
    return bio.length;
  }
}
