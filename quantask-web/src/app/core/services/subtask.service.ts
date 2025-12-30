import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Subtask {
    id: number;
    title: string;
    completed: boolean;
    position: number;
    blocker_note?: string;
    note?: string;
    task_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateSubtaskDto {
    title: string;
    completed?: boolean;
    position?: number;
    blocker_note?: string;
    note?: string;
}

export interface UpdateSubtaskDto {
    title?: string;
    completed?: boolean;
    position?: number;
    blocker_note?: string;
    note?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SubtaskService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Create subtask
    createSubtask(taskId: number, subtask: CreateSubtaskDto): Observable<Subtask> {
        return this.http.post<any>(`${this.apiUrl}/tasks/${taskId}/subtasks`, { subtask }).pipe(
            map(response => {
                const data = response.data || response; // Handle potential unwrapped response
                if (data && data.attributes) {
                    return {
                        id: parseInt(data.id),
                        ...data.attributes
                    };
                }
                return data;
            })
        );
    }

    // Update subtask
    updateSubtask(id: number, subtask: UpdateSubtaskDto): Observable<Subtask> {
        return this.http.patch<any>(`${this.apiUrl}/subtasks/${id}`, { subtask }).pipe(
            map(response => {
                const data = response.data || response;
                if (data && data.attributes) {
                    return {
                        id: parseInt(data.id),
                        ...data.attributes
                    };
                }
                return data;
            })
        );
    }

    // Delete subtask
    deleteSubtask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/subtasks/${id}`);
    }
}
