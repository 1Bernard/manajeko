import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { CtaComponent } from '../../components/cta/cta.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ParticlesBackgroundComponent } from '../../../../shared/components/particles-background/particles-background.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    TestimonialsComponent,
    CtaComponent,
    FooterComponent,
    ParticlesBackgroundComponent
  ],
  template: `
    <div class="relative font-sans selection:bg-indigo-100 selection:text-indigo-900 bg-white overflow-x-hidden min-h-screen">
      <!-- Background Particles -->
      <app-particles-background></app-particles-background>

      <app-navbar></app-navbar>
      
      <main class="relative z-10">
        <app-hero></app-hero>
        
        <app-features></app-features>
        
        <app-testimonials></app-testimonials>

        <app-cta></app-cta>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class LandingComponent {}
