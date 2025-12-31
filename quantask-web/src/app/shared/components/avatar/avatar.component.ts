import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface User {
  id: number;
  name: string;
  initials?: string;
  color?: string;
  avatar?: string;
  email?: string;
}

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img 
      *ngIf="user && user.avatar"
      [src]="user.avatar" 
      [alt]="user.name" 
      [class]="size + ' rounded-full object-cover ' + border"
      [title]="user.name"
    />
    <div 
      *ngIf="user && !user.avatar"
      [class]="size + ' rounded-full flex items-center justify-center text-white font-bold ' + (user.color || 'bg-gray-400') + ' ' + border"
      [style.fontSize]="getFontSize(size)"
      [title]="user.name"
    >
      {{ user.initials }}
    </div>
  `
})
export class AvatarComponent {
  @Input() user!: User;
  @Input() size: string = 'w-6 h-6';
  @Input() border: string = 'border-2 border-white';

  getFontSize(size: string): string {
    if (size.includes('w-4')) return '8px';
    if (size.includes('w-5')) return '9px';
    if (size.includes('w-6') || size.includes('w-7')) return '10px';
    if (size.includes('w-8')) return '12px';
    if (size.includes('w-10')) return '14px';
    if (size.includes('w-12')) return '16px';
    if (size.includes('w-14')) return '18px';
    return 'inherit';
  }
}

// Tailwind Safelist for Avatar Colors
// bg-blue-500 bg-green-500 bg-pink-500 bg-yellow-500 bg-purple-500 bg-indigo-500 bg-red-500 bg-teal-500
