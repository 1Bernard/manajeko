import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface User {
  id: number;
  name: string;
  initials?: string;
  color?: string;
  avatar?: string;
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
}
