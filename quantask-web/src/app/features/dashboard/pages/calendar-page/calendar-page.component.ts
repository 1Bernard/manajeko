import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-angular';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { CreateTaskModalComponent } from '../../../../shared/components/create-task-modal/create-task-modal.component';
import { TaskDetailModalComponent } from '../../../../shared/components/task-detail-modal/task-detail-modal.component';
import { TaskService, Task } from '../../../../core/services/task.service';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CreateTaskModalComponent, TaskDetailModalComponent],
  template: `
    <div class="max-w-[1600px] mx-auto animate-in fade-in duration-500 h-full flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                    <lucide-icon [img]="Calendar" [size]="32" class="text-indigo-600"></lucide-icon> Calendar
                </h1>
                <p class="text-gray-500 mt-1">Manage your schedule and upcoming deadlines.</p>
            </div>
            <div class="flex items-center gap-4">
                 <div class="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                     <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600" (click)="prevMonth()">
                         <lucide-icon [img]="ChevronLeft" [size]="20"></lucide-icon>
                     </button>
                     <span class="px-4 font-bold text-gray-900 min-w-[150px] text-center">{{ currentMonthLabel }}</span>
                     <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600" (click)="nextMonth()">
                         <lucide-icon [img]="ChevronRight" [size]="20"></lucide-icon>
                     </button>
                 </div>
                 <button 
                    (click)="openCreateTaskModal()" 
                    class="bg-[#1C1D22] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-indigo-200">
                     <lucide-icon [img]="Plus" [size]="18"></lucide-icon> New Event
                 </button>
            </div>
        </div>

        <!-- Calendar Grid -->
        <div class="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-100/50 flex-1 overflow-hidden flex flex-col">
            <!-- Days Header -->
            <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50/50">
                <div *ngFor="let day of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" class="p-4 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">
                    {{ day }}
                </div>
            </div>

            <!-- Calendar Cells -->
            <div class="grid grid-cols-7 bg-white flex-1 min-h-[600px] overflow-y-auto">
                 <!-- Empty cells for start of month -->
                 <div *ngFor="let i of emptyStartDays" class="border-b border-r border-gray-100 p-2 min-h-[120px] bg-gray-50/30"></div>
                 
                 <!-- Days -->
                 <div *ngFor="let day of days" (click)="openCreateTaskModal(day)" class="border-b border-r border-gray-100 p-3 min-h-[120px] hover:bg-indigo-50/10 transition-colors group relative cursor-pointer flex flex-col gap-2">
                     <span class="text-sm font-medium text-gray-700 w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors" [class.bg-indigo-600]="day === currentDate.getDate() && currentMonthLabel.includes(currentDate.toLocaleString('default', { month: 'long' }))" [class.text-white]="day === currentDate.getDate()">{{ day }}</span>
                     
                     <!-- Events -->
                     <ng-container *ngIf="tasksByDay[day]">
                        <!-- Prevent click propagation so clicking a task doesnt open create modal (optional, but good UX) -->
                        <div *ngFor="let task of tasksByDay[day]" (click)="$event.stopPropagation(); openTaskDetail(task)" class="bg-indigo-50 text-indigo-700 text-xs px-2 py-1.5 rounded-md font-medium border border-indigo-100 truncate shadow-sm hover:shadow-md transition-all cursor-pointer">
                             {{ task.title }}
                        </div>
                     </ng-container>
                 </div>
                 
                 <!-- Empty cells for end of month -->
                  <div *ngFor="let i of emptyEndDays" class="border-b border-r border-gray-100 p-2 min-h-[120px] bg-gray-50/30"></div>
            </div>
        </div>
    </div>
    
    <app-create-task-modal
        *ngIf="showCreateTaskModal"
        [workspaceId]="defaultWorkspaceId"
        [projectId]="defaultProject?.id"
        [initialDate]="selectedDate"
        [enableProjectSelection]="true"
        (close)="closeCreateTaskModal()"
        (taskCreated)="handleTaskCreated($event)">
    </app-create-task-modal>

    <app-task-detail-modal
        *ngIf="selectedTask"
        [task]="selectedTask"
        (close)="closeTaskDetail()"
        (taskUpdated)="loadTasks()"
        (taskDeleted)="loadTasks()">
    </app-task-detail-modal>
  `
})
export class CalendarPageComponent implements OnInit {
    readonly Calendar = Calendar;
    readonly ChevronLeft = ChevronLeft;
    readonly ChevronRight = ChevronRight;
    readonly Plus = Plus;

    selectedTask: Task | null = null;

    currentDate = new Date();
    days: number[] = [];
    emptyStartDays: number[] = [];
    emptyEndDays: number[] = [];
    currentMonthLabel = '';
    
    tasks: any[] = [];
    tasksByDay: { [key: number]: any[] } = {};
    isLoading = false;

    showCreateTaskModal = false;
    defaultProject: any = null;
    defaultWorkspaceId: string = '';

    constructor(
        private taskService: TaskService,
        private projectService: ProjectService,
        private notificationService: NotificationApiService
    ) {}

    ngOnInit() {
        this.updateCalendar();
        this.loadTasks();
        this.loadDefaultProject();

        // Real-time updates
        this.notificationService.notifications$.subscribe(() => {
            this.loadTasks();
        });
    }

    loadDefaultProject() {
        this.projectService.projects$.subscribe({
            next: (projects) => {
                if (projects.length > 0) {
                    this.defaultProject = projects[0];
                    this.defaultWorkspaceId = this.defaultProject.attributes.workspace_id.toString();
                    console.log('Default project loaded for calendar:', this.defaultProject);
                }
            },
            error: (err) => console.error('Error loading projects for calendar', err)
        });
    }
    
    updateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        this.currentMonthLabel = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

        this.days = Array.from({length: daysInMonth}, (_, i) => i + 1);
        this.emptyStartDays = Array.from({length: startDayOfWeek}, (_, i) => i);
        
        // Calculate end padding (optional, keeps grid square)
        const totalCells = startDayOfWeek + daysInMonth;
        const remainingCells = 42 - totalCells; // 6 rows * 7 cols
        this.emptyEndDays = Array.from({length: Math.max(0, remainingCells)}, (_, i) => i);
    }

    loadTasks() {
        this.isLoading = true;
        // Fetch tasks for the broad range (e.g., this month)
        // For simplicity, fetching all tasks and filtering client-side for now
        // Ideally, backend supports date range filtering
        this.taskService.getAllTasks({ 
            sort_by: 'due_date' 
        }).subscribe({
            next: (tasks: Task[]) => {
                this.tasks = tasks;
                this.mapTasksToDays();
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error loading tasks', err);
                this.isLoading = false;
            }
        });
    }

    mapTasksToDays() {
        this.tasksByDay = {};
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();

        this.tasks.forEach(task => {
            if (task.due_date) {
                const date = new Date(task.due_date);
                if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                    const day = date.getDate();
                    if (!this.tasksByDay[day]) {
                        this.tasksByDay[day] = [];
                    }
                    this.tasksByDay[day].push(task);
                }
            }
        });
    }

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.currentDate = new Date(this.currentDate); // limit mutation issues
        this.updateCalendar();
        this.mapTasksToDays(); // Re-map existing tasks for new view (if we had range fetch, we'd fetch again)
        this.loadTasks(); // Refetch to be safe/correct
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.currentDate = new Date(this.currentDate);
        this.updateCalendar();
        this.mapTasksToDays();
        this.loadTasks();
    }
    
    selectedDate: string | null = null;
    
    openCreateTaskModal(day?: number) {
        if (day) {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth() + 1; // 1-indexed
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            this.selectedDate = formattedDate;
        } else {
            // Default to today if creating from header button
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            this.selectedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        }
        this.showCreateTaskModal = true;
    }

    closeCreateTaskModal() {
        this.showCreateTaskModal = false;
        this.selectedDate = null;
    }

    handleTaskCreated(task: any) {
        this.closeCreateTaskModal();
        this.loadTasks();
    }

    openTaskDetail(task: Task) {
        this.selectedTask = task;
    }

    closeTaskDetail() {
        this.selectedTask = null;
        this.loadTasks(); // Refresh to catch any updates made in the modal
    }
}
