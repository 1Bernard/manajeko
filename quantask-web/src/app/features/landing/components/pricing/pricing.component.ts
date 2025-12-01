import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Check } from 'lucide-angular';
import { RevealOnScrollComponent } from '../../../../shared/components/reveal-on-scroll/reveal-on-scroll.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, RevealOnScrollComponent],
  template: `
    <section id="pricing" class="py-24 bg-[#0F1014] text-white relative overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-4xl font-extrabold mb-4">Flexible Plans for Every Team</h2>
          <p class="text-gray-400 text-lg">Choose the plan that fits your needs. No hidden fees. Cancel anytime.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Starter Plan -->
          <app-reveal-on-scroll [delay]="0">
            <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <h3 class="text-xl font-medium text-gray-300 mb-2">Starter</h3>
              <div class="flex items-baseline gap-1 mb-6">
                <span class="text-4xl font-bold">$0</span>
                <span class="text-gray-400">/month</span>
              </div>
              <p class="text-sm text-gray-400 mb-8 h-10">Perfect for individuals and side projects.</p>
              <a routerLink="/auth/register" class="block w-full py-3 rounded-xl border border-white/20 font-semibold hover:bg-white hover:text-black transition-all mb-8 text-center">Get Started</a>
              <ul class="space-y-4 text-sm text-gray-300">
                <li class="flex gap-3">
                  <lucide-icon [img]="Check" [size]="16" class="text-indigo-400"></lucide-icon>
                  Up to 3 Projects
                </li>
                <li class="flex gap-3">
                  <lucide-icon [img]="Check" [size]="16" class="text-indigo-400"></lucide-icon>
                  Community Support
                </li>
                <li class="flex gap-3">
                  <lucide-icon [img]="Check" [size]="16" class="text-indigo-400"></lucide-icon>
                  1GB Storage
                </li>
              </ul>
            </div>
          </app-reveal-on-scroll>

          <!-- Pro Plan -->
          <app-reveal-on-scroll [delay]="150">
            <div class="bg-gradient-to-b from-indigo-600 to-violet-700 rounded-3xl p-8 transform md:-translate-y-4 shadow-2xl border border-indigo-400 relative">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">Most Popular</div>
              <h3 class="text-xl font-medium text-indigo-100 mb-2">Professional</h3>
              <div class="flex items-baseline gap-1 mb-6">
                <span class="text-4xl font-bold">$29</span>
                <span class="text-indigo-200">/month</span>
              </div>
              <p class="text-sm text-indigo-100 mb-8 h-10">For growing teams that need more power.</p>
              <a routerLink="/auth/register" class="block w-full py-3 rounded-xl bg-white text-indigo-600 font-bold hover:shadow-lg transition-all mb-8 text-center">Start Free Trial</a>
              <ul class="space-y-4 text-sm text-white">
                <li class="flex gap-3">
                  <div class="bg-indigo-500 rounded-full p-0.5">
                    <lucide-icon [img]="Check" [size]="12"></lucide-icon>
                  </div>
                  Unlimited Projects
                </li>
                <li class="flex gap-3">
                  <div class="bg-indigo-500 rounded-full p-0.5">
                    <lucide-icon [img]="Check" [size]="12"></lucide-icon>
                  </div>
                  Priority Support
                </li>
                <li class="flex gap-3">
                  <div class="bg-indigo-500 rounded-full p-0.5">
                    <lucide-icon [img]="Check" [size]="12"></lucide-icon>
                  </div>
                  Analytics Dashboard
                </li>
                <li class="flex gap-3">
                  <div class="bg-indigo-500 rounded-full p-0.5">
                    <lucide-icon [img]="Check" [size]="12"></lucide-icon>
                  </div>
                  50GB Storage
                </li>
              </ul>
            </div>
          </app-reveal-on-scroll>

          <!-- Enterprise Plan -->
          <app-reveal-on-scroll [delay]="300">
            <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <h3 class="text-xl font-medium text-gray-300 mb-2">Enterprise</h3>
              <div class="flex items-baseline gap-1 mb-6">
                <span class="text-4xl font-bold">$99</span>
                <span class="text-gray-400">/month</span>
              </div>
              <p class="text-sm text-gray-400 mb-8 h-10">Advanced security and control for large orgs.</p>
              <button class="w-full py-3 rounded-xl border border-white/20 font-semibold hover:bg-white hover:text-black transition-all mb-8">Contact Sales</button>
              <ul class="space-y-4 text-sm text-gray-300">
                <li class="flex gap-3">
                  <lucide-icon [img]="Check" [size]="16" class="text-indigo-400"></lucide-icon>
                  SSO & SAML
                </li>
                <li class="flex gap-3">
                  <lucide-icon [img]="Check" [size]="16" class="text-indigo-400"></lucide-icon>
                  Dedicated Success Manager
                </li>
                <li class="flex gap-3">
                  <lucide-icon [img]="Check" [size]="16" class="text-indigo-400"></lucide-icon>
                  Unlimited Storage
                </li>
                <li class="flex gap-3">
                  <lucide-icon [img]="Check" [size]="16" class="text-indigo-400"></lucide-icon>
                  Audit Logs
                </li>
              </ul>
            </div>
          </app-reveal-on-scroll>
        </div>
      </div>
    </section>
  `
})
export class PricingComponent {
  readonly Check = Check;
}
