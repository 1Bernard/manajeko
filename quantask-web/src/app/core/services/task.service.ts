import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/components/avatar/avatar.component';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    task_type: string;
    due_date: string;
    start_date?: string;
    position: number;
    project_id: number;
    creator_id: number;
    assignees: User[];
    tags?: {
        id: number;
        name: string;
        color: string;
    }[];
    subtasks: any[];
    comments: any[];
    activities?: any[];
    attachments?: any[];
    created_at: string;
    updated_at: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string;
    start_date?: string;
    assignee_ids?: number[];
    tag_ids?: number[];
    attachments?: File[];
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    task_type?: string;
    due_date?: string;
    start_date?: string;
    assignee_ids?: number[];
    tag_ids?: number[];
}

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Get all tasks (global)
    getAllTasks(filters: any = {}): Observable<Task[]> {
        return this.http.get<any>(`${this.apiUrl}/tasks`, { params: filters }).pipe(
            map(response => {
                // Map standardize JSON:API or flat response
                if (response.data && Array.isArray(response.data)) {
                    return response.data.map((item: any) => ({
                        id: parseInt(item.id),
                        ...item.attributes,
                        assignees: (item.attributes.assignees || []).map((a: any) => ({
                            ...a,
                            avatar: a.avatar_url
                        }))
                    }));
                }
                 return response;
            })
        );
    }

    // Get all tasks for a project
    getTasks(projectId: number): Observable<Task[]> {
        return this.http.get<any>(`${this.apiUrl}/projects/${projectId}/tasks`).pipe(
            map(response => {
                // Handle standard JSON:API format {data: [...]} (preferred)
                if (response.data && Array.isArray(response.data)) {
                    return response.data.map((item: any) => ({
                        id: parseInt(item.id),
                        ...item.attributes,
                        assignees: (item.attributes.assignees || []).map((a: any) => ({
                            ...a,
                            avatar: a.avatar_url // Map backend avatar_url to frontend avatar
                        }))
                    }));
                }

                // Fallback: Handle non-standard array format [{id, attributes}, ...]
                if (Array.isArray(response) && response.length > 0 && response[0].attributes) {
                    return response.map((item: any) => ({
                        id: parseInt(item.id),
                        ...item.attributes,
                        assignees: (item.attributes.assignees || []).map((a: any) => ({
                            ...a,
                            avatar: a.avatar_url
                        }))
                    }));
                }

                // Last resort: return as-is (for already flat responses)
                return response;
            })
        );
    }

    // Helper to unwrap JSON:API response
    private mapResponseToTask(response: any): Task {
        if (response.data) {
            // Handle { data: { id, attributes: { ... } } }
            const attributes = response.data.attributes || response.data;
            return {
                id: parseInt(response.data.id),
                ...attributes,
                // Ensure nested associations are also mapped if present
                assignees: (attributes.assignees || []).map((a: any) => ({
                    ...a,
                    avatar: a.avatar_url
                })),
                tags: attributes.tags || [],
                attachments: (attributes.attachments || []).map((a: any) => ({
                    ...a,
                    // Ensure attachment properties are accessible
                    id: parseInt(a.id)
                }))
            } as Task;
        }
        // Fallback or returned as flat object
        return response as Task;
    }

    // Get single task with details
    getTask(id: number): Observable<Task> {
        return this.http.get<any>(`${this.apiUrl}/tasks/${id}`).pipe(
            map(response => this.mapResponseToTask(response))
        );
    }

    // Create new task
    createTask(projectId: number, task: CreateTaskDto): Observable<Task> {
        let request: Observable<any>;
        if (task.attachments && task.attachments.length > 0) {
            const formData = new FormData();
            formData.append('task[title]', task.title);
            if (task.description) formData.append('task[description]', task.description);
            if (task.status) formData.append('task[status]', task.status);
            if (task.priority) formData.append('task[priority]', task.priority);
            if (task.due_date) formData.append('task[due_date]', task.due_date);
            if (task.start_date) formData.append('task[start_date]', task.start_date);

            if (task.assignee_ids) {
                task.assignee_ids.forEach(id => formData.append('task[assignee_ids][]', id.toString()));
            }

            if (task.tag_ids) {
                task.tag_ids.forEach(id => formData.append('task[tag_ids][]', id.toString()));
            }

            task.attachments.forEach(file => {
                formData.append('task[attachments][]', file);
            });

            request = this.http.post<any>(`${this.apiUrl}/projects/${projectId}/tasks`, formData);
        } else {
            request = this.http.post<any>(`${this.apiUrl}/projects/${projectId}/tasks`, { task });
        }

        return request.pipe(map(response => this.mapResponseToTask(response)));
    }

    // Update task
    updateTask(id: number, task: UpdateTaskDto): Observable<Task> {
        return this.http.patch<any>(`${this.apiUrl}/tasks/${id}`, { task }).pipe(
            map(response => this.mapResponseToTask(response))
        );
    }

    // Delete task
    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
    }

    // Move task (change status/position)
    moveTask(id: number, status: string, position: number): Observable<Task> {
        return this.http.patch<Task>(`${this.apiUrl}/tasks/${id}/move`, { status, position });
    }

    uploadAttachment(taskId: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(`${this.apiUrl}/tasks/${taskId}/attachments`, formData).pipe(
            map(response => {
                if (response.data) {
                    return {
                        id: parseInt(response.data.id),
                        ...response.data.attributes
                    };
                }
                return response;
            })
        );
    }

    // Delete attachment
    deleteAttachment(attachmentId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/attachments/${attachmentId}`);
    }

    // Get tags for a project
    getTags(projectId: number): Observable<any[]> {
        return this.http.get<{ data: any[] }>(`${this.apiUrl}/projects/${projectId}/tags`).pipe(
            map(response => {
                if (response.data && Array.isArray(response.data)) {
                    return response.data.map((item: any) => ({
                        id: parseInt(item.id),
                        ...item.attributes
                    }));
                }
                return response.data || [];
            })
        );
    }

    // Create a new tag
    createTag(projectId: number, tagData: { name: string; color: string }): Observable<any> {
        return this.http.post<{ data: any }>(`${this.apiUrl}/projects/${projectId}/tags`, { tag: tagData }).pipe(
            map(response => response.data)
        );
    }

    // Update a tag
    updateTag(tagId: number, tagData: { name?: string; color?: string }): Observable<any> {
        return this.http.put<{ data: any }>(`${this.apiUrl}/tags/${tagId}`, { tag: tagData }).pipe(
            map(response => response.data)
        );
    }

    // Delete a tag
    deleteTag(tagId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/tags/${tagId}`);
    }
}
