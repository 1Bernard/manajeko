import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Plus, Tag as TagIcon } from 'lucide-angular';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-manage-tags-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <lucide-icon [img]="TagIcon" [size]="20"></lucide-icon>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">Manage Tags</h2>
              <p class="text-xs text-gray-500">Create and organize project tags</p>
            </div>
          </div>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <lucide-icon [img]="X" [size]="20"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          <!-- Create/Edit Tag -->
          <div class="space-y-3">
            <label class="text-sm font-bold text-gray-700">{{ editingTagIndex !== null ? 'Edit Tag' : 'Create New Tag' }}</label>
            <div class="space-y-3">
              <input 
                type="text" 
                [(ngModel)]="newTagName" 
                [placeholder]="editingTagIndex !== null ? 'Tag name' : 'Tag name (comma separated for multiple)'" 
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                (keyup.enter)="addOrUpdateTag()"
              />
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-gray-500">Color:</span>
                  <input 
                    type="color" 
                    [(ngModel)]="newTagColor" 
                    class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    title="Choose color"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    *ngIf="editingTagIndex !== null"
                    (click)="cancelEdit()"
                    class="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    (click)="addOrUpdateTag()"
                    [disabled]="!newTagName.trim()"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold"
                  >
                    <lucide-icon [img]="editingTagIndex !== null ? TagIcon : Plus" [size]="16"></lucide-icon>
                    {{ editingTagIndex !== null ? 'Update' : 'Add' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Existing Tags -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Tags ({{ tags.length }})</label>
            <div *ngIf="tags.length === 0" class="text-center py-8 text-gray-400 text-sm">
              No tags yet. Create your first tag above!
            </div>
            <div class="flex flex-wrap gap-2">
              <div *ngFor="let tag of tags; let i = index" 
                (click)="editTag(i)"
                [class]="'flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer hover:shadow-sm ' + (editingTagIndex === i ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50' : 'bg-white border-gray-200 hover:border-indigo-300')"
              >
                <div 
                  class="w-3 h-3 rounded-full border border-white shadow-sm"
                  [style.background-color]="tag.color"
                ></div>
                <span class="font-medium text-sm text-gray-700">{{ tag.name }}</span>
                <span *ngIf="tag.isNew" class="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">New</span>
                <span *ngIf="tag.isUpdated && !tag.isNew" class="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">Modified</span>
                <button 
                  (click)="removeTag(i, tag, $event)"
                  class="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <lucide-icon [img]="X" [size]="14"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            (click)="close.emit()" 
            class="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            (click)="saveAndClose()" 
            [disabled]="isSaving"
            class="px-6 py-2 text-sm font-bold text-white bg-[#1C1D22] rounded-lg hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
          >
            <span *ngIf="isSaving" class="animate-spin">⌛</span>
            {{ isSaving ? 'Saving...' : 'Done' }}
          </button>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class ManageTagsModalComponent {
  @Input() projectId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() tagsUpdated = new EventEmitter<void>();

  readonly X = X;
  readonly Plus = Plus;
  readonly TagIcon = TagIcon;

  tags: any[] = [];
  newTagName = '';
  newTagColor = '#6366f1';
  isSaving = false;
  editingTagIndex: number | null = null;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadTags();
  }

  loadTags() {
    this.taskService.getTags(this.projectId).subscribe({
      next: (tags) => {
        this.tags = tags.map((tag: any) => ({
          id: tag.id,
          name: tag.attributes?.name || tag.name,
          color: tag.attributes?.color || tag.color,
          isNew: false,
          isUpdated: false
        }));
      },
      error: (err) => console.error('Error loading tags:', err)
    });
  }

  addOrUpdateTag() {
    if (!this.newTagName.trim()) return;

    if (this.editingTagIndex !== null) {
      // Update existing tag
      const tag = this.tags[this.editingTagIndex];
      tag.name = this.newTagName.trim();
      tag.color = this.newTagColor;
      if (!tag.isNew) {
        tag.isUpdated = true;
      }
      this.cancelEdit();
    } else {
      // Add new tag(s)
      const tagNames = this.newTagName.split(',').map(name => name.trim()).filter(name => name.length > 0);
      if (tagNames.length === 0) return;

      tagNames.forEach(name => {
        this.tags.push({
          id: null,
          name: name,
          color: this.newTagColor,
          isNew: true,
          isUpdated: false
        });
      });

      this.newTagName = '';
      this.newTagColor = '#6366f1';
    }
  }

  editTag(index: number) {
    this.editingTagIndex = index;
    this.newTagName = this.tags[index].name;
    this.newTagColor = this.tags[index].color;
  }

  cancelEdit() {
    this.editingTagIndex = null;
    this.newTagName = '';
    this.newTagColor = '#6366f1';
  }

  removeTag(index: number, tag: any, event: Event) {
    event.stopPropagation(); // Prevent triggering edit
    if (tag.isNew) {
      this.tags.splice(index, 1);
      if (this.editingTagIndex === index) this.cancelEdit();
    } else {
      if (!confirm('Are you sure you want to delete this tag?')) return;

      this.taskService.deleteTag(tag.id).subscribe({
        next: () => {
          this.tags.splice(index, 1);
          this.tagsUpdated.emit();
          if (this.editingTagIndex === index) this.cancelEdit();
        },
        error: (err) => console.error('Error deleting tag:', err)
      });
    }
  }

  saveAndClose() {
    const newTags = this.tags.filter(t => t.isNew);
    const updatedTags = this.tags.filter(t => t.isUpdated && !t.isNew);

    if (newTags.length === 0 && updatedTags.length === 0) {
      this.close.emit();
      return;
    }

    this.isSaving = true;
    const requests: any[] = [];

    // Create new tags
    newTags.forEach(tag => {
      requests.push(this.taskService.createTag(this.projectId, {
        name: tag.name,
        color: tag.color
      }));
    });

    // Update existing tags
    updatedTags.forEach(tag => {
      requests.push(this.taskService.updateTag(tag.id, {
        name: tag.name,
        color: tag.color
      }));
    });

    // Execute all requests
    import('rxjs').then(({ forkJoin }) => {
      forkJoin(requests).subscribe({
        next: () => {
          this.tagsUpdated.emit();
          this.isSaving = false;
          this.close.emit();
        },
        error: (err) => {
          console.error('Error saving tags:', err);
          this.isSaving = false;
        }
      });
    });
  }
}
