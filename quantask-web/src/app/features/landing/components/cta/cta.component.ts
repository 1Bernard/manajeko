import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollComponent } from '../../../../shared/components/reveal-on-scroll/reveal-on-scroll.component';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealOnScrollComponent],
  template: `
    <section id="about" class="py-32 relative">
      <app-reveal-on-scroll>
        <div class="max-w-6xl mx-auto px-6">
          <div class="relative bg-slate-900 rounded-[3rem] p-16 md:p-24 overflow-hidden text-center">
            <!-- Sophisticated Accents -->
            <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-0"></div>
            <div class="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-0"></div>
            
            <div class="relative z-10">
              <h2 class="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">Your journey to <br/> clarity starts now.</h2>
              <p class="text-xl text-slate-400 mb-14 max-w-2xl mx-auto font-medium">Join a refined circle of creators who prioritize their focus as much as their output. Start your transformation today.</p>
              
              <div class="flex flex-col sm:flex-row justify-center gap-6">
                <a routerLink="/auth/register" class="px-12 py-5 bg-white text-slate-900 rounded-3xl font-bold text-lg hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all duration-500">Get Early Access</a>
                <button class="px-12 py-5 bg-slate-800 text-white border border-slate-700 rounded-3xl font-bold text-lg hover:bg-slate-700 transition-all duration-500">View Experience</button>
              </div>
            </div>
          </div>
        </div>
      </app-reveal-on-scroll>
    </section>
  `
})
export class CtaComponent { }
