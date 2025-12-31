import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollComponent } from '../../../../shared/components/reveal-on-scroll/reveal-on-scroll.component';
import { LucideAngularModule, Quote } from 'lucide-angular';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, RevealOnScrollComponent, LucideAngularModule],
  template: `
    <section id="soundscapes" class="py-32 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <app-reveal-on-scroll>
            <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Chosen-by the Visionaries</h2>
            <p class="text-xl text-slate-400 font-medium leading-relaxed">Join the high-performers who have found their center with Manajeko.</p>
          </app-reveal-on-scroll>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <app-reveal-on-scroll *ngFor="let t of testimonials; let idx = index" [delay]="idx * 100">
            <div class="group p-10 rounded-[3rem] bg-white/40 backdrop-blur-xl border border-slate-100 hover:border-indigo-100 hover:shadow-[0_40px_100px_-20px_rgba(99,102,241,0.1)] transition-all duration-700 h-full flex flex-col transform hover:-translate-y-4">
              <div class="text-indigo-500 mb-8 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                <lucide-icon [img]="QuoteIcon" [size]="40"></lucide-icon>
              </div>
              <p class="text-slate-600 italic mb-10 flex-1 leading-relaxed font-medium text-lg">"{{ t.content }}"</p>
              <div class="flex items-center gap-5 border-t border-slate-100/50 pt-8">
                <div class="relative">
                  <img [src]="t.avatar" [alt]="t.author" class="w-14 h-14 rounded-[1.2rem] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h4 class="font-black text-slate-900 text-lg">{{ t.author }}</h4>
                  <p class="text-sm text-slate-400 font-bold tracking-wide uppercase">{{ t.role }}</p>
                </div>
              </div>
            </div>
          </app-reveal-on-scroll>
        </div>
      </div>
    </section>
  `
})
export class TestimonialsComponent {
  readonly QuoteIcon = Quote;
  
  testimonials = [
    {
      content: "Manajeko has completely transformed our project delivery. We've seen a 40% increase in team focus and clarity since switching our entire stack.",
      author: "Sarah Jenkins",
      role: "Operations Lead",
      avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      content: "The interface is so clean it actually encourages you to get work done. No more tool fatigue, just pure task completion and momentum.",
      author: "Marcus Thorne",
      role: "Product Manager",
      avatar: "https://i.pravatar.cc/150?u=marcus"
    },
    {
      content: "As a lead strategist, having a bird's eye view without the noise is invaluable. Manajeko is the first tool that prioritizes our collective sanity.",
      author: "Elena Rossi",
      role: "Lead Strategist",
      avatar: "https://i.pravatar.cc/150?u=elena"
    }
  ];
}
