import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutGrid, Smartphone } from 'lucide-angular';

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <span [class]="'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ' + getStyles()">
      <lucide-icon *ngIf="getIcon()" [img]="getIcon()!" [size]="12" class="mr-1.5"></lucide-icon>
      {{ text || type }}
    </span>
  `
})
export class BadgeComponent {
    @Input() type!: string;
    @Input() text?: string;

    readonly LayoutGrid = LayoutGrid;
    readonly Smartphone = Smartphone;

    getStyles(): string {
        const styles: { [key: string]: string } = {
            'Dashboard': 'bg-purple-50 text-purple-600 border border-purple-100',
            'Mobile App': 'bg-orange-50 text-orange-600 border border-orange-100',
            'High': 'bg-red-50 text-red-600 border border-red-100',
            'Medium': 'bg-amber-50 text-amber-600 border border-amber-100',
            'Low': 'bg-blue-50 text-blue-600 border border-blue-100',
            'Work': 'bg-gray-100 text-gray-600 border border-gray-200',
        };

        return styles[this.text || this.type] || 'bg-gray-100 text-gray-600';
    }

    getIcon() {
        const icons: { [key: string]: any } = {
            'Dashboard': this.LayoutGrid,
            'Mobile App': this.Smartphone,
        };

        return icons[this.type];
    }
}
