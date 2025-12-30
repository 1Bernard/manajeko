import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UpcomingTask {
    id: number;
    title: string;
    due_date: string; // ISO string
    priority: string;
    status: string;
    assignees: { 
        id: number; 
        avatar_url?: string;
        initials?: string;
        full_name?: string;
        first_name?: string;
    }[];
}

export interface TaskStats {
    todo: number;
    inProgress: number;
    inReview: number;
    completed: number;
    total: number;
    highPriority: number;
    upcomingDeadlines: UpcomingTask[];
    recentActivities: Activity[];
}

export interface Activity {
    id: number;
    user: {
        id: number;
        name: string;
        avatar: string | null;
    };
    action: string;
    target: string;
    time: string;
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private apiUrl = `${environment.apiUrl}/analytics`;

    constructor(private http: HttpClient) { }

    getTaskStats(): Observable<TaskStats> {
        return this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
            map(response => {
                const data = response.data;
                const stats = data.tasks_by_status || {};
                
                // Map backend status keys to frontend props
                return {
                    todo: stats['todo'] || 0,
                    inProgress: stats['in_progress'] || 0, // Ensure logic matches backend keys (snake_case)
                    inReview: stats['in_review'] || 0,
                    completed: stats['done'] || 0,
                    total: data.total_tasks || 0,
                    highPriority: (data.tasks_by_priority || {})['high'] || 0,
                    upcomingDeadlines: data.upcoming_deadlines || [],
                    recentActivities: data.recent_activities || []
                };
            })
        );
    }

    getRecentActivities(): Observable<Activity[]> {
       // Deprecated: Activities are now part of the main dashboard stats payload for performance
       return of([]);
    }
}
