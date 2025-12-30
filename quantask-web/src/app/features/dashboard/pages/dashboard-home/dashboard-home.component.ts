import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  UserPlus, ChevronRight, Star, TrendingUp, MoreHorizontal,
  Plus, FileText, Settings, Activity, Clock, Loader2
} from 'lucide-angular';
import { CreateTaskModalComponent } from '../../../../shared/components/create-task-modal/create-task-modal.component';
import { CreateProjectModalComponent } from '../../../../shared/components/create-project-modal/create-project-modal.component';
import { InviteMemberModalComponent } from '../../../../shared/components/invite-member-modal/invite-member-modal.component';
import { AuthService, User } from '../../../../core/services/auth.service';
import { AnalyticsService, TaskStats, Activity as ActivityItem } from '../../../../core/services/analytics.service';
import { Observable, combineLatest, map, startWith, catchError, of, shareReplay, BehaviorSubject, switchMap } from 'rxjs';
import { ProjectService } from '../../../../core/services/project.service';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { NgxEchartsModule } from 'ngx-echarts';

interface DashboardViewModel {
  currentUser: User | null;
  stats: TaskStats | null;
  activities: ActivityItem[];
  projectCount: number;
  upcomingTasks: any[];
  chartOptions: any;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule, 
    CreateTaskModalComponent, 
    CreateProjectModalComponent, 
    InviteMemberModalComponent,
    NgxEchartsModule
  ],
  template: `
    <div class="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <ng-container *ngIf="vm$ | async as vm">
        
        <!-- Header -->
        <div class="mb-8 flex justify-between items-end">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Welcome back, {{ vm.currentUser?.firstName || 'User' }}! 👋
            </h1>
            <p class="text-gray-500">Here's what's happening in your workspace today.</p>
          </div>
          <div class="text-right hidden sm:block">
             <p class="text-sm font-medium text-gray-900">{{ currentDate | date:'fullDate' }}</p>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="vm.loading" class="flex flex-col items-center justify-center h-96">
          <lucide-icon [img]="Loader2" [size]="48" class="text-indigo-600 animate-spin mb-4"></lucide-icon>
          <p class="text-gray-500 font-medium">Gathering your workspace insights...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="vm.error && !vm.loading" class="bg-red-50 border border-red-100 rounded-xl p-6 text-center mb-8">
          <p class="text-red-600 font-medium">{{ vm.error }}</p>
          <button (click)="retry()" class="mt-4 text-sm font-bold text-red-700 hover:underline">Try Again</button>
        </div>

        <!-- Content (Only show if not loading and no error) -->
        <ng-container *ngIf="!vm.loading && !vm.error">
          
          <!-- Bento Grid (Show if user has tasks) -->
          <div *ngIf="vm.stats && vm.stats.total > 0; else onboarding" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
              
              <!-- 1. Main Stats Card (Wide) -->
              <div class="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200">
                 <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                 <div class="relative z-10 flex flex-col h-full justify-between">
                    <div class="flex justify-between items-start">
                       <div>
                          <h3 class="text-indigo-100 font-medium mb-1">Project Status</h3>
                          <h2 class="text-3xl font-bold">Workspace Overview</h2>
                       </div>
                       <div class="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                          <lucide-icon [img]="TrendingUp" [size]="24" class="text-white"></lucide-icon>
                       </div>
                    </div>
                    
                    <div class="flex gap-8 mt-6">
                       <div>
                          <p class="text-3xl font-bold">{{ getCompletionRate(vm.stats!) }}%</p>
                          <p class="text-xs text-indigo-200 uppercase tracking-wider font-semibold mt-1">Completion</p>
                       </div>
                       <div>
                          <p class="text-3xl font-bold">{{ vm.stats!.highPriority }}</p>
                          <p class="text-xs text-indigo-200 uppercase tracking-wider font-semibold mt-1">High Priority</p>
                       </div>
                       <div>
                          <p class="text-3xl font-bold">{{ vm.stats!.total }}</p>
                          <p class="text-xs text-indigo-200 uppercase tracking-wider font-semibold mt-1">Total Tasks</p>
                       </div>
                    </div>
                 </div>
              </div>

              <!-- 2. Task Distribution (Square) - ECHARTS -->
              <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center relative group hover:shadow-md transition-all">
                 <h3 class="text-gray-900 font-bold mb-4 self-start w-full flex justify-between">
                     Workload
                     <lucide-icon [img]="MoreHorizontal" [size]="16" class="text-gray-400 cursor-pointer"></lucide-icon>
                 </h3>
                 <div class="w-full h-40 relative flex items-center justify-center">
                   <div *ngIf="vm.chartOptions" echarts [options]="vm.chartOptions" class="w-full h-full"></div>
                   <p *ngIf="!vm.chartOptions" class="text-gray-400 text-sm">No data available</p>
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
                    <button (click)="openInviteModal()" class="bg-green-50 text-green-600 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
                        <lucide-icon [img]="UserPlus" [size]="20"></lucide-icon>
                        <span class="text-xs font-bold">Invite Team</span>
                    </button>
                    <button (click)="openReport()" class="bg-orange-50 text-orange-600 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
                        <lucide-icon [img]="FileText" [size]="20"></lucide-icon>
                        <span class="text-xs font-bold">Report</span>
                    </button>
                    <button (click)="openSettings()" class="bg-gray-50 text-gray-600 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
                        <lucide-icon [img]="Settings" [size]="20"></lucide-icon>
                        <span class="text-xs font-bold">Settings</span>
                    </button>
                 </div>
              </div>

              <!-- 4. Activity Feed (Fixed Height & Scrollable) -->
              <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col h-[380px]">
                 <h3 class="text-gray-900 font-bold mb-4 flex items-center gap-2 flex-shrink-0">
                     <lucide-icon [img]="Activity" [size]="18" class="text-indigo-500"></lucide-icon> Activity Feed
                 </h3>
                 <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                     <div class="space-y-4">
                         <div *ngFor="let act of vm.activities" class="flex gap-4 items-start p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                             <img *ngIf="act.user.avatar; else initials" [src]="act.user.avatar" [alt]="act.user.name" class="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm flex-shrink-0" />
                             <ng-template #initials>
                                 <div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm border border-gray-100 flex-shrink-0" [style.background-color]="getAvatarColor(act.user.name)">
                                     {{ getInitials(act.user.name) }}
                                 </div>
                             </ng-template>
                             
                             <div class="flex-1 min-w-0">
                                 <p class="text-sm text-gray-600 leading-snug">
                                     <span class="font-bold text-gray-900">{{ act.user.name }}</span>
                                     <span class="text-gray-500"> {{ act.action }} </span>
                                     <span class="text-indigo-600 font-medium block truncate mt-0.5">{{ act.target }}</span>
                                 </p>
                                 <p class="text-[11px] text-gray-400 mt-1 font-medium">{{ act.time }}</p>
                             </div>
                         </div>
                         <div *ngIf="vm.activities.length === 0" class="text-center py-8 text-gray-400 text-sm">
                            No recent activity
                         </div>
                     </div>
                 </div>
                 <button class="mt-4 w-full py-3 text-sm text-gray-500 font-bold hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100 flex-shrink-0">View All Activity</button>
              </div>

              <!-- 5. Upcoming Deadlines (Wide) -->
              <div class="md:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col group hover:shadow-md transition-all">
                 <div class="flex justify-between items-center mb-4">
                     <h3 class="text-gray-900 font-bold flex items-center gap-2">
                         <lucide-icon [img]="Clock" [size]="18" class="text-orange-500"></lucide-icon> Upcoming Deadlines
                     </h3>
                     <button class="text-xs text-gray-400 hover:text-gray-600">See all</button>
                 </div>
                 <div class="space-y-3 flex-1">
                     <div *ngIf="vm.upcomingTasks.length === 0" class="text-center py-8 text-gray-400 text-sm">
                         No upcoming deadlines.
                     </div>
                     <div *ngFor="let task of vm.upcomingTasks" (click)="navigateToProject()" class="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-200 cursor-pointer transition-colors">
                         <div class="flex items-center gap-3">
                             <div class="w-1 h-8 rounded-full" [ngClass]="{'bg-red-500': task.priority === 'High', 'bg-blue-500': task.priority !== 'High'}"></div>
                             <div>
                                 <h4 class="font-bold text-sm text-gray-900">{{ task.title }}</h4>
                                 <p class="text-xs text-gray-500">{{ task.date }}</p>
                             </div>
                         </div>
                         <div class="flex items-center gap-3">
                             <div class="flex -space-x-2">
                                 <ng-container *ngFor="let assignee of task.assignees">
                                     <img *ngIf="assignee.avatar; else assigneeInitials" [src]="assignee.avatar" class="w-6 h-6 rounded-full border-2 border-white object-cover" [title]="assignee.name" />
                                     <ng-template #assigneeInitials>
                                         <div class="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-gray-700" [style.background-color]="getAvatarColor(assignee.name || 'User')" [title]="assignee.name || 'User'">
                                             {{ assignee.initials || 'U' }}
                                         </div>
                                     </ng-template>
                                 </ng-container>
                             </div>
                             <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100">
                               Task
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
               <!-- Card 1: Set up Profile -->
               <div class="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col group">
                 <div class="w-full h-32 bg-indigo-50 rounded-t-2xl flex items-center justify-center relative overflow-hidden group">
                     <div class="absolute inset-0 bg-indigo-100/50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                     <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                         <lucide-icon [img]="UserPlus" class="text-indigo-500" [size]="24"></lucide-icon>
                     </div>
                 </div>
                 <div class="p-6 flex-1 flex flex-col">
                     <div class="inline-flex items-center gap-1.5 self-start bg-gray-50 px-2.5 py-1 rounded-md text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-4 border border-gray-100">
                       <lucide-icon [img]="Star" [size]="10" class="fill-indigo-500 text-indigo-500"></lucide-icon> 1 Min • Non-technical
                     </div>
                     <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Set up your profile</h3>
                     <p class="text-sm text-gray-500 mb-8 leading-relaxed flex-1">Add your profile picture, job title, and contact details.</p>
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

               <!-- Card 2: Create Page (If no projects) -->
               <div *ngIf="vm.projectCount === 0" class="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col group">
                 <div class="w-full h-32 bg-blue-50 rounded-t-2xl flex items-center justify-center p-6 relative overflow-hidden group">
                     <div class="absolute inset-0 bg-blue-100/50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                     <div class="bg-white w-full h-full rounded-lg shadow-sm p-4 relative z-10 transform group-hover:-translate-y-1 transition-transform">
                       <div class="h-3 w-1/3 bg-blue-100 rounded mb-3"></div>
                       <div class="space-y-2">
                           <div class="h-2 w-full bg-gray-50 rounded"></div>
                           <div class="h-2 w-5/6 bg-gray-50 rounded"></div>
                       </div>
                     </div>
                 </div>
                 <div class="p-6 flex-1 flex flex-col">
                     <div class="inline-flex items-center gap-1.5 self-start bg-gray-50 px-2.5 py-1 rounded-md text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-4 border border-gray-100">
                       <lucide-icon [img]="Star" [size]="10" class="fill-indigo-500 text-indigo-500"></lucide-icon> 2 Min • Technical
                     </div>
                     <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Create your first page</h3>
                     <p class="text-sm text-gray-500 mb-8 leading-relaxed flex-1">Start a new project or document.</p>
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

               <!-- Card 3: Create Task (If has projects) -->
               <div *ngIf="vm.projectCount > 0" class="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col group">
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
                     <p class="text-sm text-gray-500 mb-8 leading-relaxed flex-1">Break down your work into manageable tasks.</p>
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

        </ng-container>
      </ng-container>
    </div>

    <!-- Modals -->
    <app-create-task-modal 
      *ngIf="showCreateModal"
      [projectId]="currentProjectId"
      [workspaceId]="currentWorkspaceId"
      (close)="closeCreateModal()"
      (taskCreated)="handleTaskCreated($event)"
    ></app-create-task-modal>

    <app-create-project-modal
      *ngIf="showCreateProjectModal"
      [workspaceId]="currentWorkspaceId"
      (close)="closeCreateProjectModal()"
      (projectCreated)="handleProjectCreated($event)"
    ></app-create-project-modal>

    <app-invite-member-modal
      *ngIf="showInviteModal"
      [workspaceId]="currentWorkspaceId"
      (close)="closeInviteModal()"
    ></app-invite-member-modal>
  `
})
export class DashboardHomeComponent implements OnInit {
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
  readonly Loader2 = Loader2;

  showCreateModal = false;
  showCreateProjectModal = false;
  showInviteModal = false;
  
  // ViewModel Observable
  vm$: Observable<DashboardViewModel>;
  
  // Triggers for retrying
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  currentDate = new Date();
  currentWorkspaceId: string = '';
  currentProjectId: number = 0;

  constructor(
    public router: Router,
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private projectService: ProjectService,
    private workspaceService: WorkspaceService
  ) {
    
    // Combine all data sources into a ViewModel
    this.vm$ = this.refreshTrigger$.pipe(
      switchMap(() => 
        combineLatest([
          this.authService.currentUser$,
          this.analyticsService.getTaskStats().pipe(
            startWith(null), 
            catchError(err => {
              console.error('Error fetching stats:', err);
              // Return null for stats but don't break the stream, let the component handle it or show error
              return of(null);
            })
          ),
          this.projectService.projects$.pipe(startWith([]))
        ]).pipe(
          map(([currentUser, stats, projects]) => {
            // Update local state derived from projects
            if (projects.length > 0) {
              this.currentProjectId = parseInt(projects[0].id);
            }
            
            // Prepare Chart Data
            let chartOptions = null;
            let upcomingTasks: any[] = [];
            let activities: ActivityItem[] = [];

            if (stats) {
               const data = [
                { name: 'Completed', value: stats.completed, itemStyle: { color: '#22c55e' } },
                { name: 'In Progress', value: stats.inProgress, itemStyle: { color: '#3b82f6' } },
                { name: 'In Review', value: stats.inReview, itemStyle: { color: '#f97316' } },
                { name: 'To Do', value: stats.todo, itemStyle: { color: '#94a3b8' } }
              ].filter(d => d.value > 0);

              chartOptions = {
                title: {
                  text: stats.total.toString(),
                  subtext: 'Tasks',
                  left: 'center',
                  top: 'center',
                  textStyle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
                  subtextStyle: { fontSize: 12, color: '#888' }
                },
                tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
                series: [{
                  name: 'Tasks',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false, position: 'center' },
                  data: data
                }]
              };

              upcomingTasks = stats.upcomingDeadlines.map((t: any) => ({
                title: t.title,
                date: new Date(t.due_date).toLocaleDateString(),
                priority: t.priority.charAt(0).toUpperCase() + t.priority.slice(1),
                assignees: t.assignees.map((a: any) => ({ 
                   avatar: a.avatar_url || null,
                   initials: a.initials || this.getInitials(a.full_name || a.first_name || 'User'),
                   name: a.full_name || a.first_name || 'User'
                }))
              }));
              
              activities = stats.recentActivities || [];
            }

            return {
              currentUser,
              stats,
              activities,
              projectCount: projects.length,
              upcomingTasks,
              chartOptions,
              loading: !stats, // Consider loading if stats are null (initial fetch)
              error: null      // We'll trust the catchError above for now, or enhance if needed
            };
          }),
          // Add a loading start state?
          // Since getTaskStats is cold, the startWith(null) handles the initial "stats are missing" state.
          // true loading state would be better with a dedicated merging strategy but this works for "wait for first emission"
        )
      ),
      shareReplay(1)
    );
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe();
    
    this.workspaceService.currentWorkspace$.subscribe(workspace => {
      if (workspace) {
        this.currentWorkspaceId = workspace.id;
        // Trigger generic refresh if needed, but projectService handles its own refresh on workspace change
        // and getTaskStats is called again because vm$ pipeline executes? 
        // No, getTaskStats is inside combineLatest. If checking for workspace changes, we might want to refetch stats.
        this.refresh();
      }
    });
  }

  refresh() {
    this.refreshTrigger$.next();
  }
  
  retry() {
    this.refresh();
  }

  getAvatarColor(name: string): string {
    const colors = ['#E0E7FF', '#D1FAE5', '#FEF3C7', '#FCE7F3', '#E0F2FE', '#FFEDD5'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  getInitials(name: string): string {
      if (!name) return 'U';
      return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  getCompletionRate(stats: TaskStats): number {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }

  openCreateTaskModal(): void { this.showCreateModal = true; }
  closeCreateModal(): void { this.showCreateModal = false; }
  handleTaskCreated(taskData: any): void {
    const projectId = taskData.project_id || this.currentProjectId;
    if (projectId) {
      this.refresh(); // Refresh stats after creation
      this.router.navigate(['/dashboard/project', projectId]);
    }
  }

  openCreateProjectModal(): void { this.showCreateProjectModal = true; }
  closeCreateProjectModal(): void { this.showCreateProjectModal = false; }
  handleProjectCreated(project: any): void {
    if (project && project.data && project.data.id) {
       this.refresh(); // Refresh dashboard state
      this.router.navigate(['/dashboard/project', project.data.id]);
    }
  }

  navigateToProject(): void {
    if (this.currentProjectId) {
      this.router.navigate(['/dashboard/project', this.currentProjectId]);
    }
  }

  openInviteModal(): void { this.showInviteModal = true; }
  closeInviteModal(): void { this.showInviteModal = false; }

  openSettings(): void { this.router.navigate(['/dashboard/profile']); }
  openReport(): void { alert('Reporting feature coming soon!'); }
}
