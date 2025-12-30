import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    LucideAngularModule,
    LayoutGrid, X, FileText, Share2, MoreHorizontal, Trash2,
    CheckCircle2, Calendar, UserPlus, Paperclip, MessageSquare,
    Plus, CheckSquare, Send, AlertCircle, Image as ImageIcon, Upload, Tag
} from 'lucide-angular';
import { AvatarComponent, User } from '../avatar/avatar.component';
import { TaskService, Task } from '../../../core/services/task.service';
import { SubtaskService } from '../../../core/services/subtask.service';
import { CommentService } from '../../../core/services/comment.service';
import { ActivityService } from '../../../core/services/activity.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'app-task-detail-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule, AvatarComponent],
    templateUrl: './task-detail-modal.component.html',
    styleUrls: ['./task-detail-modal.component.css']
})
export class TaskDetailModalComponent implements AfterViewChecked {
    @Input() task!: Task;
    @Input() users: User[] = [];
    @Input() currentUserId: number = 0;

    // Formatted dates for input binding
    startDateFormatted: string = '';
    dueDateFormatted: string = '';

    @Output() close = new EventEmitter<void>();
    @Output() taskUpdated = new EventEmitter<Task>();
    @Output() taskDeleted = new EventEmitter<number>(); // Emit ID of deleted task
    @Output() inviteMember = new EventEmitter<void>();

    @ViewChild('commentsEnd') commentsEnd!: ElementRef;

    modalTab: 'Subtasks' | 'Comments' | 'Activities' = 'Comments';
    commentInput: string = '';
    showAssigneeDropdown = false;
    private shouldScrollToBottom = false;

    readonly tabs: ('Subtasks' | 'Comments' | 'Activities')[] = ['Subtasks', 'Comments', 'Activities'];

    readonly LayoutGrid = LayoutGrid;
    readonly X = X;
    readonly FileText = FileText;
    readonly Share2 = Share2;
    readonly MoreHorizontal = MoreHorizontal;
    readonly Trash2 = Trash2;
    readonly CheckCircle2 = CheckCircle2;
    readonly Calendar = Calendar;
    readonly UserPlus = UserPlus;
    readonly Paperclip = Paperclip;
    readonly MessageSquare = MessageSquare;
    readonly Plus = Plus;
    readonly CheckSquare = CheckSquare;
    readonly Send = Send;
    readonly AlertCircle = AlertCircle;
    readonly Upload = Upload;
    readonly Tag = Tag;

    activities: any[] = [];
    isLoadingActivities = false;
    downloadedAttachments = new Set<number>();
    isDragging = false;

    constructor(
        private taskService: TaskService,
        private subtaskService: SubtaskService,
        private commentService: CommentService,
        private activityService: ActivityService
    ) { }

    ngOnInit() {
        this.loadActivities();
        this.updateFormattedDates();
    }

    ngOnChanges() {
        this.updateFormattedDates();
    }

    private updateFormattedDates() {
        if (this.task) {
            this.startDateFormatted = this.formatDateForInput(this.task.start_date);
            this.dueDateFormatted = this.formatDateForInput(this.task.due_date);
        }
    }

    private formatDateForInput(dateStr?: string): string {
        if (!dateStr) return '';
        // Extract YYYY-MM-DD
        return dateStr.split('T')[0];
    }



    loadActivities() {
        this.isLoadingActivities = true;
        this.activityService.getActivities(this.task.id).subscribe({
            next: (data) => {
                this.activities = data;
                this.isLoadingActivities = false;
            },
            error: (err) => {
                console.error('Error loading activities:', err);
                this.isLoadingActivities = false;
            }
        });
    }

    ngAfterViewChecked() {
        if (this.shouldScrollToBottom) {
            this.scrollToBottom();
            this.shouldScrollToBottom = false;
        }
    }

    scrollToBottom(): void {
        try {
            this.commentsEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
        } catch (err) { }
    }

    handleSendMessage(): void {
        if (!this.commentInput.trim()) return;

        this.commentService.createComment(this.task.id, this.commentInput).subscribe({
            next: (comment) => {
                this.task.comments = [...(this.task.comments || []), comment];
                this.commentInput = '';
                this.shouldScrollToBottom = true;
                this.taskUpdated.emit(this.task);
            },
            error: (err) => console.error('Error creating comment:', err)
        });
    }

    handleToggleSubtask(subtask: any): void {
        const updatedStatus = !subtask.completed;
        this.subtaskService.updateSubtask(subtask.id, { completed: updatedStatus }).subscribe({
            next: (updated) => {
                this.task.subtasks = this.task.subtasks.map(st =>
                    st.id === updated.id ? updated : st
                );
                this.taskUpdated.emit(this.task);
            },
            error: (err) => console.error('Error updating subtask:', err)
        });
    }

    handleAddSubtask(): void {
        const text = prompt("Enter subtask description:");
        if (!text) return;

        this.subtaskService.createSubtask(this.task.id, { title: text }).subscribe({
            next: (subtask) => {
                this.task.subtasks = [...(this.task.subtasks || []), subtask];
                this.taskUpdated.emit(this.task);
            },
            error: (err) => console.error('Error creating subtask:', err)
        });
    }

    getUserById(id: number): User | undefined {
        return this.users.find(u => u.id === id);
    }

    getCompletedSubtasks(): number {
        return this.task.subtasks?.filter((st: any) => st.completed).length || 0;
    }

    getProgressPercentage(): number {
        if (!this.task.subtasks || this.task.subtasks.length === 0) return 0;
        return Math.round((this.getCompletedSubtasks() / this.task.subtasks.length) * 100);
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.close.emit();
        }
        // Also close dropdowns if open
        this.showAssigneeDropdown = false;
        this.showTagDropdown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleSendMessage();
        }
    }

    triggerFileUpload(): void {
        const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
        fileInput?.click();
    }

    handleFileUpload(event: any): void {
        const file = event.target.files[0];
        if (!file) return;

        this.taskService.uploadAttachment(this.task.id, file).subscribe({
            next: (attachment) => {
                this.task.attachments = [...(this.task.attachments || []), attachment];
                this.taskUpdated.emit(this.task);
            },
            error: (err) => console.error('Error uploading file:', err)
        });
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            this.uploadFile(file);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
    }

    uploadFile(file: File): void {
        this.taskService.uploadAttachment(this.task.id, file).subscribe({
            next: (response) => {
                console.log('Upload response:', response);
                // Handle JSON:API format if needed
                const attachment = response.data ? { id: response.data.id, ...response.data.attributes } : response;
                this.task.attachments = [...(this.task.attachments || []), attachment];
                this.taskUpdated.emit(this.task);
            },
            error: (err) => console.error('Error uploading file:', err)
        });
    }

    getActivityDescription(activity: any): { action: string, target: string } {
        const actionMap: { [key: string]: string } = {
            'created': 'created task',
            'updated': 'updated task',
            'status_changed': 'changed status to',
            'priority_changed': 'changed priority to',
            'assigned': 'assigned to',
            'commented': 'commented',
            'attachment_added': 'uploaded file',
            'subtask_added': 'added subtask',
            'subtask_completed': 'completed subtask'
        };

        const action = actionMap[activity.action_type] || activity.action_type;
        let target = '';

        if (activity.details) {
            if (activity.action_type === 'status_changed') {
                target = activity.details.to;
            } else if (activity.action_type === 'priority_changed') {
                target = activity.details.to;
            } else if (activity.action_type === 'assigned') {
                target = activity.details.assignee_name || 'user';
            } else if (activity.action_type === 'attachment_added') {
                target = activity.details.filename;
            } else if (activity.action_type === 'subtask_added') {
                target = activity.details.title;
            }
        }

        return { action, target };
    }

    getActivityTime(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes} minutes ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;

        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    }

    handleDeleteAttachment(attachment: any, event: Event): void {
        event.stopPropagation();
        if (!confirm('Are you sure you want to delete this attachment?')) return;

        this.taskService.deleteAttachment(attachment.id).subscribe({
            next: () => {
                this.task.attachments = this.task.attachments?.filter(a => a.id !== attachment.id);
                this.taskUpdated.emit(this.task);
            },
            error: (err) => console.error('Error deleting attachment:', err)
        });
    }

    handleDownloadAttachment(attachment: any, event: Event): void {
        event.stopPropagation();
        if (attachment.url) {
            window.open(attachment.url, '_blank');
            // Mark as downloaded
            this.downloadedAttachments.add(attachment.id);
        }
    }

    downloadAllAttachments(): void {
        if (!this.task.attachments || this.task.attachments.length === 0) return;

        this.task.attachments.forEach(attachment => {
            if (attachment.url) {
                window.open(attachment.url, '_blank');
                this.downloadedAttachments.add(attachment.id);
            }
        });
    }

    isAttachmentDownloaded(attachmentId: number): boolean {
        return this.downloadedAttachments.has(attachmentId);
    }

    getFileTypeIcon(filename: string): any {
        if (!filename) return FileText;
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf': return FileText;
            case 'xls':
            case 'xlsx':
            case 'csv': return FileText; // Use a different icon if available, e.g., Table
            case 'doc':
            case 'docx': return FileText;
            case 'jpg':
            case 'gif': return ImageIcon;
            default: return FileText;
        }
    }

    getFileTypeClass(filename: string): string {
        if (!filename) return 'bg-gray-50 text-gray-600';
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf': return 'bg-red-50 text-red-600';
            case 'xls':
            case 'xlsx':
            case 'csv': return 'bg-green-50 text-green-600';
            case 'doc':
            case 'docx': return 'bg-blue-50 text-blue-600';
            case 'jpg':
            case 'jpeg':
            case 'gif': return 'bg-purple-50 text-purple-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    }

    getTagStyles(tag: any): { [key: string]: string } {
        const bgColor = tag.color || '#6366F1'; // Default to Indigo-500
        return {
            'background-color': bgColor,
            'color': '#FFFFFF' // Always white text to match card style
        };
    }

    getTagDotColor(tag: any): string {
         return tag.color || '#9CA3AF'; // Gray-400
    }

    // --- Assignee Management ---

    assigneeSearchQuery: string = '';

    getAvailableUsers(): User[] {
        let users = this.users;
        if (this.task.assignees) {
             const assignedIds = new Set(this.task.assignees.map(u => u.id));
             users = users.filter(u => !assignedIds.has(u.id));
        }

        if (!this.assigneeSearchQuery) return users;

        const query = this.assigneeSearchQuery.toLowerCase();
        return users.filter(u => 
            u.name.toLowerCase().includes(query) || 
            (u.email && u.email.toLowerCase().includes(query))
        );
    }

    addAssignee(user: User): void {
        console.log('Adding assignee:', user);
        const currentAssigneeIds = this.task.assignees?.map(u => u.id) || [];
        const newAssigneeIds = [...currentAssigneeIds, user.id];
        
        // Optimistic UI update
        const previousAssignees = [...(this.task.assignees || [])];
        this.task.assignees = [...previousAssignees, user];
        this.showAssigneeDropdown = false;
        
        this.updateTaskField('assignee_ids', newAssigneeIds).subscribe({
            next: () => console.log('Assignee added successfully'),
            error: (err) => {
                console.error('Failed to add assignee, reverting:', err);
                this.task.assignees = previousAssignees;
                // Toast error here ideally
            }
        });
    }

    removeAssignee(user: any, event: Event): void {
        event.stopPropagation();
        console.log('Removing assignee:', user);
        const currentAssigneeIds = this.task.assignees?.map(u => u.id) || [];
        const newAssigneeIds = currentAssigneeIds.filter(id => id !== user.id);
        
        // Optimistic UI update
        const previousAssignees = [...(this.task.assignees || [])];
        this.task.assignees = this.task.assignees?.filter(u => u.id !== user.id);

        this.updateTaskField('assignee_ids', newAssigneeIds).subscribe({
            next: () => console.log('Assignee removed successfully'),
            error: (err) => {
                console.error('Failed to remove assignee, reverting:', err);
                this.task.assignees = previousAssignees;
            }
        });
    }

    toggleAssigneeDropdown(event: Event): void {
        event.stopPropagation();
        this.showAssigneeDropdown = !this.showAssigneeDropdown;
    }

    // --- Tag Management ---

    showTagDropdown = false;
    tagSearchQuery = '';
    availableTags: any[] = [];

    loadTags() {
        this.taskService.getTags(this.task.project_id).subscribe({
            next: (tags) => this.availableTags = tags,
            error: (err) => console.error('Error loading tags:', err)
        });
    }

    getFilteredTags(): any[] {
        let tags = this.availableTags;
        if (this.task.tags) {
            const assignedIds = new Set(this.task.tags.map(t => t.id));
            tags = tags.filter(t => !assignedIds.has(t.id));
        }
        
        if (!this.tagSearchQuery) return tags;
        const query = this.tagSearchQuery.toLowerCase();
        return tags.filter(t => t.name.toLowerCase().includes(query));
    }

    toggleTagDropdown(event: Event): void {
        event.stopPropagation();
        this.showTagDropdown = !this.showTagDropdown;
        if (this.showTagDropdown && this.availableTags.length === 0) {
            this.loadTags();
        }
    }

    addTag(tag: any): void {
        const currentTagIds = this.task.tags?.map(t => t.id) || [];
        const newTagIds = [...currentTagIds, tag.id];

        // Optimistic Update
        const previousTags = [...(this.task.tags || [])];
        this.task.tags = [...previousTags, tag];
        this.showTagDropdown = false;

        this.updateTaskField('tag_ids', newTagIds).subscribe({
             error: (err) => {
                 console.error('Failed to add tag, reverting:', err);
                 this.task.tags = previousTags;
             }
        });
        this.tagSearchQuery = '';
    }

    removeTag(tag: any, event: Event): void {
        event.stopPropagation();
        const currentTagIds = this.task.tags?.map(t => t.id) || [];
        const newTagIds = currentTagIds.filter(id => id !== tag.id);

        // Optimistic Update
        const previousTags = [...(this.task.tags || [])];
        this.task.tags = previousTags.filter(t => t.id !== tag.id);

        this.updateTaskField('tag_ids', newTagIds).subscribe({
            error: (err) => {
                console.error('Failed to remove tag, reverting:', err);
                 this.task.tags = previousTags;
            }
        });
    }

    createTag(): void {
        if (!this.tagSearchQuery.trim()) return;
        const name = this.tagSearchQuery.trim();
        // Vibrant Hex colors (Tailwind 500 range) for white text contrast
        const colors = [
            '#EF4444', // Red-500
            '#F97316', // Orange-500
            '#F59E0B', // Amber-500
            '#EAB308', // Yellow-500 (might need text-black, but keeping white for consistency)
            '#84CC16', // Lime-500
            '#22C55E', // Green-500
            '#10B981', // Emerald-500
            '#14B8A6', // Teal-500
            '#06B6D4', // Cyan-500
            '#0EA5E9', // Sky-500
            '#3B82F6', // Blue-500
            '#6366F1', // Indigo-500
            '#8B5CF6', // Violet-500
            '#A855F7', // Purple-500
            '#D946EF', // Fuchsia-500
            '#EC4899', // Pink-500
            '#F43F5E'  // Rose-500
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        this.taskService.createTag(this.task.project_id, { name, color: randomColor }).subscribe({
            next: (newTag) => {
                this.availableTags.push(newTag); // Add to local cache
                this.addTag(newTag); // Immediately add to task
            },
            error: (err) => console.error('Error creating tag:', err)
        });
    }


    deleteTask(): void {
        if (confirm('Are you sure you want to delete this task? This cannot be undone.')) {
            this.taskService.deleteTask(this.task.id).subscribe({
                next: () => {
                    this.taskDeleted.emit(this.task.id);
                    this.close.emit();
                },
                error: (err) => console.error('Error deleting task:', err)
            });
        }
    }

    updateTaskField(field: string, value: any): Observable<any> {
        // Optimistic update
        const originalValue = (this.task as any)[field];
        (this.task as any)[field] = value;

        const updateDto: any = {};
        updateDto[field] = value;

        const request = this.taskService.updateTask(this.task.id, updateDto).pipe(
            catchError((err: any) => {
                console.error(`Error updating task ${field}:`, err);
                // Revert on error
                (this.task as any)[field] = originalValue;
                this.updateFormattedDates(); // Revert formatted dates
                return throwError(() => err);
            })
        );

        request.subscribe({
            next: (updatedTask) => {
                // Merge updates to keep subtasks/comments/etc if API doesn't return them fully
                this.task = { ...this.task, ...updatedTask };
                this.updateFormattedDates(); // Sync formatted dates with response
                this.taskUpdated.emit(this.task);
            },
            // Error handled in pipe
        });

        return request;
    }

    onTitleBlur(event: any): void {
        const newTitle = event.target.innerText.trim();
        if (newTitle && newTitle !== this.task.title) {
            this.updateTaskField('title', newTitle);
        } else {
            // Revert visual change if empty
            event.target.innerText = this.task.title;
        }
    }

    onDescriptionBlur(event: any): void {
        // ngModel update is handled, just trigger save if changed
        // We defer to a separate method or assume ngModelChange calls update
        // But for textarea with ngModel, we can just listen to (change) or (blur)
    }

    onTitleEnter(event: Event): void {
        event.preventDefault();
        (event.target as HTMLElement).blur();
    }
}
