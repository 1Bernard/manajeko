import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutGrid, Globe } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <footer class="bg-white border-t border-gray-100 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div class="col-span-2 lg:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <lucide-icon [img]="LayoutGrid" [size]="18"></lucide-icon>
              </div>
              <span class="text-lg font-bold text-slate-900">Craftboard.</span>
            </div>
            <p class="text-slate-500 text-sm max-w-xs mb-6">Making work visible, manageable, and actually enjoyable for teams everywhere.</p>
            <div class="flex gap-4">
              <div *ngFor="let i of [1,2,3,4]" class="w-8 h-8 bg-gray-100 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors cursor-pointer flex items-center justify-center text-gray-400">
                <lucide-icon [img]="Globe" [size]="14"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div *ngFor="let col of footerColumns">
            <h4 class="font-bold text-slate-900 mb-4">{{ col.head }}</h4>
            <ul class="space-y-2">
              <li *ngFor="let link of col.links">
                <a href="#" class="text-sm text-slate-500 hover:text-indigo-600 transition-colors">{{ link }}</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-xs text-slate-400">© 2025 Craftboard Inc. All rights reserved.</p>
          <div class="flex gap-6">
            <span class="text-xs text-slate-400 flex items-center gap-1">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div> Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly LayoutGrid = LayoutGrid;
  readonly Globe = Globe;

  footerColumns = [
    { head: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog', 'Docs'] },
    { head: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact', 'Partners'] },
    { head: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'] }
  ];
}
