import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutGrid } from 'lucide-angular';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#F8F9FB] flex font-sans text-slate-800">
      <div class="bg-white w-full flex">
        
        <!-- Left Side: Brand & Art -->
        <div class="hidden lg:flex w-5/12 bg-[#0F1014] relative flex-col justify-between p-12 text-white overflow-hidden">
          <!-- Background Decorations -->
          <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white">
                <lucide-icon [img]="LayoutGrid" [size]="18"></lucide-icon>
              </div>
              <span class="text-lg font-bold tracking-tight">Craftboard.</span>
            </div>
          </div>

          <div class="relative z-10 mb-12">
            <h2 class="text-4xl font-extrabold mb-6 leading-tight">
              Secure access for <br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Modern Teams.</span>
            </h2>
            <p class="text-gray-400 leading-relaxed max-w-sm">
              Manage your workflows, automate tasks, and collaborate securely with enterprise-grade protection.
            </p>
          </div>

          <div class="relative z-10 flex items-center gap-4 text-xs text-gray-500 font-medium">
            <span>© 2025 Craftboard Inc.</span>
            <span class="w-1 h-1 rounded-full bg-gray-700"></span>
            <a href="#" class="hover:text-gray-300">Privacy</a>
            <span class="w-1 h-1 rounded-full bg-gray-700"></span>
            <a href="#" class="hover:text-gray-300">Terms</a>
          </div>
        </div>

        <!-- Right Side: Forms -->
        <div class="w-full lg:w-7/12 p-8 md:p-16 flex flex-col justify-center relative">
          <div class="max-w-md mx-auto w-full transition-all duration-500">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthLayoutComponent {
  readonly LayoutGrid = LayoutGrid;
}
