import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LucideAngularModule,
    Camera, UserPlus, Mail, Phone, Briefcase, MapPin, Globe, ChevronDown,
    Shield, Lock, Smartphone, Settings, Moon, Bell, LogOut, ChevronRight, ImageIcon
} from 'lucide-angular';
import { AuthService, User } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <!-- Banner & Header -->
      <div class="relative mb-24">
          <div class="h-64 rounded-t-[2.5rem] bg-gradient-to-r from-indigo-600 to-violet-700 overflow-hidden relative">
             <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
             <!-- Edit Cover Button -->
             <button class="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2">
                 <lucide-icon [img]="ImageIcon" [size]="14"></lucide-icon> Change Cover
             </button>
          </div>
          
          <!-- Avatar Card -->
          <div class="absolute -bottom-16 left-8 flex items-end gap-6" *ngIf="currentUser$ | async as user">
              <div class="relative group">
                  <img [src]="user.avatar || 'https://i.pravatar.cc/150?u=' + user.id" alt="Profile" class="w-32 h-32 rounded-3xl border-4 border-white shadow-xl object-cover bg-white"/>
                  <button class="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105">
                      <lucide-icon [img]="Camera" [size]="16"></lucide-icon>
                  </button>
              </div>
              <div class="mb-4">
                  <h1 class="text-3xl font-extrabold text-gray-900">{{ user.fullName }}</h1>
                  <p class="text-gray-500 font-medium flex items-center gap-2">
                      {{ user.role || 'Senior Product Designer' }}
                      <span class="w-1 h-1 rounded-full bg-gray-300"></span> 
                      <span class="text-indigo-600">{{ user.location || 'San Francisco, CA' }}</span>
                  </p>
              </div>
          </div>

          <!-- Action Buttons -->
          <div class="absolute -bottom-12 right-8 flex gap-3">
              <button class="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
                  Cancel
              </button>
              <button class="px-5 py-2.5 bg-[#1C1D22] text-white rounded-xl font-bold hover:bg-indigo-600 shadow-lg shadow-indigo-200 transition-all">
                  Save Changes
              </button>
          </div>
      </div>

      <!-- Main Grid Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" *ngIf="currentUser$ | async as user">
          
          <!-- Left Column: Personal Info Form -->
          <div class="lg:col-span-2 space-y-8">
              <!-- Personal Information Card -->
              <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                  <div class="flex items-center justify-between mb-8">
                      <div>
                          <h3 class="text-xl font-bold text-gray-900">Personal Information</h3>
                          <p class="text-sm text-gray-500 mt-1">Update your photo and personal details here.</p>
                      </div>
                      <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                          <lucide-icon [img]="UserPlus" [size]="20"></lucide-icon>
                      </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                          <label class="text-sm font-bold text-gray-700">First Name</label>
                          <div class="relative">
                              <input type="text" [value]="user.firstName" class="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800"/>
                          </div>
                      </div>
                      <div class="space-y-2">
                          <label class="text-sm font-bold text-gray-700">Last Name</label>
                          <input type="text" [value]="user.lastName" class="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800"/>
                      </div>
                      
                      <div class="md:col-span-2 space-y-2">
                          <label class="text-sm font-bold text-gray-700">Email Address</label>
                          <div class="relative">
                              <lucide-icon [img]="Mail" [size]="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
                              <input type="email" [value]="user.email" class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800"/>
                          </div>
                      </div>

                      <div class="space-y-2">
                          <label class="text-sm font-bold text-gray-700">Phone Number</label>
                          <div class="relative">
                              <lucide-icon [img]="Phone" [size]="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
                              <input type="text" [value]="user.phone || '+1 (555) 123-4567'" class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800"/>
                          </div>
                      </div>
                      
                      <div class="space-y-2">
                          <label class="text-sm font-bold text-gray-700">Role / Job Title</label>
                          <div class="relative">
                              <lucide-icon [img]="Briefcase" [size]="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
                              <input type="text" [value]="user.role || 'Senior Product Designer'" class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800"/>
                          </div>
                      </div>

                      <div class="md:col-span-2 space-y-2">
                          <label class="text-sm font-bold text-gray-700">Bio</label>
                          <textarea rows="4" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800 resize-none">{{ user.bio || 'Passionate about creating intuitive user experiences and design systems. Always looking for the next big challenge in UI/UX.' }}</textarea>
                          <p class="text-xs text-gray-400 text-right">250 characters left</p>
                      </div>
                  </div>
              </div>

              <!-- Address Card -->
              <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                  <div class="flex items-center justify-between mb-8">
                      <div>
                          <h3 class="text-xl font-bold text-gray-900">Address</h3>
                          <p class="text-sm text-gray-500 mt-1">Used for shipping and billing.</p>
                      </div>
                      <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                          <lucide-icon [img]="MapPin" [size]="20"></lucide-icon>
                      </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="md:col-span-2 space-y-2">
                          <label class="text-sm font-bold text-gray-700">Country</label>
                          <div class="relative">
                              <lucide-icon [img]="Globe" [size]="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
                              <select class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800 appearance-none">
                                  <option>United States</option>
                                  <option>Canada</option>
                                  <option>United Kingdom</option>
                              </select>
                              <lucide-icon [img]="ChevronDown" [size]="16" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></lucide-icon>
                          </div>
                      </div>
                      <div class="space-y-2">
                          <label class="text-sm font-bold text-gray-700">City</label>
                          <input type="text" value="San Francisco" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800"/>
                      </div>
                      <div class="space-y-2">
                          <label class="text-sm font-bold text-gray-700">State</label>
                          <input type="text" value="California" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800"/>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Right Column: Settings & Security -->
          <div class="space-y-8">
              
              <!-- Account Stats (Bento Mini) -->
              <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                      <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2 font-bold text-sm">24</div>
                      <p class="text-sm font-bold text-gray-800">Completed</p>
                  </div>
                  <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                      <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 font-bold text-sm">8</div>
                      <p class="text-sm font-bold text-gray-800">Active</p>
                  </div>
              </div>

              <!-- Security Settings -->
              <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                  <div class="flex items-center gap-3 mb-6">
                      <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                          <lucide-icon [img]="Shield" [size]="20"></lucide-icon>
                      </div>
                      <h3 class="font-bold text-gray-900">Security</h3>
                  </div>
                  
                  <div class="space-y-4">
                      <div class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                          <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><lucide-icon [img]="Lock" [size]="14"></lucide-icon></div>
                              <div>
                                  <p class="text-sm font-bold text-gray-800">Change Password</p>
                                  <p class="text-xs text-gray-400">Last changed 3 months ago</p>
                              </div>
                          </div>
                          <lucide-icon [img]="ChevronRight" [size]="16" class="text-gray-300"></lucide-icon>
                      </div>
                      
                      <!-- 2FA Toggle -->
                      <div class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                          <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500"><lucide-icon [img]="Smartphone" [size]="14"></lucide-icon></div>
                              <div>
                                  <p class="text-sm font-bold text-gray-800">2-Step Verification</p>
                                  <p class="text-xs text-gray-400">Enabled</p>
                              </div>
                          </div>
                          <div class="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                              <div class="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Preferences -->
              <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                  <div class="flex items-center gap-3 mb-6">
                      <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                          <lucide-icon [img]="Settings" [size]="20"></lucide-icon>
                      </div>
                      <h3 class="font-bold text-gray-900">Preferences</h3>
                  </div>
                  
                  <div class="space-y-4">
                      <div class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                          <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><lucide-icon [img]="Moon" [size]="14"></lucide-icon></div>
                              <p class="text-sm font-bold text-gray-800">Dark Mode</p>
                          </div>
                          <div class="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                              <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                          </div>
                      </div>
                      <div class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                          <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><lucide-icon [img]="Bell" [size]="14"></lucide-icon></div>
                              <p class="text-sm font-bold text-gray-800">Notifications</p>
                          </div>
                          <div class="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                              <div class="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                      </div>
                  </div>
              </div>

              <button (click)="logout()" class="w-full py-4 rounded-xl border border-red-100 text-red-500 font-bold bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                  <lucide-icon [img]="LogOut" [size]="18"></lucide-icon> Log Out
              </button>

          </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
    // Icons
    readonly Camera = Camera;
    readonly UserPlus = UserPlus;
    readonly Mail = Mail;
    readonly Phone = Phone;
    readonly Briefcase = Briefcase;
    readonly MapPin = MapPin;
    readonly Globe = Globe;
    readonly ChevronDown = ChevronDown;
    readonly Shield = Shield;
    readonly Lock = Lock;
    readonly Smartphone = Smartphone;
    readonly Settings = Settings;
    readonly Moon = Moon;
    readonly Bell = Bell;
    readonly LogOut = LogOut;
    readonly ChevronRight = ChevronRight;
    readonly ImageIcon = ImageIcon;

    currentUser$: Observable<User | any>;

    constructor(private authService: AuthService) {
        this.currentUser$ = this.authService.currentUser$;
    }

    ngOnInit() {
        this.authService.getCurrentUser().subscribe();
    }

    logout() {
        this.authService.logout();
    }
}
