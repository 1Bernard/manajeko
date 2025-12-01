import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    LucideAngularModule,
    LayoutGrid, Table, List, Clock, Search, Filter, Plus,
    MoreHorizontal, Paperclip, MessageSquare, UserPlus, ChevronDown,
    ImageIcon, FileText, Upload, Camera, Tag
} from 'lucide-angular';
import { AvatarComponent, User } from '../../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { TaskDetailModalComponent } from '../../../../shared/components/task-detail-modal/task-detail-modal.component';
import { TaskService, Task, CreateTaskDto } from '../../../../core/services/task.service';
import { ProjectService, Project } from '../../../../core/services/project.service';
import { CreateTaskModalComponent } from '../../../../shared/components/create-task-modal/create-task-modal.component';
import { InviteMemberModalComponent } from '../../../../shared/components/invite-member-modal/invite-member-modal.component';
import { ManageTagsModalComponent } from '../../../../shared/components/manage-tags-modal/manage-tags-modal.component';

@Component({
    selector: 'app-project-board',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule, AvatarComponent, BadgeComponent, TaskDetailModalComponent, CreateTaskModalComponent, InviteMemberModalComponent, ManageTagsModalComponent],
    templateUrl: './project-board.component.html',
    styleUrls: ['./project-board.component.css']
})
export class ProjectBoardComponent implements OnInit {
    activeTab = 'Kanban';
    selectedTask: Task | null = null;
    showCreateTaskModal = false;
    showManageTagsModal = false;
    tasks: Task[] = [];
    filteredTasks: Task[] = [];
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
    currentWorkspaceId = '1'; // TODO: Get from route or workspace service

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

    USERS: User[] = [
        { id: 1, name: 'Calum Tyler', initials: 'CT', color: 'bg-blue-500', avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: 2, name: 'Dawson Tarman', initials: 'DT', color: 'bg-green-500', avatar: 'https://i.pravatar.cc/150?u=2' },
        { id: 3, name: 'Alice Smith', initials: 'AS', color: 'bg-pink-500', avatar: 'https://i.pravatar.cc/150?u=3' },
    ];

    tabs = [
        { label: 'Kanban', icon: this.LayoutGrid },
        { label: 'Table', icon: this.Table },
        { label: 'List', icon: this.List },
        { label: 'Timeline', icon: this.Clock },
    ];

    currentProject: Project | null = null;

    constructor(
        private taskService: TaskService,
        private projectService: ProjectService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // Get project ID from route parameter
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.currentProjectId = parseInt(params['id'], 10);
                this.loadProject();
                this.loadTasks();
            }
        });
    }

    loadProject() {
        this.projectService.getProject(this.currentProjectId.toString()).subscribe(project => {
            this.currentProject = project;
            // Get workspace ID from project
            if (project?.attributes?.workspaceId) {
                this.currentWorkspaceId = project.attributes.workspaceId.toString();
            }
        });
    }

    loadTasks() {
        this.isLoading = true;
        this.taskService.getTasks(this.currentProjectId).subscribe({
            next: (tasks) => {
                this.tasks = tasks;
                this.filteredTasks = tasks;
                this.applyFilters();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading tasks:', error);
                this.isLoading = false;
            }
        });
    }

    onSearchChange(query: string) {
        this.searchQuery = query.toLowerCase();
        this.applyFilters();
    }

    toggleFilterMenu() {
        this.showFilterMenu = !this.showFilterMenu;
    }

    applyFilters() {
        let filtered = [...this.tasks];

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(this.searchQuery) ||
                (task.description && task.description.toLowerCase().includes(this.searchQuery))
            );
        }

        // Apply status filter
        if (this.activeFilters.status.length > 0) {
            filtered = filtered.filter(task =>
                this.activeFilters.status.includes(task.status)
            );
        }

        // Apply priority filter
        if (this.activeFilters.priority.length > 0) {
            filtered = filtered.filter(task =>
                this.activeFilters.priority.includes(task.priority)
            );
        }

        // Apply assignee filter
        if (this.activeFilters.assignee.length > 0) {
            filtered = filtered.filter(task =>
                task.assignees && task.assignees.some(assignee =>
                    this.activeFilters.assignee.includes(assignee.id)
                )
            );
        }

        this.filteredTasks = filtered;
    }

    clearFilters() {
        this.activeFilters = {
            status: [],
            priority: [],
            assignee: []
        };
        this.searchQuery = '';
        this.applyFilters();
    }

    toggleStatusFilter(status: string) {
        const index = this.activeFilters.status.indexOf(status);
        if (index > -1) {
            this.activeFilters.status.splice(index, 1);
        } else {
            this.activeFilters.status.push(status);
        }
        this.applyFilters();
    }

    togglePriorityFilter(priority: string) {
        const index = this.activeFilters.priority.indexOf(priority);
        if (index > -1) {
            this.activeFilters.priority.splice(index, 1);
        } else {
            this.activeFilters.priority.push(priority);
        }
        this.applyFilters();
    }

    toggleAssigneeFilter(assigneeId: number) {
        const index = this.activeFilters.assignee.indexOf(assigneeId);
        if (index > -1) {
            this.activeFilters.assignee.splice(index, 1);
        } else {
            this.activeFilters.assignee.push(assigneeId);
        }
        this.applyFilters();
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

    getUserById(id: number): User | undefined {
        return this.USERS.find(u => u.id === id);
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

    openCreateTaskModal(): void {
        this.showCreateTaskModal = true;
    }

    closeCreateTaskModal(): void {
        this.showCreateTaskModal = false;
    }

    createNewTask(): void {
        this.openCreateTaskModal();
    }

    handleTaskCreated(taskData: any): void {
        const newTask: CreateTaskDto = {
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            due_date: taskData.dueDate,
            assignee_ids: taskData.assigneeIds || [],
            tag_ids: taskData.tagIds || [],
            attachments: taskData.attachments
        };

        this.taskService.createTask(this.currentProjectId, newTask).subscribe({
            next: (task) => {
                this.tasks = [...this.tasks, task];
                this.applyFilters(); // Update filteredTasks to show the new task
                this.closeCreateTaskModal();
            },
            error: (error) => {
                console.error('Error creating task:', error);
            }
        });
    }

    // Banner Upload Logic
    onBannerSelected(event: any) {
        const file = event.target.files[0];
        if (file && this.currentProject) {
            const formData = new FormData();
            formData.append('project[banner_image]', file);

            this.projectService.updateProject(this.currentProject.id, formData).subscribe({
                next: (updatedProject) => {
                    this.currentProject = updatedProject;
                    // Reload project to ensure banner URL is displayed
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

    // Invite Logic
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
        // Reload tasks to get updated tag information
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
}
