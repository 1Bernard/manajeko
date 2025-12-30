import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, of, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkspaceService } from './workspace.service';

export interface Project {
    id: string;
    type: string;
    attributes: {
        name: string;
        description?: string;
        status: string;
        visibility: string;
        color?: string;
        icon?: string;
        banner_image_url?: string;
        owner_name?: string;
        workspace_id?: number;
        created_at: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private projectsSubject = new BehaviorSubject<Project[]>([]);
    public projects$ = this.projectsSubject.asObservable();

    constructor(
        private http: HttpClient,
        private workspaceService: WorkspaceService
    ) {
        // Automatically load projects when current workspace changes
        this.workspaceService.currentWorkspace$.pipe(
            switchMap(workspace => {
                if (workspace) {
                    return this.loadProjects(workspace.id);
                } else {
                    this.projectsSubject.next([]);
                    return of([]);
                }
            })
        ).subscribe();
    }

    loadProjects(workspaceId: string): Observable<Project[]> {
        return this.http.get<{ data: Project[] }>(`${environment.apiUrl}/workspaces/${workspaceId}/projects`)
            .pipe(
                map(response => response.data),
                tap(projects => this.projectsSubject.next(projects))
            );
    }

    createProject(workspaceId: string, data: { name: string; description?: string; visibility?: string; color?: string }): Observable<Project> {
        return this.http.post<{ data: Project }>(`${environment.apiUrl}/workspaces/${workspaceId}/projects`, { project: data })
            .pipe(
                map(response => response.data),
                tap(project => {
                    const currentProjects = this.projectsSubject.value;
                    this.projectsSubject.next([...currentProjects, project]);
                })
            );
    }

    updateProject(projectId: string, data: FormData | any): Observable<Project> {
        return this.http.patch<{ data: Project }>(`${environment.apiUrl}/projects/${projectId}`, data)
            .pipe(
                map(response => response.data),
                tap(updatedProject => {
                    const currentProjects = this.projectsSubject.value;
                    const index = currentProjects.findIndex(p => p.id === projectId);
                    if (index !== -1) {
                        const updatedProjects = [...currentProjects];
                        updatedProjects[index] = updatedProject;
                        this.projectsSubject.next(updatedProjects);
                    }
                })
            );
    }

    getProject(projectId: string): Observable<Project> {
        // First try to find in current state
        const project = this.projectsSubject.value.find(p => p.id === projectId);
        if (project) {
            return of(project);
        }

        // If not found, fetch from API (assuming we have an endpoint, or just return undefined/null handling)
        // For now, let's rely on the projects list being loaded. 
        // Ideally we would have a specific endpoint /api/v1/projects/:id
        // But since our API structure is nested under workspaces, we might need to rely on the list or add a specific endpoint.
        // Let's assume the list is loaded for now as we load projects on app init/workspace switch.
        return this.projects$.pipe(
            map(projects => projects.find(p => p.id === projectId)!)
        );
    }
}
