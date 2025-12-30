import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Calendar, Tag, AlignLeft, Paperclip, Users, Folder } from 'lucide-angular';
import { TaskService } from '../../../core/services/task.service';
import { WorkspaceService } from '../../../core/services/workspace.service';
import { ProjectService } from '../../../core/services/project.service';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';

interface NewTaskData {
  title: string;
  description: string;
  priority: string;
  status: string;
  startDate: string;
  dueDate: string;
  attachments: File[];
  tagIds: number[];
  assigneeIds: number[];
}

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, FileUploaderComponent],
  template: `
    <div class="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-[2px] transition-all" (click)="onBackdropClick($event)">
      <div class="w-full max-w-[600px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-100">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900">Create New Task</h2>
          <button (click)="close.emit()" class="hover:bg-gray-100 p-2 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
            <lucide-icon [img]="X" [size]="20"></lucide-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-8 py-8">
          <form class="space-y-6">
            
            <!-- Project Selector (Optional) -->
            <div *ngIf="enableProjectSelection">
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <lucide-icon [img]="Folder" [size]="16"></lucide-icon> Project *
              </label>
              <div class="relative">
                <select 
                  [ngModel]="projectId"
                  (ngModelChange)="onProjectChange($event)"
                  name="project"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none bg-white"
                  [disabled]="isLoadingProjects"
                >
                  <option [ngValue]="null" disabled>Select a project...</option>
                  <option *ngFor="let p of projects" [ngValue]="p.id">{{ p.attributes.name }}</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <!-- Task Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Task Name *</label>
              <input 
                type="text" 
                [(ngModel)]="taskData.title"
                name="title"
                placeholder="Enter task name"
                required
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <lucide-icon [img]="AlignLeft" [size]="16"></lucide-icon> Description
              </label>
              <textarea 
                [(ngModel)]="taskData.description"
                name="description"
                rows="4"
                placeholder="Add a description..."
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
              ></textarea>
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <div class="flex gap-3">
                <button 
                  type="button"
                  *ngFor="let p of ['Low', 'Medium', 'High']"
                  (click)="taskData.priority = p"
                  [class.bg-indigo-600]="taskData.priority === p"
                  [class.text-white]="taskData.priority === p"
                  [class.bg-gray-100]="taskData.priority !== p"
                  [class.text-gray-700]="taskData.priority !== p"
                  class="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all hover:shadow-md"
                >
                  {{ p }}
                </button>
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div class="relative">
                <select 
                  [(ngModel)]="taskData.status"
                  name="status"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none bg-white"
                >
                  <option value="todo">To-do</option>
                  <option value="in_progress">On Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="done">Completed</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <!-- Dates Group -->
            <div class="grid grid-cols-2 gap-4">
               <!-- Start Date -->
               <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <lucide-icon [img]="Calendar" [size]="16"></lucide-icon> Start Date
                </label>
                <input 
                  type="date" 
                  [(ngModel)]="taskData.startDate"
                  name="startDate"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans text-sm"
                />
              </div>

              <!-- Due Date -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <lucide-icon [img]="Calendar" [size]="16"></lucide-icon> Due Date
                </label>
                <input 
                  type="date" 
                  [(ngModel)]="taskData.dueDate"
                  name="dueDate"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans text-sm"
                />
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <lucide-icon [img]="Tag" [size]="16"></lucide-icon> Tags
              </label>
              <div *ngIf="availableTags.length > 0" class="flex flex-wrap gap-2">
                <button
                  *ngFor="let tag of availableTags"
                  type="button"
                  (click)="toggleTag(tag.id)"
                  [class.ring-2]="taskData.tagIds.includes(tag.id)"
                  [class.ring-offset-2]="taskData.tagIds.includes(tag.id)"
                  class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                  [style.background-color]="taskData.tagIds.includes(tag.id) ? tag.color : tag.color + '20'"
                  [style.color]="taskData.tagIds.includes(tag.id) ? '#fff' : tag.color"
                >
                  {{ tag.name }}
                </button>
              </div>
              <p *ngIf="availableTags.length === 0" class="text-sm text-gray-400 italic">No tags available. Create tags in your project first.</p>
            </div>

            <!-- Assignees -->
            <div *ngIf="availableMembers.length > 0">
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <lucide-icon [img]="Users" [size]="16"></lucide-icon> Assignees
              </label>
              <div class="space-y-2">
                <button
                  *ngFor="let member of availableMembers"
                  type="button"
                  (click)="toggleAssignee(member.id)"
                  [class.bg-indigo-50]="taskData.assigneeIds.includes(member.id)"
                  [class.border-indigo-500]="taskData.assigneeIds.includes(member.id)"
                  [class.bg-gray-50]="!taskData.assigneeIds.includes(member.id)"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl flex items-center gap-3 transition-all hover:shadow-md"
                >
                  <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                    {{ (member.name || member.email || '?').charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1 text-left">
                    <div class="text-sm font-medium text-gray-900">{{ member.name || member.email }}</div>
                    <div class="text-xs text-gray-500">{{ member.email }}</div>
                  </div>
                  <div *ngIf="taskData.assigneeIds.includes(member.id)" class="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Attachments -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <lucide-icon [img]="Paperclip" [size]="16"></lucide-icon> Attachments
              </label>
              
              <app-file-uploader
                [(ngModel)]="taskData.attachments"
                [accept]="'*'"
                [multiple]="true"
                [maxSize]="10485760"
                name="attachments"
              ></app-file-uploader>
            </div>

          </form>
        </div>

        <!-- Footer -->
        <div class="px-8 py-5 border-t border-gray-100 flex gap-3">
          <button 
            (click)="close.emit()"
            type="button"
            class="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button 
            (click)="handleSubmit()"
            type="button"
            [disabled]="!taskData.title.trim()"
            [class.opacity-50]="!taskData.title.trim()"
            [class.cursor-not-allowed]="!taskData.title.trim()"
            class="flex-1 px-6 py-3 bg-[#1C1D22] text-white rounded-xl font-semibold hover:bg-indigo-600 transition-all shadow-lg"
          >
            Create Task
          </button>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class CreateTaskModalComponent implements OnInit {
  @Input() projectId!: number;
  @Input() workspaceId!: string;
  @Input() initialDate: string | null = null;
  @Input() enableProjectSelection = false;
  @Output() close = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<any>();

  readonly X = X;
  readonly Calendar = Calendar;
  readonly Tag = Tag;
  readonly AlignLeft = AlignLeft;
  readonly Paperclip = Paperclip;
  readonly Users = Users;
  readonly Folder = Folder;

  taskData: NewTaskData = {
    title: '',
    description: '',
    priority: 'Medium',
    status: 'todo',
    startDate: '',
    dueDate: '',
    attachments: [],
    tagIds: [],
    assigneeIds: []
  };

  availableTags: any[] = [];
  availableMembers: any[] = [];
  projects: any[] = [];
  isLoadingTags = false;
  isLoadingMembers = false;
  isLoadingProjects = false;

  constructor(
    private taskService: TaskService,
    private workspaceService: WorkspaceService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    if (this.projectId) {
      this.loadTags();
    }
    if (this.workspaceId) {
      this.loadMembers();
    }
    
    if (this.initialDate) {
        this.taskData.startDate = this.initialDate;
        this.taskData.dueDate = this.initialDate;
    }

    if (this.enableProjectSelection) {
      this.loadProjects();
    }
  }

  loadProjects() {
    this.isLoadingProjects = true;
    this.projectService.projects$.subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoadingProjects = false;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.isLoadingProjects = false;
      }
    });
  }

  onProjectChange(newProjectId: number) {
    if (!newProjectId) return;
    
    this.projectId = newProjectId;
    // Find workspace ID for this project
    const project = this.projects.find(p => p.id == newProjectId);
    if (project) {
      this.workspaceId = project.attributes.workspace_id;
      // Reset selections
      this.taskData.tagIds = [];
      this.taskData.assigneeIds = [];
      // Reload dependencies
      this.loadTags();
      this.loadMembers();
    }
  }

  loadTags(): void {
    this.isLoadingTags = true;
    this.taskService.getTags(this.projectId).subscribe({
      next: (tags) => {
        this.availableTags = tags.map((tag: any) => ({
          id: tag.id,
          name: tag.attributes?.name || tag.name,
          color: tag.attributes?.color || tag.color
        }));
        this.isLoadingTags = false;
      },
      error: (err) => {
        console.error('Error loading tags:', err);
        this.isLoadingTags = false;
      }
    });
  }

  loadMembers(): void {
    this.isLoadingMembers = true;
    this.workspaceService.getMembers(this.workspaceId).subscribe({
      next: (members) => {
        console.log('API Members Response:', members); // Debug log
        this.availableMembers = members.map((member: any) => ({
          id: member.id,
          name: member.attributes?.full_name || member.full_name || member.email,
          email: member.attributes?.email || member.email
        }));
        console.log('Mapped Available Members:', this.availableMembers); // Debug log
        this.isLoadingMembers = false;
      },
      error: (err) => {
        console.error('Error loading members:', err);
        this.isLoadingMembers = false;
      }
    });
  }

  toggleTag(tagId: number): void {
    const index = this.taskData.tagIds.indexOf(tagId);
    if (index > -1) {
      this.taskData.tagIds.splice(index, 1);
    } else {
      this.taskData.tagIds.push(tagId);
    }
  }

  toggleAssignee(memberId: number): void {
    const index = this.taskData.assigneeIds.indexOf(memberId);
    if (index > -1) {
      this.taskData.assigneeIds.splice(index, 1);
    } else {
      this.taskData.assigneeIds.push(memberId);
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  isSubmitting = false;

  handleSubmit(): void {
    if (!this.taskData.title.trim() || this.isSubmitting || !this.projectId) return;

    this.isSubmitting = true;

    // Map the form data to the DTO expected by the service
    const taskDto: any = {
      title: this.taskData.title,
      description: this.taskData.description,
      status: this.taskData.status,
      priority: this.taskData.priority,
      start_date: this.taskData.startDate,
      due_date: this.taskData.dueDate,
      assignee_ids: this.taskData.assigneeIds,
      tag_ids: this.taskData.tagIds,
      attachments: this.taskData.attachments
    };
    console.log('Submitting task DTO:', taskDto);

    this.taskService.createTask(this.projectId, taskDto).subscribe({
      next: (createdTask) => {
        this.taskCreated.emit(createdTask); // Emit the actual created task
        this.isSubmitting = false;
        this.close.emit();
      },
      error: (err) => {
        console.error('Error creating task:', err);
        this.isSubmitting = false;
        // You might want to show an error message here
      }
    });
  }
}
