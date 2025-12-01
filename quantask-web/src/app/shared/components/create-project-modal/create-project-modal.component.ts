import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, FolderPlus } from 'lucide-angular';
import { ProjectService } from '../../../core/services/project.service';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';

@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, FileUploaderComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <lucide-icon [img]="FolderPlus" [size]="20"></lucide-icon>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">Create Project</h2>
              <p class="text-xs text-gray-500">Add a new project to your workspace</p>
            </div>
          </div>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <lucide-icon [img]="X" [size]="20"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Project Name</label>
            <input 
              type="text" 
              [(ngModel)]="projectName" 
              placeholder="e.g. Website Redesign" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
              [class.border-red-300]="error"
              (keyup.enter)="createProject()"
            />
            <p *ngIf="error" class="text-xs text-red-500 font-medium">{{ error }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Description (Optional)</label>
            <textarea 
              [(ngModel)]="description" 
              rows="3"
              placeholder="What is this project about?" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium resize-none"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Banner Image (Optional)</label>
            <app-file-uploader 
              [(ngModel)]="bannerFiles"
              [accept]="'image/*'"
              [multiple]="false"
              [maxSize]="5242880"
            ></app-file-uploader>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Color</label>
            <div class="flex gap-2">
                <button *ngFor="let c of colors" 
                    (click)="selectedColor = c"
                    [class.ring-2]="selectedColor === c"
                    [class.ring-offset-2]="selectedColor === c"
                    [class]="c + ' w-8 h-8 rounded-full transition-all hover:scale-110'"
                ></button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button (click)="close.emit()" class="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button 
            (click)="createProject()" 
            [disabled]="!projectName || isLoading"
            class="px-6 py-2 text-sm font-bold text-white bg-[#1C1D22] rounded-lg hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span *ngIf="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isLoading ? 'Creating...' : 'Create Project' }}
          </button>
        </div>

      </div>
    </div>
  `
})
export class CreateProjectModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<any>();
  @Input() workspaceId: string = '1'; // Default to 1 for now

  readonly X = X;
  readonly FolderPlus = FolderPlus;

  projectName = '';
  description = '';
  bannerFiles: File[] = [];
  isLoading = false;
  error = '';

  colors = [
    'bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-500'
  ];
  selectedColor = 'bg-indigo-500';

  constructor(private projectService: ProjectService) { }

  createProject() {
    if (!this.projectName.trim()) {
      this.error = 'Project name is required';
      return;
    }

    this.isLoading = true;
    this.error = '';

    // Create project first
    this.projectService.createProject(this.workspaceId, {
      name: this.projectName,
      description: this.description,
      color: this.selectedColor
    }).subscribe({
      next: (project) => {
        // If banner image is provided, upload it
        if (this.bannerFiles && this.bannerFiles.length > 0) {
          const formData = new FormData();
          formData.append('project[banner_image]', this.bannerFiles[0]);

          this.projectService.updateProject(project.id, formData).subscribe({
            next: (updatedProject) => {
              this.isLoading = false;
              this.projectCreated.emit(updatedProject);
              this.close.emit();
            },
            error: (err) => {
              // Project created but banner upload failed
              console.error('Banner upload failed:', err);
              this.isLoading = false;
              this.projectCreated.emit(project);
              this.close.emit();
            }
          });
        } else {
          this.isLoading = false;
          this.projectCreated.emit(project);
          this.close.emit();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to create project. Please try again.';
        console.error(err);
      }
    });
  }
}
