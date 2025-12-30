import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import * as ActionCable from '@rails/actioncable';

export interface Notification {
  id: number;
  content: string;
  type: string; // 'task_assigned', 'comment_mentioned', etc.
  read: boolean;
  created_at: string;
  notifiable_type: string;
  notifiable_id: number;
}

export interface NotificationResponse {
  data: Notification[];
  meta: {
    total_pages: number;
    current_page: number;
    unread_count: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private cable: any | null = null;
  private subscription: any | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Re-connect when user logs in/changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.fetchNotifications().subscribe();
        this.subscribeToNotifications();
      } else {
        this.disconnect();
      }
    });
  }

  fetchNotifications(page: number = 1): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${environment.apiUrl}/notifications?page=${page}`).pipe(
      tap(response => {
        if (page === 1) {
           this.notificationsSubject.next(response.data);
        } else {
           const current = this.notificationsSubject.value;
           this.notificationsSubject.next([...current, ...response.data]);
        }
        this.unreadCountSubject.next(response.meta.unread_count);
      })
    );
  }

  markAsRead(id: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/notifications/${id}/mark_read`, {}).pipe(
      tap(() => {
        const current = this.notificationsSubject.value;
        const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
        this.notificationsSubject.next(updated);
        
        // Decrement unread count locally
        const currentCount = this.unreadCountSubject.value;
        this.unreadCountSubject.next(Math.max(0, currentCount - 1));
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/notifications/mark_all_read`, {}).pipe(
      tap(() => {
        const current = this.notificationsSubject.value;
        const updated = current.map(n => ({ ...n, read: true }));
        this.notificationsSubject.next(updated);
        this.unreadCountSubject.next(0);
      })
    );
  }

  // --- Realtime (ActionCable) ---

  private subscribeToNotifications() {
    if (this.cable) return; // Already connected

    const token = this.authService.getToken();
    if (!token) return;

    // Connect to /cable endpoint with JWT token
    // Note: Development usually ws://localhost:3000/cable, Production wss://...
    // environment.apiUrl is http://localhost:3000/api/v1 usually.
    // We need base URL.
    const wsUrl = environment.apiUrl.replace('/api/v1', '').replace('http', 'ws') + '/cable';

    this.cable = ActionCable.createConsumer(`${wsUrl}?token=${token}`);

    this.subscription = this.cable.subscriptions.create('NotificationsChannel', {
      received: (data: any) => {
        console.log('Notification received:', data);
        if (data.type === 'new_notification') {
           this.handleNewNotification(data.notification);
        }
      },
      connected: () => console.log('Connected to NotificationsChannel'),
      disconnected: () => console.log('Disconnected from NotificationsChannel')
    });
  }

  private handleNewNotification(notification: Notification) {
    const current = this.notificationsSubject.value;
    // Prepend new notification
    this.notificationsSubject.next([notification, ...current]);
    // Increment unread count
    this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
    
    // Optional: Show toast
  }

  private disconnect() {
    if (this.cable) {
      this.cable.disconnect();
      this.cable = null;
      this.subscription = null;
    }
  }
}
