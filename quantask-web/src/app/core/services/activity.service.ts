import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Activity {
    id: number;
    task_id: number;
    user_id: number;
    action_type: string;
    details: any;
    created_at: string;
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        avatar_url?: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Get activities for a task
    getActivities(taskId: number): Observable<Activity[]> {
        return this.http.get<any>(`${this.apiUrl}/tasks/${taskId}/activities`).pipe(
            map(response => {
                const data = response.data || response;
                if (Array.isArray(data)) {
                    return data.map((item: any) => ({
                        id: parseInt(item.id),
                        ...item.attributes
                    }));
                }
                return data || [];
            })
        );
    }
}
