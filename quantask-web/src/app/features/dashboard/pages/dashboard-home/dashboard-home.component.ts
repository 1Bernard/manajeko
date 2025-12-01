import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  UserPlus, ChevronRight, Star, TrendingUp, MoreHorizontal,
  Plus, FileText, Settings, Activity, Clock
} from 'lucide-angular';
import { CreateTaskModalComponent } from '../../../../shared/components/create-task-modal/create-task-modal.component';
import { CreateProjectModalComponent } from '../../../../shared/components/create-project-modal/create-project-modal.component';
import { AuthService, User } from '../../../../core/services/auth.service';
import { AnalyticsService, TaskStats, Activity as ActivityItem } from '../../../../core/services/analytics.service';
import { DonutChartComponent } from '../../../../shared/components/donut-chart/donut-chart.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CreateTaskModalComponent, DonutChartComponent, CreateProjectModalComponent],
  template: `
    <div class="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="mb-8 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Welcome back, {{ (currentUser$ | async)?.firstName || 'User' }}! 👋
          </h1>
          <p class="text-gray-500">Here's what's happening in your workspace today.</p>
        </div>
        <div class="text-right hidden sm:block">
           <p class="text-sm font-medium text-gray-900">{{ currentDate | date:'fullDate' }}</p>
        </div>
      </div>

      <!-- Bento Grid (Show if user has tasks) -->
      <div *ngIf="(stats$ | async)?.total! > 0; else onboarding" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
          
          <!-- 1. Main Stats Card (Wide) -->
          <div class="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200">
             <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
             <div class="relative z-10 flex flex-col h-full justify-between">
                <div class="flex justify-between items-start">
                   <div>
                      <h3 class="text-indigo-100 font-medium mb-1">Project Status</h3>
                      <h2 class="text-3xl font-bold">Craftboard Launch</h2>
                   </div>
                   <div class="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                      <lucide-icon [img]="TrendingUp" [size]="24" class="text-white"></lucide-icon>
                   </div>
                </div>
                
                <div class="flex gap-8 mt-6" *ngIf="stats$ | async as stats">
                   <div>
                      <p class="text-3xl font-bold">{{ getCompletionRate(stats) }}%</p>
                      <p class="text-xs text-indigo-200 uppercase tracking-wider font-semibold mt-1">Completion</p>
                   </div>
                   <div>
                      <p class="text-3xl font-bold">{{ stats.highPriority }}</p>
                      <p class="text-xs text-indigo-200 uppercase tracking-wider font-semibold mt-1">High Priority</p>
                   </div>
                   <div>
                      <p class="text-3xl font-bold">{{ stats.total }}</p>
                      <p class="text-xs text-indigo-200 uppercase tracking-wider font-semibold mt-1">Total Tasks</p>
                   </div>
                </div>
             </div>
          </div>

          <!-- 2. Task Distribution (Square) -->
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center relative group hover:shadow-md transition-all">
             <h3 class="text-gray-900 font-bold mb-4 self-start w-full flex justify-between">
                 Workload
                 <lucide-icon [img]="MoreHorizontal" [size]="16" class="text-gray-400 cursor-pointer"></lucide-icon>
             </h3>
             <div class="w-32 h-32 relative">
               <app-donut-chart [data]="chartData"></app-donut-chart>
             </div>
             <div class="flex gap-2 mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-green-500"></div> Done</span>
                <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-blue-500"></div> In Prog</span>
             </div>
          </div>

          <!-- 3. Quick Actions (Square) -->
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
             <h3 class="text-gray-900 font-bold">Quick Actions</h3>
             <div class="grid grid-cols-2 gap-3 mt-2">
                <button (click)="openCreateTaskModal()" class="bg-indigo-50 text-indigo-600 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
                    <lucide-icon [img]="Plus" [size]="20"></lucide-icon>
                    <span class="text-xs font-bold">New Task</span>
                </button>
                <button class="bg-green-50 text-green-600 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
                    <lucide-icon [img]="UserPlus" [size]="20"></lucide-icon>
                    <span class="text-xs font-bold">Invite Team</span>
                </button>
                <button class="bg-orange-50 text-orange-600 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
                    <lucide-icon [img]="FileText" [size]="20"></lucide-icon>
                    <span class="text-xs font-bold">Report</span>
                </button>
                <button class="bg-gray-50 text-gray-600 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
                    <lucide-icon [img]="Settings" [size]="20"></lucide-icon>
                    <span class="text-xs font-bold">Settings</span>
                </button>
             </div>
          </div>

          <!-- 4. Recent Activity (Tall) -->
          <div class="md:col-span-1 lg:row-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
             <h3 class="text-gray-900 font-bold mb-4 flex items-center gap-2">
                 <lucide-icon [img]="Activity" [size]="18" class="text-indigo-500"></lucide-icon> Activity Feed
             </h3>
             <div class="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
                 <div *ngFor="let act of activities$ | async" class="flex gap-3 relative">
                     <div class="absolute left-[14px] top-8 bottom-[-20px] w-0.5 bg-gray-100 last:hidden"></div>
                     <img [src]="act.user.avatar" [alt]="act.user.name" class="w-8 h-8 rounded-full object-cover border-2 border-white" />
                     <div>
                         <p class="text-sm text-gray-600 leading-snug">
                             <span class="font-bold text-gray-900">{{ act.user.name.split(' ')[0] }}</span> {{ act.action }} <span class="text-indigo-600 font-medium">{{ act.target }}</span>
                         </p>
                         <p class="text-xs text-gray-400 mt-1">{{ act.time }}</p>
                     </div>
                 </div>
             </div>
             <button class="mt-4 w-full py-2 text-sm text-gray-500 font-medium hover:text-indigo-600 border-t border-gray-50 pt-3">View All Activity</button>
          </div>

          <!-- 5. Upcoming Deadlines (Wide) -->
          <div class="md:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
             <div class="flex justify-between items-center mb-4">
                 <h3 class="text-gray-900 font-bold flex items-center gap-2">
                     <lucide-icon [img]="Clock" [size]="18" class="text-orange-500"></lucide-icon> Upcoming Deadlines
                 </h3>
                 <button class="text-xs text-gray-400 hover:text-gray-600">See all</button>
             </div>
             <div class="space-y-3">
                 <!-- Mock Data for Deadlines -->
                 <div *ngFor="let task of upcomingTasks" (click)="navigateToProject()" class="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-200 cursor-pointer transition-colors">
                     <div class="flex items-center gap-3">
                         <div class="w-1 h-8 rounded-full" [ngClass]="{'bg-red-500': task.priority === 'High', 'bg-blue-500': task.priority !== 'High'}"></div>
                         <div>
                             <h4 class="font-bold text-sm text-gray-900">{{ task.title }}</h4>
                             <p class="text-xs text-gray-500">{{ task.date }}</p>
                         </div>
                     </div>
                     <div class="flex items-center gap-3">
                         <div class="flex -space-x-2">
                             <img *ngFor="let assignee of task.assignees" [src]="assignee.avatar" class="w-6 h-6 rounded-full border-2 border-white" />
                         </div>
                         <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100">
                           Dashboard
                         </span>
                     </div>
                 </div>
             </div>
          </div>

          <!-- 6. Motivation/Tip (Small) -->
          <div class="bg-[#1C1D22] rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg">
              <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <lucide-icon [img]="Star" [size]="20" class="text-yellow-400 fill-yellow-400"></lucide-icon>
              </div>
              <div>
                  <p class="text-lg font-bold mb-2">"Focus on being productive instead of busy."</p>
                  <p class="text-xs text-gray-400">- Tim Ferriss</p>
              </div>
          </div>

      </div>

      <!-- Onboarding State (Show if no tasks) -->
      <ng-template #onboarding>
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-800">Try things out</h2>
            <button class="text-indigo-600 text-sm font-medium hover:underline">View all guides</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
           <!-- Card 1 -->
           <div class="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col group">
             <div class="w-full h-32 bg-indigo-50 rounded-t-2xl flex items-center justify-center relative overflow-hidden group">
                 <div class="absolute inset-0 bg-indigo-100/50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                 <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                     <lucide-icon [img]="UserPlus" class="text-indigo-500" [size]="24"></lucide-icon>
                 </div>
                 <div class="absolute w-32 h-2 bg-white rounded-full bottom-6 opacity-50"></div>
                 <div class="absolute w-20 h-2 bg-white rounded-full bottom-3 opacity-30"></div>
             </div>
             <div class="p-6 flex-1 flex flex-col">
                 <div class="inline-flex items-center gap-1.5 self-start bg-gray-50 px-2.5 py-1 rounded-md text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-4 border border-gray-100">
                   <lucide-icon [img]="Star" [size]="10" class="fill-indigo-500 text-indigo-500"></lucide-icon> 1 Min • Non-technical
                 </div>
                 <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Set up your profile</h3>
                 <p class="text-sm text-gray-500 mb-8 leading-relaxed flex-1">Add your profile picture, job title, and contact details to help your team know you better.</p>
                 <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                   <button class="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-indigo-600 transition-colors uppercase tracking-wide">
                     Learn more <lucide-icon [img]="ChevronRight" [size]="12"></lucide-icon>
                   </button>
                   <button (click)="router.navigate(['/dashboard/profile'])" class="bg-[#1C1D22] text-white text-xs px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-gray-200">
                     Settings
                   </button>
                 </div>
             </div>
           </div>

           <!-- Card 2 -->
           <div class="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col group">
             <div class="w-full h-32 bg-blue-50 rounded-t-2xl flex items-center justify-center p-6 relative overflow-hidden group">
                 <div class="absolute inset-0 bg-blue-100/50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                 <div class="bg-white w-full h-full rounded-lg shadow-sm p-4 relative z-10 transform group-hover:-translate-y-1 transition-transform">
                   <div class="h-3 w-1/3 bg-blue-100 rounded mb-3"></div>
                   <div class="space-y-2">
                       <div class="h-2 w-full bg-gray-50 rounded"></div>
                       <div class="h-2 w-5/6 bg-gray-50 rounded"></div>
                       <div class="h-2 w-4/6 bg-gray-50 rounded"></div>
                   </div>
                 </div>
             </div>
             <div class="p-6 flex-1 flex flex-col">
                 <div class="inline-flex items-center gap-1.5 self-start bg-gray-50 px-2.5 py-1 rounded-md text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-4 border border-gray-100">
                   <lucide-icon [img]="Star" [size]="10" class="fill-indigo-500 text-indigo-500"></lucide-icon> 2 Min • Technical
                 </div>
                 <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Create your first page</h3>
                 <p class="text-sm text-gray-500 mb-8 leading-relaxed flex-1">Start a new project or document. Choose from templates to get started quickly.</p>
                 <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                   <button class="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-indigo-600 transition-colors uppercase tracking-wide">
                     Learn more <lucide-icon [img]="ChevronRight" [size]="12"></lucide-icon>
                   </button>
                   <button (click)="openCreateProjectModal()" class="bg-[#1C1D22] text-white text-xs px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-gray-200">
                     Create Page
                   </button>
                 </div>
             </div>
           </div>

           <!-- Card 3 -->
           <div class="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col group">
             <div class="w-full h-32 bg-green-50 rounded-t-2xl flex items-center justify-center p-6 relative overflow-hidden group">
                 <div class="absolute inset-0 bg-green-100/50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                 <div class="bg-white w-3/4 h-12 rounded-xl shadow-sm flex items-center px-4 gap-3 relative z-10 transform group-hover:scale-105 transition-transform">
                   <div class="w-5 h-5 rounded-full border-2 border-green-400"></div>
                   <div class="h-2 w-24 bg-gray-100 rounded"></div>
                 </div>
             </div>
             <div class="p-6 flex-1 flex flex-col">
                 <div class="inline-flex items-center gap-1.5 self-start bg-gray-50 px-2.5 py-1 rounded-md text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-4 border border-gray-100">
                   <lucide-icon [img]="Star" [size]="10" class="fill-indigo-500 text-indigo-500"></lucide-icon> 5 Min • Optional
                 </div>
                 <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Create your first task</h3>
                 <p class="text-sm text-gray-500 mb-8 leading-relaxed flex-1">Break down your work into manageable tasks. Assign people, set due dates and priorities.</p>
                 <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                   <button class="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-indigo-600 transition-colors uppercase tracking-wide">
                     Learn more <lucide-icon [img]="ChevronRight" [size]="12"></lucide-icon>
                   </button>
                   <button class="bg-[#1C1D22] text-white text-xs px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-gray-200" (click)="openCreateTaskModal()">
                     Create Task
                   </button>
                 </div>
             </div>
           </div>
        </div>
      </ng-template>
    </div>

    <!-- Create Task Modal -->
    <app-create-task-modal 
      *ngIf="showCreateModal"
      [projectId]="1"
      [workspaceId]="'1'"
      (close)="closeCreateModal()"
      (taskCreated)="handleTaskCreated($event)"
    ></app-create-task-modal>

    <!-- Create Project Modal -->
    <app-create-project-modal
      *ngIf="showCreateProjectModal"
      [workspaceId]="'1'"
      (close)="closeCreateProjectModal()"
      (projectCreated)="handleProjectCreated($event)"
    ></app-create-project-modal>
  `
})
export class DashboardHomeComponent implements OnInit {
  // Icons
  readonly UserPlus = UserPlus;
  readonly ChevronRight = ChevronRight;
  readonly Star = Star;
  readonly TrendingUp = TrendingUp;
  readonly MoreHorizontal = MoreHorizontal;
  readonly Plus = Plus;
  readonly FileText = FileText;
  readonly Settings = Settings;
  readonly Activity = Activity;
  readonly Clock = Clock;

  showCreateModal = false;
  showCreateProjectModal = false;
  currentUser$: Observable<User | null>;
  stats$: Observable<TaskStats>;
  activities$: Observable<ActivityItem[]>;
  currentDate = new Date();

  chartData: { name: string; value: number; color: string }[] = [];

  // Mock upcoming tasks
  upcomingTasks = [
    {
      title: 'Employee Details',
      date: 'Feb 14, 2024',
      priority: 'Medium',
      assignees: [{ avatar: 'https://i.pravatar.cc/150?u=1' }, { avatar: 'https://i.pravatar.cc/150?u=2' }]
    },
    {
      title: 'Darkmode version',
      date: 'Feb 14, 2024',
      priority: 'Low',
      assignees: [{ avatar: 'https://i.pravatar.cc/150?u=2' }]
    },
    {
      title: 'Super Admin Role',
      date: 'Feb 14, 2024',
      priority: 'High',
      assignees: [{ avatar: 'https://i.pravatar.cc/150?u=2' }]
    }
  ];

  constructor(
    public router: Router,
    private authService: AuthService,
    private analyticsService: AnalyticsService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.stats$ = this.analyticsService.getTaskStats();
    this.activities$ = this.analyticsService.getRecentActivities();
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe();

    this.stats$.subscribe(stats => {
      this.chartData = [
        { name: 'Completed', value: stats.completed, color: '#22c55e' },
        { name: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
        { name: 'In Review', value: stats.inReview, color: '#f97316' },
        { name: 'To Do', value: stats.todo, color: '#94a3b8' }
      ].filter(d => d.value > 0);
    });
  }

  getCompletionRate(stats: TaskStats): number {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }

  openCreateTaskModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  handleTaskCreated(taskData: any): void {
    console.log('Task created:', taskData);
    this.router.navigate(['/dashboard/project', 1]);
  }

  openCreateProjectModal(): void {
    this.showCreateProjectModal = true;
  }

  closeCreateProjectModal(): void {
    this.showCreateProjectModal = false;
  }

  handleProjectCreated(project: any): void {
    console.log('Project created:', project);
    // Navigate to the newly created project
    if (project && project.data && project.data.id) {
      this.router.navigate(['/dashboard/project', project.data.id]);
    }
  }

  navigateToProject(): void {
    this.router.navigate(['/dashboard/project', 1]);
  }
}
