import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WorkspaceService, Workspace } from '../../../../core/services/workspace.service';
import { CreateWorkspaceModalComponent } from '../../../workspace/components/create-workspace-modal/create-workspace-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CreateWorkspaceModalComponent],
  template: `
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
            Q
          </div>
          <span class="text-xl font-bold text-slate-900 tracking-tight">Quantask</span>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li>
                  <a routerLink="/dashboard" routerLinkActive="bg-slate-50 text-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors">
                    <svg class="h-6 w-6 shrink-0 text-slate-400 group-hover:text-indigo-600 group-[.text-indigo-600]:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a routerLink="/dashboard/projects" routerLinkActive="bg-slate-50 text-indigo-600" class="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors">
                    <svg class="h-6 w-6 shrink-0 text-slate-400 group-hover:text-indigo-600 group-[.text-indigo-600]:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                    Projects
                  </a>
                </li>
                <li>
                  <a routerLink="/dashboard/tasks" routerLinkActive="bg-slate-50 text-indigo-600" class="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors">
                    <svg class="h-6 w-6 shrink-0 text-slate-400 group-hover:text-indigo-600 group-[.text-indigo-600]:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    My Tasks
                  </a>
                </li>
                <li>
                  <a routerLink="/dashboard/calendar" routerLinkActive="bg-slate-50 text-indigo-600" class="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors">
                    <svg class="h-6 w-6 shrink-0 text-slate-400 group-hover:text-indigo-600 group-[.text-indigo-600]:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    Calendar
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div class="flex items-center justify-between">
                <div class="text-xs font-semibold leading-6 text-slate-400">Your Workspaces</div>
                <button (click)="showCreateWorkspaceModal = true" class="text-slate-400 hover:text-indigo-600">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li *ngFor="let workspace of workspaceService.workspaces$ | async">
                  <button 
                    (click)="selectWorkspace(workspace)"
                    [class.bg-slate-50]="(workspaceService.currentWorkspace$ | async)?.id === workspace.id"
                    [class.text-indigo-600]="(workspaceService.currentWorkspace$ | async)?.id === workspace.id"
                    class="w-full text-left text-slate-700 hover:text-indigo-600 hover:bg-slate-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                  >
                    <span 
                      [class.border-indigo-600]="(workspaceService.currentWorkspace$ | async)?.id === workspace.id"
                      [class.text-indigo-600]="(workspaceService.currentWorkspace$ | async)?.id === workspace.id"
                      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[0.625rem] font-medium text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600"
                    >
                      {{ workspace.attributes.name.charAt(0).toUpperCase() }}
                    </span>
                    <span class="truncate">{{ workspace.attributes.name }}</span>
                  </button>
                </li>
              </ul>
            </li>
            <li class="mt-auto">
              <a href="#" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                <svg class="h-6 w-6 shrink-0 text-slate-400 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <app-create-workspace-modal
        *ngIf="showCreateWorkspaceModal"
        (close)="showCreateWorkspaceModal = false"
        (create)="onCreateWorkspace($event)"
      ></app-create-workspace-modal>
    </div>
  `
})
export class SidebarComponent {
  showCreateWorkspaceModal = false;

  constructor(public workspaceService: WorkspaceService) { }

  selectWorkspace(workspace: Workspace) {
    this.workspaceService.setCurrentWorkspace(workspace);
  }

  onCreateWorkspace(data: { name: string; description: string }) {
    this.workspaceService.createWorkspace(data).subscribe({
      next: () => {
        this.showCreateWorkspaceModal = false;
      },
      error: (error) => {
        console.error('Failed to create workspace', error);
      }
    });
  }
}
