import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, Play, ChevronRight, CheckCircle2 } from 'lucide-angular';
import { RevealOnScrollComponent } from '../../../../shared/components/reveal-on-scroll/reveal-on-scroll.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, RevealOnScrollComponent],
  template: `
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <!-- Background Gradients -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-transparent -z-10"></div>
      <div class="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div class="absolute top-40 left-0 w-[400px] h-[400px] bg-pink-200/20 rounded-full blur-3xl -z-10"></div>

      <div class="max-w-7xl mx-auto px-6 text-center">
        <app-reveal-on-scroll>
          <div class="inline-flex items-center gap-2 bg-white border border-indigo-100 shadow-sm rounded-full px-4 py-1.5 mb-8">
            <span class="flex h-2 w-2 rounded-full bg-indigo-500"></span>
            <span class="text-xs font-bold text-indigo-900 tracking-wide uppercase">New v2.0 Released</span>
            <lucide-icon [img]="ChevronRight" [size]="14" class="text-indigo-400"></lucide-icon>
          </div>
        </app-reveal-on-scroll>

        <app-reveal-on-scroll [delay]="100">
          <h1 class="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
            Streamline HR Ops with <br class="hidden md:block"/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500">Dynamic Dashboards</span>
          </h1>
        </app-reveal-on-scroll>

        <app-reveal-on-scroll [delay]="200">
          <p class="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Craftboard empowers teams to organize, track, and manage complex workflows with ease. 
            The ultimate solution for modern business automation.
          </p>
        </app-reveal-on-scroll>

        <app-reveal-on-scroll [delay]="300">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <a routerLink="/auth/register" class="w-full sm:w-auto px-8 py-4 bg-[#1C1D22] text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Start for free <lucide-icon [img]="ArrowRight" [size]="18"></lucide-icon>
            </a>
            <button class="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group">
              <div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <lucide-icon [img]="Play" [size]="10" class="fill-indigo-600 text-indigo-600 ml-0.5"></lucide-icon>
              </div>
              View Demo
            </button>
          </div>
        </app-reveal-on-scroll>

        <!-- Hero Dashboard Mockup -->
        <app-reveal-on-scroll [delay]="400">
          <div class="relative max-w-5xl mx-auto perspective-1000 group">
            <!-- Floating Cards Decorations -->
            <div class="absolute -left-12 top-20 bg-white p-4 rounded-2xl shadow-xl z-20 hidden lg:block animate-bounce duration-[3000ms]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <lucide-icon [img]="CheckCircle2" [size]="20"></lucide-icon>
                </div>
                <div>
                  <p class="text-xs text-gray-400 font-semibold">Status Update</p>
                  <p class="text-sm font-bold text-gray-800">Project Completed</p>
                </div>
              </div>
            </div>
            
            <div class="absolute -right-8 bottom-32 bg-white p-4 rounded-2xl shadow-xl z-20 hidden lg:block animate-bounce duration-[4000ms]">
              <div class="flex items-center gap-3">
                <div class="flex -space-x-2">
                  <img *ngFor="let i of [1,2,3]" [src]="'https://i.pravatar.cc/100?u=' + i" class="w-8 h-8 rounded-full border-2 border-white"/>
                </div>
                <p class="text-sm font-bold text-gray-800">+ 5 New Members</p>
              </div>
            </div>

            <!-- Main Image -->
            <div class="relative rounded-2xl bg-white p-2 shadow-2xl border border-gray-200/50 transform group-hover:rotate-0 transition-transform duration-700 ease-out">
              <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
              <img 
                src="https://img.freepik.com/free-vector/gradient-ui-ux-elements-background_23-2149056159.jpg?w=1800" 
                alt="Dashboard Preview" 
                class="rounded-xl w-full h-auto object-cover border border-gray-100"
              />
              <!-- Overlay -->
              <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none flex items-center justify-center">
                <button class="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform">Explore Dashboard</button>
              </div>
            </div>
            
            <!-- Reflection/Glow below -->
            <div class="absolute -bottom-20 left-10 right-10 h-20 bg-indigo-600/20 blur-[100px] -z-10"></div>
          </div>
        </app-reveal-on-scroll>
      </div>
    </section>
  `
})
export class HeroComponent {
  readonly ArrowRight = ArrowRight;
  readonly Play = Play;
  readonly ChevronRight = ChevronRight;
  readonly CheckCircle2 = CheckCircle2;
}
