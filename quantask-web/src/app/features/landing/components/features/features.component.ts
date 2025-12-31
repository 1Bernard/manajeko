import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutGrid, Zap, BarChart3, Shield, Users, Globe } from 'lucide-angular';
import { RevealOnScrollComponent } from '../../../../shared/components/reveal-on-scroll/reveal-on-scroll.component';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RevealOnScrollComponent],
  template: `
    <section id="features" class="py-32 relative">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-24">
          <app-reveal-on-scroll>
            <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Engineered for Clarity</h2>
            <p class="text-xl text-slate-400 font-medium leading-relaxed">Experience a suite of tools designed to remove friction and amplify your creative flow.</p>
          </app-reveal-on-scroll>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 perspective-2000">
          <app-reveal-on-scroll *ngFor="let feature of features; let idx = index" [delay]="idx * 100">
            <div class="group relative p-10 rounded-[3rem] border border-slate-100 bg-white/60 backdrop-blur-xl hover:shadow-[0_40px_100px_-20px_rgba(99,102,241,0.15)] hover:border-indigo-100 transition-all duration-700 h-full flex flex-col transform hover:-rotate-y-6 hover:-translate-y-4">
              <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-8 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-2xl group-hover:shadow-indigo-500/40 transition-all duration-500">
                <lucide-icon [img]="feature.icon" [size]="28"></lucide-icon>
              </div>
              <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">{{ feature.title }}</h3>
              <p class="text-slate-400 font-medium leading-relaxed">{{ feature.desc }}</p>
              
              <div class="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div class="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
              </div>
            </div>
          </app-reveal-on-scroll>
        </div>
      </div>
    </section>
  `
})
export class FeaturesComponent {
  features = [
    { icon: LayoutGrid, title: 'Intelligent Kanban', desc: 'A high-performance board with visual swimlanes, drag-and-drop prioritization, and intuitive task nesting.' },
    { icon: Zap, title: 'Focus Intervals', desc: 'Integrated Pomodoro-style timers that sync with your tasks to protect your deep work and prevent burnout.' },
    { icon: BarChart3, title: 'Output Analytics', desc: 'Track your velocity and identify bottlenecks with automated reports designed for high-performing teams.' },
    { icon: Shield, title: 'Strategic Planning', desc: 'Categorize your long-term goals with custom tags and milestones. Keep your project roadmap clear and actionable.' },
    { icon: Users, title: 'High-Output Sync', desc: 'Real-time collaboration with instant updates. Manajeko acts as the single source of truth for your entire operation.' },
    { icon: Globe, title: 'Velocity Engine', desc: 'A lightning-fast interface optimized for keyboard-first navigation. Get from thought to action in milliseconds.' },
  ];
}
