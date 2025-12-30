import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Bell, Check, Filter, Trash2, MailOpen, Clock, AlertCircle } from 'lucide-angular';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { Observable, combineLatest, map, BehaviorSubject } from 'rxjs';
import { Notification } from '../../../../core/services/notification-api.service';
import { Router } from '@angular/router';

type FilterType = 'all' | 'unread' | 'read';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Notification Center</h1>
          <p class="text-gray-500 mt-1">Stay updated with activity across your workspaces.</p>
        </div>
        <div class="flex gap-2">
            <button (click)="markAllAsRead()" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                <lucide-icon [img]="Check" [size]="16"></lucide-icon> Mark all as read
            </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-6 inline-flex">
          <button (click)="setFilter('all')" [class.bg-gray-100]="currentFilter === 'all'" [class.text-gray-900]="currentFilter === 'all'" class="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 transition-all">
            All
          </button>
          <button (click)="setFilter('unread')" [class.bg-indigo-50]="currentFilter === 'unread'" [class.text-indigo-600]="currentFilter === 'unread'" class="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-indigo-600 transition-all flex items-center gap-2">
            Unread
            <span *ngIf="(unreadCount$ | async) as count" class="bg-indigo-600 text-white text-[10px] px-1.5 rounded-full">{{ count }}</span>
          </button>
          <button (click)="setFilter('read')" [class.bg-gray-100]="currentFilter === 'read'" [class.text-gray-900]="currentFilter === 'read'" class="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 transition-all">
            Read
          </button>
      </div>

      <!-- Notification List -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <ng-container *ngIf="(filteredNotifications$ | async) as notifications; else loading">
            
            <div *ngIf="notifications.length === 0" class="flex flex-col items-center justify-center h-96 text-center p-8">
                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <lucide-icon [img]="Bell" [size]="32" class="text-gray-400"></lucide-icon>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">All caught up!</h3>
                <p class="text-gray-500 max-w-xs mx-auto">You have no notifications in this view.</p>
                <button *ngIf="currentFilter !== 'all'" (click)="setFilter('all')" class="mt-4 text-indigo-600 font-medium text-sm hover:underline">View all history</button>
            </div>

            <div class="divide-y divide-gray-50">
                <div *ngFor="let notification of notifications" [class.bg-indigo-50/30]="!notification.read" class="p-4 hover:bg-gray-50 transition-colors group flex gap-4 animate-in fade-in duration-300">
                    <!-- Icon based on type -->
                    <div class="mt-1 flex-shrink-0">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center border"
                            [ngClass]="getIconStyle(notification.type).bg">
                            <lucide-icon [img]="getIconStyle(notification.type).icon" [size]="18" [class]="getIconStyle(notification.type).text"></lucide-icon>
                        </div>
                    </div>
                    
                    <div class="flex-1 min-w-0" (click)="handleNotificationClick(notification)">
                        <div class="flex items-start justify-between mb-1">
                            <span class="text-xs font-medium px-2 py-0.5 rounded-full border" 
                                [ngClass]="getBadgeStyle(notification.type)">
                                {{ formatType(notification.type) }}
                            </span>
                            <span class="text-xs text-gray-400 flex items-center gap-1">
                                <lucide-icon [img]="Clock" [size]="12"></lucide-icon> {{ notification.created_at | date:'medium' }}
                            </span>
                        </div>
                        <h4 class="text-sm font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors">
                            {{ notification.content }}
                        </h4>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-2">
                           <span *ngIf="notification.notifiable_type === 'Task::Task'" class="font-medium text-gray-600">Task #{{ notification.notifiable_id }}</span>
                        </p>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col items-end justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button *ngIf="!notification.read" (click)="markAsRead($event, notification)" class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Mark as read">
                             <lucide-icon [img]="MailOpen" [size]="16"></lucide-icon>
                         </button>
                    </div>
                </div>
            </div>

        </ng-container>
        
        <ng-template #loading>
             <div class="flex flex-col items-center justify-center h-96">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        </ng-template>
      </div>
    </div>
  `
})
export class NotificationPageComponent implements OnInit {
  
  readonly Bell = Bell;
  readonly Check = Check;
  readonly Filter = Filter;
  readonly Trash2 = Trash2;
  readonly MailOpen = MailOpen;
  readonly Clock = Clock;
  readonly AlertCircle = AlertCircle;

  currentFilter: FilterType = 'all';
  filter$ = new BehaviorSubject<FilterType>('all');
  
  notifications$: Observable<Notification[]>;
  filteredNotifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;

  constructor(
      private notificationService: NotificationApiService,
      private router: Router
  ) {
      this.notifications$ = this.notificationService.notifications$;
      this.unreadCount$ = this.notificationService.unreadCount$; 

      this.filteredNotifications$ = combineLatest([
          this.notifications$,
          this.filter$
      ]).pipe(
          map(([notifications, filter]) => {
              switch (filter) {
                  case 'unread': return notifications.filter(n => !n.read);
                  case 'read': return notifications.filter(n => !!n.read);
                  default: return notifications;
              }
          })
      );
  }

  ngOnInit() {
      this.notificationService.fetchNotifications().subscribe();
  }

  setFilter(filter: FilterType) {
      this.currentFilter = filter;
      this.filter$.next(filter);
  }

  markAllAsRead() {
      this.notificationService.markAllAsRead().subscribe();
  }

  markAsRead(event: Event, notification: Notification) {
      event.stopPropagation();
      this.notificationService.markAsRead(notification.id).subscribe();
  }
  
  handleNotificationClick(notification: Notification) {
      if (!notification.read) {
          this.notificationService.markAsRead(notification.id).subscribe();
      }
      
      // Navigate based on resource
      if (notification.notifiable_type === 'Task::Task') {
          // Since we don't have project ID easily, we rely on the component or user to find it?
          // Actually, 'Task::Task' usually belongs to a Project.
          // In a real app we would query the task to get the project ID.
          // For now, let's navigate to the dashboard root or project if known?
          // Let's assume the user has access.
          console.log('Navigate to task:', notification.notifiable_id);
      }
  }

  getIconStyle(type: string) {
      switch (type) {
          case 'task_assigned': return { bg: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-600', icon: AlertCircle };
          case 'project_update': return { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600', icon: Bell }; 
          default: return { bg: 'bg-gray-50 border-gray-100', text: 'text-gray-500', icon: Bell };
      }
  }

  getBadgeStyle(type: string) {
      switch (type) {
          case 'task_assigned': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
          default: return 'bg-gray-50 text-gray-700 border-gray-100';
      }
  }
  
  formatType(type: string): string {
      return type ? type.replace(/_/g, ' ').toUpperCase() : 'NOTIFICATION';
  }
}
