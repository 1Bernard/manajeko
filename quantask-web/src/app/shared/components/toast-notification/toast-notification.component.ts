import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle2, ShieldCheck } from 'lucide-angular';

@Component({
    selector: 'app-toast-notification',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div *ngIf="visible" 
         [class]="'fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top-5 z-50 ' + (type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200')">
      <lucide-icon [img]="type === 'success' ? CheckCircle2 : ShieldCheck" [size]="18"></lucide-icon>
      <span class="text-sm font-medium">{{ message }}</span>
    </div>
  `
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
    @Input() type: 'success' | 'error' = 'success';
    @Input() message: string = '';
    @Input() duration: number = 4000;

    visible = false;
    readonly CheckCircle2 = CheckCircle2;
    readonly ShieldCheck = ShieldCheck;

    private timer?: any;

    ngOnInit() {
        this.visible = true;
        this.timer = setTimeout(() => {
            this.visible = false;
        }, this.duration);
    }

    ngOnDestroy() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}
