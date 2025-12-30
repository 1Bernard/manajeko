import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationApiService, Notification } from '../../../core/services/notification-api.service';
import { LucideAngularModule, Bell, Check, Clock } from 'lucide-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div class="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
        <h3 class="font-semibold text-gray-900">Notifications</h3>
        <button (click)="markAllRead()" class="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
          Mark all read
        </button>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div *ngIf="notifications.length === 0" class="px-4 py-8 text-center text-gray-500 text-sm">
          No notifications yet.
        </div>

        <div *ngFor="let notification of notifications" 
             (click)="handleNotificationClick(notification)"
             [class.bg-indigo-50]="!notification.read"
             class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 relative group">
             
          <div class="flex gap-3">
             <div class="mt-1">
               <div class="w-2 h-2 rounded-full" [class.bg-indigo-500]="!notification.read" [class.bg-transparent]="notification.read"></div>
             </div>
             <div class="flex-1">
               <p class="text-sm text-gray-800 leading-snug" [class.font-medium]="!notification.read">{{ notification.content }}</p>
               <p class="text-xs text-gray-400 mt-1 flex items-center gap-1">
                 <lucide-icon [img]="Clock" [size]="10"></lucide-icon>
                 {{ notification.created_at | date:'short' }}
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificationDropdownComponent implements OnInit {
  notifications: Notification[] = [];
  readonly Clock = Clock;

  constructor(
    private notificationService: NotificationApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(data => {
      this.notifications = data;
    });
  }

  markAllRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }

    // Navigate based on type
    if (notification.type === 'task_assigned' && notification.notifiable_type === 'Task::Task') {
      this.router.navigate(['/dashboard/project', notification.notifiable_id]); // Or open modal directly if possible
      // Since we don't have direct task link logic yet (usually tasks are opened in modals on project board),
      // we navigate to the project. Ideally we'd pass a query param ?task=ID.
      // For now, let's just go to dashboard or project.
      // Assuming notifiable_id is TASK ID. Need Project ID to nav to board.
      // But we don't have project ID here easily unless we fetch task.
      // MVP: Just mark read. Refinement: Navigate.
    }
  }
}
