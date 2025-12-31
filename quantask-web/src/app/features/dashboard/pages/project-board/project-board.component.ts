import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    LucideAngularModule,
    LayoutGrid, Table, List, Clock, Search, Filter, Plus,
    MoreHorizontal, Paperclip, MessageSquare, UserPlus, ChevronDown,
    ImageIcon, FileText, Upload, Camera, Tag, Calendar, ArrowUpDown
} from 'lucide-angular';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
    DragDropModule
} from '@angular/cdk/drag-drop';
import { AvatarComponent, User } from '../../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { TaskDetailModalComponent } from '../../../../shared/components/task-detail-modal/task-detail-modal.component';
import { TaskService, Task, CreateTaskDto } from '../../../../core/services/task.service';
import { ProjectService, Project } from '../../../../core/services/project.service';
import { CreateTaskModalComponent } from '../../../../shared/components/create-task-modal/create-task-modal.component';
import { InviteMemberModalComponent } from '../../../../shared/components/invite-member-modal/invite-member-modal.component';
import { ManageTagsModalComponent } from '../../../../shared/components/manage-tags-modal/manage-tags-modal.component';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationApiService } from '../../../../core/services/notification-api.service';

import { TaskTimelineComponent } from './components/task-timeline/task-timeline';
import { Subject, takeUntil, combineLatest } from 'rxjs';

@Component({
    selector: 'app-project-board',
    standalone: true,
    imports: [
        CommonModule,
        DragDropModule,
        LucideAngularModule,
        FormsModule,
        AvatarComponent,
        BadgeComponent,
        TaskDetailModalComponent,
        CreateTaskModalComponent,
        InviteMemberModalComponent,
        ManageTagsModalComponent,
        TaskTimelineComponent
    ],
    templateUrl: './project-board.component.html',
    styles: [`
    /* Custom Scrollbar for Kanban Columns */
    .cdk-drop-list::-webkit-scrollbar {
      width: 6px;
    }
    .cdk-drop-list::-webkit-scrollbar-track {
      background: transparent;
    }
    .cdk-drop-list::-webkit-scrollbar-thumb {
      background-color: #E2E8F0;
      border-radius: 20px;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    
    /* Drag & Drop Visuals */
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 20px; /* rounded-2xl */
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      background-color: white;
      opacity: 0.98;
      width: 300px !important;
      padding: 1.25rem !important; /* Restore p-5 padding */
      position: relative;
      overflow: hidden;
      border: 1px solid #F1F5F9;
    }
    .cdk-drag-preview div[class*="absolute"] {
      opacity: 1 !important; /* Force side accent to be visible */
      visibility: visible !important;
    }
    .cdk-drag-placeholder {
      opacity: 0.3;
      background: #F3F4F6;
      border: 1px dashed #9CA3AF;
      border-radius: 12px;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class ProjectBoardComponent implements OnInit, OnDestroy {
    activeTab = 'Kanban';
    selectedTask: Task | null = null;
    showCreateTaskModal = false;
    showManageTagsModal = false;
    tasks: Task[] = [];
    searchQuery = '';
    showFilterMenu = false;
    showInviteModal = false;
    activeFilters = {
        status: [] as string[],
        priority: [] as string[],
        assignee: [] as number[]
    };
    isLoading = true;
    currentProjectId: number = 1;
    currentWorkspaceId = '1';
    
    private destroy$ = new Subject<void>();

    readonly tabs = [
        { label: 'Kanban', icon: LayoutGrid },
        { label: 'List', icon: List },
        { label: 'Timeline', icon: Clock }
    ];

    readonly LayoutGrid = LayoutGrid;
    readonly Table = Table;
    readonly List = List;
    readonly Clock = Clock;
    readonly Search = Search;
    readonly Filter = Filter;
    readonly Plus = Plus;
    readonly MoreHorizontal = MoreHorizontal;
    readonly Paperclip = Paperclip;
    readonly MessageSquare = MessageSquare;
    readonly UserPlus = UserPlus;
    readonly ChevronDown = ChevronDown;
    readonly ImageIcon = ImageIcon;
    readonly FileText = FileText;
    readonly Upload = Upload;
    readonly Camera = Camera;
    readonly Tag = Tag;
    readonly Calendar = Calendar;
    readonly ArrowUpDown = ArrowUpDown;

    projectMembers: User[] = [];
    currentProject: Project | null = null;
    currentUserId: number | null = null;

    // Sort State
    sortField: string = '';
    sortDirection: 'asc' | 'desc' = 'asc';

    constructor(
        private route: ActivatedRoute,
        private taskService: TaskService,
        private projectService: ProjectService,
        private workspaceService: WorkspaceService,
        private authService: AuthService,
        private notificationService: NotificationApiService
    ) { }

    ngOnInit() {
        this.authService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                if (user) this.currentUserId = +user.id;
            });

        // Use combineLatest to handle both data sources (URL and Projects) simultaneously
        // This prevents race conditions and nested subscription issues where one might emit before the other is ready
        combineLatest([
            this.projectService.projects$,
            this.route.paramMap
        ]).pipe(takeUntil(this.destroy$))
        .subscribe(([projects, params]) => {
            if (projects.length > 0) {
                const projectId = params.get('id');
                
                // Determine valid project from ID or default to first
                let targetProject: Project | undefined;
                
                if (projectId) {
                    targetProject = projects.find(p => p.id === projectId);
                } 
                
                // Fallback if ID not found or invalid
                if (!targetProject) {
                    targetProject = projects[0];
                }

                if (targetProject) {
                    // Update state only if project changed or first load
                    const workspaceId = targetProject.attributes?.workspace_id?.toString();
                    
                    // Always update current refs
                    this.currentProjectId = +targetProject.id;
                    this.currentProject = targetProject;
                    if (workspaceId) this.currentWorkspaceId = workspaceId;

                    // Trigger data loads
                    this.loadTasks();
                    this.loadProjectMembers();
                } else {
                    this.isLoading = false;
                }
            } else {
                this.isLoading = false;
            }
        });
            
        // Subscribe to notifications for real-time updates
        this.notificationService.notifications$
            .pipe(takeUntil(this.destroy$))
            .subscribe(notifications => {
                if (notifications.length > 0) {
                   this.loadTasks();
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadProjectMembers() {
        if (!this.currentWorkspaceId) return;
        
        // Use combineLatest to join members fetch with current user state
        // This ensures if I am not in the members list (data consistency issue), I explicitly add myself.
        combineLatest([
            this.workspaceService.getMembers(this.currentWorkspaceId),
            this.authService.currentUser$
        ]).pipe(takeUntil(this.destroy$))
        .subscribe({
            next: ([members, currentUser]: [any[], any]) => {
                let mappedMembers = members.map((m: any) => ({
                    id: parseInt(m.id),
                    name: m.attributes?.full_name || m.name || m.user_name || 'Unknown',
                    email: m.attributes?.email || m.email || m.user_email,
                    initials: m.attributes?.initials || this.getInitials(m.attributes?.full_name || m.name),
                    color: this.getRandomColor(parseInt(m.id)),
                    avatar: m.attributes?.avatar_url
                }));

                // Ensure current user is in the list
                if (currentUser && !mappedMembers.find((m: any) => m.id === parseInt(currentUser.id))) {
                    console.warn('Current user missing from workspace members, auto-injecting.', currentUser);
                    const selfMember = {
                        id: parseInt(currentUser.id),
                        name: currentUser.fullName || currentUser.firstName || 'Me',
                        email: currentUser.email,
                        initials: currentUser.initials || this.getInitials(currentUser.fullName || currentUser.firstName),
                        color: this.getRandomColor(parseInt(currentUser.id)),
                        avatar: currentUser.avatar_url
                    };
                    mappedMembers = [selfMember, ...mappedMembers];
                }

                this.projectMembers = mappedMembers;
            },
            error: (err: any) => console.error('Error loading members:', err)
        });
    }

    getInitials(name: string): string {
        if (!name) return '';
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    getRandomColor(id: number): string {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-red-500',
            'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
            'bg-indigo-500', 'bg-teal-500'
        ];
        return colors[id % colors.length];
    }

    loadTasks() {
        if (!this.currentProjectId) return;
        
        // Only verify loading state if we have no tasks to prevent flicker during background refresh
        if (this.tasks.length === 0) this.isLoading = true;

        this.taskService.getTasks(this.currentProjectId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (tasks) => {
                    this.tasks = tasks;
                    this.isLoading = false;

                    // Check for task query param to auto-open detail
                    const taskId = this.route.snapshot.queryParamMap.get('task');
                    if (taskId && !this.selectedTask) {
                        const task = this.tasks.find(t => t.id === parseInt(taskId));
                        if (task) {
                            this.openTaskDetail(task);
                        }
                    }
                },
                error: (error) => {
                    console.error('Error loading tasks:', error);
                    this.isLoading = false;
                }
            });
    }

    onSearchChange(query: string) {
        this.searchQuery = query.toLowerCase();
    }

    toggleFilterMenu() {
        this.showFilterMenu = !this.showFilterMenu;
    }


    clearFilters() {
        this.activeFilters = {
            status: [],
            priority: [],
            assignee: []
        };
        this.searchQuery = '';
    }

    toggleStatusFilter(status: string) {
        const index = this.activeFilters.status.indexOf(status);
        if (index > -1) {
            this.activeFilters.status.splice(index, 1);
        } else {
            this.activeFilters.status.push(status);
        }
    }

    togglePriorityFilter(priority: string) {
        const index = this.activeFilters.priority.indexOf(priority);
        if (index > -1) {
            this.activeFilters.priority.splice(index, 1);
        } else {
            this.activeFilters.priority.push(priority);
        }
    }

    toggleAssigneeFilter(assigneeId: number) {
        const index = this.activeFilters.assignee.indexOf(assigneeId);
        if (index > -1) {
            this.activeFilters.assignee.splice(index, 1);
        } else {
            this.activeFilters.assignee.push(assigneeId);
        }
    }
    
    toggleSort(field: string) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
    }
    
    isOverdue(date: string | undefined): boolean {
        if (!date) return false;
        return new Date(date) < new Date();
    }



    get filteredTasks(): Task[] {
        let filtered = this.tasks;

        // 1. Search Filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(query) ||
                (task.description && task.description.toLowerCase().includes(query))
            );
        }

        // 2. Advanced Filters
        if (this.activeFilters.status.length > 0) {
             filtered = filtered.filter(t => this.activeFilters.status.includes(t.status));
        }

        if (this.activeFilters.priority.length > 0) {
            filtered = filtered.filter(t => this.activeFilters.priority.includes(t.priority));
        }

        if (this.activeFilters.assignee.length > 0) {
             filtered = filtered.filter(t => 
                t.assignees.some(a => this.activeFilters.assignee.includes(+a.id))
            );
        }
        
        // Sort
        if (this.sortField) {
            filtered.sort((a, b) => {
                let valA = (a as any)[this.sortField];
                let valB = (b as any)[this.sortField];
                
                if (!valA) return 1;
                if (!valB) return -1;
                
                if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
                if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
                return 0;
            });
        }

        return filtered;
    }



    getActiveFilterCount(): number {
        return this.activeFilters.status.length +
            this.activeFilters.priority.length +
            this.activeFilters.assignee.length;
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            'todo': 'To-do',
            'in_progress': 'On Progress',
            'in_review': 'In Review',
            'done': 'Completed'
        };
        return labels[status] || status;
    }

    getTasksByStatus(status: string): Task[] {
        const statusMap: { [key: string]: string } = {
            'To-do': 'todo',
            'On Progress': 'in_progress',
            'In Review': 'in_review',
            'Completed': 'done'
        };
        const backendStatus = statusMap[status] || status;
        return this.filteredTasks.filter(t => t.status === backendStatus);
    }

    loadProject() {
        if (!this.currentProjectId) return;
        this.projectService.getProject(this.currentProjectId.toString())
            .pipe(takeUntil(this.destroy$))
            .subscribe(project => {
                this.currentProject = project;
                if (project?.attributes?.workspace_id) {
                    this.currentWorkspaceId = project.attributes.workspace_id.toString();
                }
            });
    }

    getUserById(id: number): User | undefined {
        return this.projectMembers.find(u => u.id === id);
    }

    getStatusConfig(status: string) {
        const configs: { [key: string]: { bg: string, dot: string } } = {
            'To-do': { bg: 'bg-gray-100', dot: 'bg-gray-400' },
            'On Progress': { bg: 'bg-blue-50', dot: 'bg-blue-500' },
            'In Review': { bg: 'bg-amber-50', dot: 'bg-amber-500' },
            'Completed': { bg: 'bg-green-50', dot: 'bg-green-500' }
        };
        return configs[status] || { bg: 'bg-gray-100', dot: 'bg-gray-400' };
    }

    getCompletedSubtasks(task: Task): number {
        return task.subtasks?.filter((st: any) => st.completed).length || 0;
    }

    getProgressPercentage(task: Task): number {
        if (!task.subtasks || task.subtasks.length === 0) return 0;
        return Math.round((this.getCompletedSubtasks(task) / task.subtasks.length) * 100);
    }

    openTaskDetail(task: Task): void {
        this.selectedTask = task;
    }

    closeTaskDetail(): void {
        this.selectedTask = null;
    }

    handleTaskUpdated(updatedTask: Task): void {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
            this.tasks[index] = updatedTask;
            this.selectedTask = updatedTask;
        }
    }

    handleTaskDeleted(taskId: number): void {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.closeTaskDetail();
    }

    openCreateTaskModal(): void {
        this.showCreateTaskModal = true;
    }

    closeCreateTaskModal(): void {
        this.showCreateTaskModal = false;
    }

    createNewTask(): void {
        this.openCreateTaskModal();
    }

    handleTaskCreated(task: any): void {
        // The modal now handles the API call and returns the created task
        // We just need to update our local state and close the modal
        if (task && !this.tasks.find(t => t.id === task.id)) {
            this.tasks = [...this.tasks, task];
        }
        this.closeCreateTaskModal();
    }

    onBannerSelected(event: any) {
        const file = event.target.files[0];
        if (file && this.currentProject) {
            const formData = new FormData();
            formData.append('project[banner_image]', file);

            this.projectService.updateProject(this.currentProject.id, formData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (updatedProject) => {
                        this.currentProject = updatedProject;
                        this.loadProject();
                    },
                    error: (error) => {
                        console.error('Error uploading banner:', error);
                    }
                });
        }
    }

    triggerBannerUpload() {
        const fileInput = document.getElementById('banner-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    }

    openInviteModal() {
        this.showInviteModal = true;
    }

    closeInviteModal() {
        this.showInviteModal = false;
    }

    openManageTagsModal() {
        this.showManageTagsModal = true;
    }

    closeManageTagsModal() {
        this.showManageTagsModal = false;
    }

    handleTagsUpdated() {
        this.loadTasks();
    }

    getProjectGradient(colorClass: string | undefined): string {
        if (!colorClass) return 'bg-gradient-to-r from-[#5B7FFF] via-[#7B8CFF] to-[#A29BFE]';

        const colorMap: { [key: string]: string } = {
            'bg-indigo-500': 'bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-300',
            'bg-blue-500': 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300',
            'bg-green-500': 'bg-gradient-to-r from-green-500 via-green-400 to-green-300',
            'bg-yellow-500': 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300',
            'bg-red-500': 'bg-gradient-to-r from-red-500 via-red-400 to-red-300',
            'bg-purple-500': 'bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300',
            'bg-pink-500': 'bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300',
            'bg-gray-500': 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-300',
        };

        return colorMap[colorClass] || 'bg-gradient-to-r from-[#5B7FFF] via-[#7B8CFF] to-[#A29BFE]';
    }

    drop(event: CdkDragDrop<Task[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            console.log('Moved to container:', event.container.id);
            const statusMap: { [key: string]: string } = {
                'To-do': 'todo',
                'On Progress': 'in_progress',
                'In Review': 'in_review',
                'Completed': 'done'
            };
            const reverseStatusMap: { [key: string]: string } = {
                'todo': 'To-do',
                'in_progress': 'On Progress',
                'in_review': 'In Review',
                'done': 'Completed'
            };

            const newStatusLabel = event.container.id;
            const newBackendStatus = statusMap[newStatusLabel] || newStatusLabel;

            const task = event.previousContainer.data[event.previousIndex];

            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );

            task.status = newBackendStatus;
            const newPosition = (event.currentIndex + 1) * 1000;

            this.taskService.moveTask(task.id, newBackendStatus, newPosition)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (updatedTask) => {
                        // Success
                    },
                    error: (err) => {
                        console.error('Failed to move task', err);
                        transferArrayItem(
                            event.container.data,
                            event.previousContainer.data,
                            event.currentIndex,
                            event.previousIndex
                        );
                        task.status = reverseStatusMap[event.previousContainer.id] || event.previousContainer.id;
                    }
                });
        }
    }
}
