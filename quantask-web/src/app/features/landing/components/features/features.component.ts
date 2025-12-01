import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutGrid, Zap, BarChart3, Shield, Users, Globe } from 'lucide-angular';
import { RevealOnScrollComponent } from '../../../../shared/components/reveal-on-scroll/reveal-on-scroll.component';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RevealOnScrollComponent],
  template: `
    <section id="features" class="py-24 bg-white relative">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <app-reveal-on-scroll>
            <h2 class="text-4xl font-extrabold text-slate-900 mb-4">Features That Set Us Apart</h2>
            <p class="text-lg text-slate-500">Traditional tools are clunky. Craftboard is built for speed, combining the power of a database with the simplicity of a spreadsheet.</p>
          </app-reveal-on-scroll>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-reveal-on-scroll *ngFor="let feature of features; let idx = index" [delay]="idx * 100">
            <div class="group p-8 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300">
              <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <lucide-icon [img]="feature.icon" [size]="28"></lucide-icon>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">{{ feature.title }}</h3>
              <p class="text-slate-500 leading-relaxed">{{ feature.desc }}</p>
            </div>
          </app-reveal-on-scroll>
        </div>
      </div>
    </section>
  `
})
export class FeaturesComponent {
  features = [
    { icon: LayoutGrid, title: 'Kanban Boards', desc: 'Visualize work in progress and maximize efficiency with drag-and-drop boards.' },
    { icon: Zap, title: 'Automation', desc: 'Save time by automating repetitive tasks with our no-code rule builder.' },
    { icon: BarChart3, title: 'Real-time Analytics', desc: 'Get insights instantly. Track KPIs and team performance without manual reports.' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade encryption, SSO, and 2FA keep your data safe and compliant.' },
    { icon: Users, title: 'Team Collaboration', desc: 'Comment, mention, and share files in real-time within the context of your work.' },
    { icon: Globe, title: 'Remote Ready', desc: 'Designed for distributed teams. Work from anywhere, on any device.' },
  ];
}
