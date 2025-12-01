import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TaskStats {
    todo: number;
    inProgress: number;
    inReview: number;
    completed: number;
    total: number;
    highPriority: number;
}

export interface Activity {
    id: number;
    user: {
        id: number;
        name: string;
        avatar: string;
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
        // TODO: Replace with actual API call once backend is ready
        return this.http.get<TaskStats>(`${this.apiUrl}/task-stats`);
    }

    getRecentActivities(): Observable<Activity[]> {
        // TODO: Replace with actual API call once backend is ready
        return this.http.get<Activity[]>(`${this.apiUrl}/recent-activities`);
    }
}
