import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { PricingComponent } from '../../components/pricing/pricing.component';
import { CtaComponent } from '../../components/cta/cta.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    PricingComponent,
    CtaComponent,
    FooterComponent
  ],
  template: `
    <div class="font-sans text-slate-800 bg-[#F8F9FB] overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <app-navbar></app-navbar>
      <main>
        <app-hero></app-hero>
        
        <!-- Partners/Trusted By -->
        <section class="py-10 border-y border-gray-100 bg-white">
          <div class="max-w-7xl mx-auto px-6 text-center">
            <p class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted by industry leaders</p>
            <div class="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span *ngFor="let logo of partners" class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div class="w-6 h-6 bg-slate-800 rounded-full"></div> {{ logo }}
              </span>
            </div>
          </div>
        </section>

        <app-features></app-features>
        
        <!-- How it Works / Steps -->
        <section class="py-24 bg-white">
          <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
              <h2 class="text-3xl font-bold text-slate-900">Automate in 3 Simple Steps</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <!-- Connector Line -->
              <div class="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-100 to-transparent"></div>

              <div *ngFor="let step of steps; let i = index" class="relative z-10 text-center bg-white p-4">
                <div class="w-24 h-24 mx-auto bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center text-2xl font-black text-indigo-600 mb-6 shadow-sm">
                  {{ step.step }}
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-2">{{ step.title }}</h3>
                <p class="text-slate-500">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </section>

        <app-pricing></app-pricing>
        <app-cta></app-cta>
      </main>
      <app-footer></app-footer>
    </div>
  `
})
export class LandingComponent {
  partners = ['Acme Corp', 'GlobalBank', 'TechStart', 'Nebula', 'FoxRun'];

  steps = [
    { step: '01', title: 'Connect Data', desc: 'Sync your existing tools in one click.' },
    { step: '02', title: 'Set Rules', desc: 'Define triggers and actions visually.' },
    { step: '03', title: 'See Results', desc: 'Watch your efficiency skyrocket instantly.' }
  ];
}
