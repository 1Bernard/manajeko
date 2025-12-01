import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Attachment {
    id: number;
    task_id: number;
    file_name: string;
    file_size: number;
    file_type: string;
    file_url: string;
    uploaded_by_id: number;
    created_at: string;
    uploader?: {
        id: number;
        name: string;
        avatar_url?: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AttachmentService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Upload attachment
    uploadAttachment(taskId: number, file: File): Observable<Attachment> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<Attachment>(`${this.apiUrl}/tasks/${taskId}/attachments`, formData);
    }

    // Download attachment
    downloadAttachment(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/attachments/${id}/download`, { responseType: 'blob' });
    }

    // Delete attachment
    deleteAttachment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/attachments/${id}`);
    }
}
