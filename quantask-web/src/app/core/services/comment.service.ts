import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Comment {
    id: number;
    task_id: number;
    user_id: number;
    content: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        avatar_url?: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Get comments for a task
    getComments(taskId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.apiUrl}/tasks/${taskId}/comments`);
    }

    // Create comment
    createComment(taskId: number, content: string): Observable<Comment> {
        return this.http.post<Comment>(`${this.apiUrl}/tasks/${taskId}/comments`, { content });
    }

    // Delete comment
    deleteComment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/comments/${id}`);
    }
}
