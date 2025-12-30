import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Workspace {
    id: string;
    type: string;
    attributes: {
        name: string;
        slug: string;
        description?: string;
        logoUrl?: string;
        role?: string;
        ownerName?: string;
        createdAt: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class WorkspaceService {
    private workspacesSubject = new BehaviorSubject<Workspace[]>([]);
    public workspaces$ = this.workspacesSubject.asObservable();

    private currentWorkspaceSubject = new BehaviorSubject<Workspace | null>(null);
    public currentWorkspace$ = this.currentWorkspaceSubject.asObservable();

    constructor(private http: HttpClient) {
        setTimeout(() => this.loadWorkspaces(), 0);
    }

    loadWorkspaces(): void {
        this.http.get<{ data: Workspace[] }>(`${environment.apiUrl}/workspaces`)
            .pipe(
                map(response => response.data),
                tap(workspaces => {
                    this.workspacesSubject.next(workspaces);

                    if (workspaces.length > 0) {
                        const storedId = localStorage.getItem('currentWorkspaceId');
                        const storedWorkspace = workspaces.find(w => w.id === storedId);

                        if (storedWorkspace) {
                            this.setCurrentWorkspace(storedWorkspace);
                        } else {
                            // If stored ID is invalid or missing, default to first workspace
                            this.setCurrentWorkspace(workspaces[0]);
                        }
                    }
                })
            )
            .subscribe();
    }

    createWorkspace(data: { name: string; description?: string }): Observable<Workspace> {
        return this.http.post<{ data: Workspace }>(`${environment.apiUrl}/workspaces`, { workspace: data })
            .pipe(
                map(response => response.data),
                tap(workspace => {
                    const currentWorkspaces = this.workspacesSubject.value;
                    this.workspacesSubject.next([...currentWorkspaces, workspace]);
                    this.setCurrentWorkspace(workspace);
                })
            );
    }

    setCurrentWorkspace(workspace: Workspace): void {
        this.currentWorkspaceSubject.next(workspace);
        localStorage.setItem('currentWorkspaceId', workspace.id);
    }

    getCurrentWorkspaceId(): string | null {
        return this.currentWorkspaceSubject.value?.id || localStorage.getItem('currentWorkspaceId');
    }

    getMembers(workspaceId: string): Observable<any[]> {
        return this.http.get<{ data: any[] }>(`${environment.apiUrl}/workspaces/${workspaceId}/members`)
            .pipe(
                map(response => response.data || [])
            );
    }

    inviteMember(workspaceId: string, email: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/workspaces/${workspaceId}/invitations`, { email });
    }
}
