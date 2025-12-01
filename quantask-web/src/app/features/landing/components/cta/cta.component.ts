import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollComponent } from '../../../../shared/components/reveal-on-scroll/reveal-on-scroll.component';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealOnScrollComponent],
  template: `
    <section class="py-24 bg-white text-center">
      <app-reveal-on-scroll>
        <div class="max-w-4xl mx-auto px-6 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-[3rem] p-12 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl"></div>
          
          <h2 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 relative z-10">Supercharge Your Workflow</h2>
          <p class="text-lg text-slate-600 mb-10 max-w-2xl mx-auto relative z-10">Join 10,000+ teams who have switched to Craftboard. Start your 14-day free trial today.</p>
          
          <div class="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <a routerLink="/auth/register" class="px-8 py-4 bg-[#1C1D22] text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">Get Started Now</a>
            <button class="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">Talk to Sales</button>
          </div>
        </div>
      </app-reveal-on-scroll>
    </section>
  `
})
export class CtaComponent { }
