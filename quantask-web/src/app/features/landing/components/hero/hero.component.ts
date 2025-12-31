import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, Github, ChevronRight, CheckCircle2, LayoutGrid, Activity } from 'lucide-angular';
import { RevealOnScrollComponent } from '../../../../shared/components/reveal-on-scroll/reveal-on-scroll.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, RevealOnScrollComponent],
  template: `
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <!-- Background Gradients -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-50/20 via-slate-50/30 to-transparent -z-10"></div>
      <div class="absolute top-40 right-10 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-[120px] -z-10"></div>
      
      <div class="max-w-7xl mx-auto px-6 text-center">
        <app-reveal-on-scroll>
          <div class="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 shadow-sm rounded-full px-5 py-1.5 mb-10">
            <span class="flex h-2 w-2 rounded-full bg-indigo-500/80 animate-pulse"></span>
            <span class="text-[10px] font-black text-slate-800 tracking-[0.2em] uppercase">Private Beta Access</span>
            <lucide-icon [img]="ChevronRight" [size]="12" class="text-slate-300"></lucide-icon>
          </div>
        </app-reveal-on-scroll>

        <app-reveal-on-scroll [delay]="100">
          <h1 class="text-6xl lg:text-[5.5rem] font-black text-slate-900 tracking-tight mb-8 leading-[0.95] max-w-4xl mx-auto">
            Master your focus. <br class="hidden md:block"/>
            <span class="text-indigo-600">Amplify impact.</span>
          </h1>
        </app-reveal-on-scroll>

        <app-reveal-on-scroll [delay]="200">
          <p class="text-xl text-slate-400 font-medium max-w-xl mx-auto mb-14 leading-relaxed">
            Manajeko is the ultimate sanctuary for elite creators. Experience task management redesigned for pure clarity and momentum.
          </p>
        </app-reveal-on-scroll>

        <app-reveal-on-scroll [delay]="300">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <a routerLink="/auth/register" class="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-3xl font-bold text-lg hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:-translate-y-1 flex items-center justify-center gap-3">
              Experience Now <lucide-icon [img]="ArrowRight" [size]="20"></lucide-icon>
            </a>
            <a href="https://github.com/1Bernard/quantask.git" target="_blank" class="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-100 rounded-3xl font-bold text-lg hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 flex items-center justify-center gap-3 group">
              View Source <lucide-icon [img]="Github" [size]="20" class="text-slate-400 group-hover:text-slate-900 transition-colors"></lucide-icon>
            </a>
          </div>
        </app-reveal-on-scroll>

        <!-- Abstract Floating UI -->
        <app-reveal-on-scroll [delay]="400">
          <div class="relative max-w-5xl mx-auto h-[500px] mt-16 perspective-2000 group">
            <!-- Main Dashboard Card -->
            <div class="absolute inset-0 bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/40 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden transform group-hover:scale-[1.01] transition-all duration-1000 rotate-x-6">
              <div class="flex h-full">
                <!-- Sidebar Decor -->
                <div class="w-16 h-full bg-slate-900 flex flex-col items-center py-8 gap-6">
                  <div class="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <lucide-icon [img]="LayoutGrid" [size]="18"></lucide-icon>
                  </div>
                  <div class="w-2 h-2 rounded-full bg-slate-700" *ngFor="let i of [1,2,3,4]"></div>
                </div>
                <!-- Content Decor -->
                <div class="flex-1 p-10 text-left">
                  <div class="flex items-center justify-between mb-12">
                    <div class="space-y-2">
                      <div class="h-6 w-48 bg-slate-900/10 rounded-full"></div>
                      <div class="h-4 w-32 bg-slate-900/5 rounded-full"></div>
                    </div>
                    <div class="flex -space-x-3">
                      <div class="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600">JD</div>
                      <div class="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">RT</div>
                      <div class="w-10 h-10 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-xs font-bold text-white">+4</div>
                    </div>
                  </div>
                  <div class="space-y-6">
                    <div *ngFor="let i of [1,2,3]" class="flex items-center gap-6 p-4 rounded-2xl border border-slate-50 bg-white/20">
                      <div class="w-6 h-6 rounded-lg border-2 border-slate-200"></div>
                      <div class="h-4 w-1/2 bg-slate-900/5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Activity Card -->
            <div class="absolute -top-12 -left-8 w-64 p-6 bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-2xl animate-float-slow transform -rotate-12 z-20">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <lucide-icon [img]="Activity" [size]="20"></lucide-icon>
                </div>
                <div>
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Velocity</div>
                  <div class="text-lg font-black text-slate-900">+12.4%</div>
                </div>
              </div>
              <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full w-3/4 bg-emerald-500 rounded-full"></div>
              </div>
            </div>

            <!-- Floating Task Card -->
            <div class="absolute -bottom-10 -right-8 w-72 p-6 bg-indigo-600 rounded-3xl shadow-2xl animate-float transform rotate-6 z-20">
              <div class="flex items-center gap-3 mb-4">
                <lucide-icon [img]="CheckCircle2" [size]="18" class="text-indigo-200"></lucide-icon>
                <span class="text-xs font-bold text-indigo-100 tracking-wide uppercase">Active Milestone</span>
              </div>
              <h4 class="text-white font-black text-lg mb-2">Refine Flow Analytics</h4>
              <p class="text-indigo-200 text-xs font-medium leading-relaxed opacity-80">Finalizing the integration of real-time velocity tracking for elite teams.</p>
            </div>
            
            <div class="absolute -bottom-16 left-1/4 right-1/4 h-32 bg-indigo-500/10 blur-[120px] -z-10"></div>
          </div>
        </app-reveal-on-scroll>
      </div>
    </section>
  `
})
export class HeroComponent {
  readonly ArrowRight = ArrowRight;
  readonly Github = Github;
  readonly ChevronRight = ChevronRight;
  readonly CheckCircle2 = CheckCircle2;
  readonly LayoutGrid = LayoutGrid;
  readonly Activity = Activity;
}
