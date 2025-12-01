import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project } from '../../../../core/services/project.service';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { CreateProjectModalComponent } from '../../components/create-project-modal/create-project-modal.component';

@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [CommonModule, CreateProjectModalComponent],
    template: `
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-base font-semibold leading-6 text-slate-900">Projects</h1>
            <p class="mt-2 text-sm text-slate-700">A list of all projects in this workspace.</p>
          </div>
          <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button 
              type="button" 
              (click)="showCreateModal = true"
              class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add project
            </button>
          </div>
        </div>
        
        <div class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div *ngIf="(projectService.projects$ | async)?.length === 0" class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 class="mt-2 text-sm font-semibold text-slate-900">No projects</h3>
                <p class="mt-1 text-sm text-slate-500">Get started by creating a new project.</p>
              </div>

              <table *ngIf="(projectService.projects$ | async)?.length! > 0" class="min-w-full divide-y divide-slate-300">
                <thead>
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-0">Name</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Visibility</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Owner</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  <tr *ngFor="let project of projectService.projects$ | async">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-0">
                      {{ project.attributes.name }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {{ project.attributes.status }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{{ project.attributes.visibility }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{{ project.attributes.ownerName }}</td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <app-create-project-modal
        *ngIf="showCreateModal"
        (close)="showCreateModal = false"
        (create)="onCreateProject($event)"
      ></app-create-project-modal>
    </div>
  `
})
export class ProjectListComponent {
    showCreateModal = false;

    constructor(
        public projectService: ProjectService,
        private workspaceService: WorkspaceService
    ) { }

    onCreateProject(data: { name: string; description: string; visibility: string }) {
        const workspaceId = this.workspaceService.getCurrentWorkspaceId();
        if (workspaceId) {
            this.projectService.createProject(workspaceId, data).subscribe({
                next: () => {
                    this.showCreateModal = false;
                },
                error: (error) => {
                    console.error('Failed to create project', error);
                }
            });
        }
    }
}
