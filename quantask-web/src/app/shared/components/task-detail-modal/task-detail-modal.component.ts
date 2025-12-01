import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    LucideAngularModule,
    LayoutGrid, X, FileText, Share2, MoreHorizontal, Trash2,
    CheckCircle2, Calendar, UserPlus, Paperclip, MessageSquare,
    Plus, CheckSquare, Send, AlertCircle, Image as ImageIcon
} from 'lucide-angular';
import { AvatarComponent, User } from '../avatar/avatar.component';
import { TaskService, Task } from '../../../core/services/task.service';
import { SubtaskService } from '../../../core/services/subtask.service';
import { CommentService } from '../../../core/services/comment.service';
import { ActivityService } from '../../../core/services/activity.service';

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
    @Input() currentUserId: number = 1;
    @Output() close = new EventEmitter<void>();
    @Output() taskUpdated = new EventEmitter<Task>();

    @ViewChild('commentsEnd') commentsEnd!: ElementRef;

    modalTab: 'Subtasks' | 'Comments' | 'Activities' = 'Comments';
    commentInput: string = '';
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

    activities: any[] = [];
    isLoadingActivities = false;
    downloadedAttachments = new Set<number>();

    constructor(
        private taskService: TaskService,
        private subtaskService: SubtaskService,
        private commentService: CommentService,
        private activityService: ActivityService
    ) { }

    ngOnInit() {
        this.loadActivities();
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
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf': return FileText;
            case 'xls':
            case 'xlsx':
            case 'csv': return FileText; // Use a different icon if available, e.g., Table
            case 'doc':
            case 'docx': return FileText;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif': return ImageIcon;
            default: return FileText;
        }
    }

    getFileTypeClass(filename: string): string {
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
            case 'png':
            case 'gif': return 'bg-purple-50 text-purple-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    }
}
