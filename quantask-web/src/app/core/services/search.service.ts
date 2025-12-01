import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task } from './task.service';
import { Project } from './project.service';

export interface SearchResult {
    tasks: Task[];
    projects: Project[];
    users: SearchUser[];
    total: number;
}

export interface SearchUser {
    id: number;
    type: string;
    attributes: {
        name: string;
        email: string;
        avatar_url?: string;
        job_title?: string;
    };
}

export interface TaskFilters {
    q?: string;
    status?: string;
    priority?: string;
    task_type?: string;
    assignee_id?: number;
    due_date_from?: string;
    due_date_to?: string;
    sort_by?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Global search across all resources
    globalSearch(query: string, type: 'all' | 'tasks' | 'projects' | 'users' = 'all'): Observable<SearchResult> {
        let params = new HttpParams()
            .set('q', query)
            .set('type', type);

        return this.http.get<SearchResult>(`${this.apiUrl}/search`, { params });
    }

    // Search tasks with filters
    searchTasks(projectId: number, filters: TaskFilters): Observable<Task[]> {
        let params = new HttpParams();

        Object.keys(filters).forEach(key => {
            const value = filters[key as keyof TaskFilters];
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, value.toString());
            }
        });

        return this.http.get<Task[]>(`${this.apiUrl}/projects/${projectId}/tasks`, { params });
    }
}
