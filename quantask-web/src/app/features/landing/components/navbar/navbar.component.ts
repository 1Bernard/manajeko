import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, LayoutGrid, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <nav [class]="'fixed w-full z-50 transition-all duration-300 ' + (scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6')">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-slate-200">
            <lucide-icon [img]="LayoutGrid" [size]="22"></lucide-icon>
          </div>
          <span class="text-xl font-black text-slate-900 tracking-tighter">Manajeko</span>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-8">
          <a *ngFor="let item of menuItems" 
             [href]="'#' + item.toLowerCase()" 
             class="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
            {{ item }}
          </a>
        </div>

        <div class="hidden md:flex items-center gap-4">
          <a routerLink="/auth/login" class="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-4 py-2">Log in</a>
          <a routerLink="/auth/register" class="bg-[#1C1D22] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200/50 transition-all transform hover:-translate-y-0.5">
            Get Started
          </a>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="md:hidden" (click)="toggleMobileMenu()">
          <lucide-icon [img]="mobileMenuOpen ? X : Menu"></lucide-icon>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="mobileMenuOpen" class="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 md:hidden flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
        <a *ngFor="let item of menuItems" 
           [href]="'#' + item.toLowerCase()" 
           (click)="mobileMenuOpen = false"
           class="text-lg font-medium text-slate-600 py-2 border-b border-gray-50">
          {{ item }}
        </a>
        <a routerLink="/auth/register" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold mt-2 text-center">
          Get Started
        </a>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  scrolled = false;
  mobileMenuOpen = false;
  menuItems = ['Features', 'Soundscapes', 'About'];

  readonly LayoutGrid = LayoutGrid;
  readonly Menu = Menu;
  readonly X = X;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  scrollToSection(id: string, event: Event) {
    event.preventDefault();
    this.mobileMenuOpen = false;
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
