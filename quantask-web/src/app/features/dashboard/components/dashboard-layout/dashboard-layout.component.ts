import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  LucideAngularModule,
  Search, Bell, Calendar, Settings, Plus, LayoutGrid,
  Table, List, Clock, Filter, MoreHorizontal, Paperclip,
  MessageSquare, ChevronDown, X, Share2, Star, ChevronLeft,
  ChevronRight, CheckCircle2, FileText, Image as ImageIcon,
  Shield, UserPlus, Send, Layout, Smartphone, CheckSquare,
  MoreVertical, Trash2, LogOut
} from 'lucide-angular';
import { AuthService } from '../../../../core/services/auth.service';
import { ProjectService, Project } from '../../../../core/services/project.service';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { Observable, map } from 'rxjs';
import { NotificationDropdownComponent } from '../../../../shared/components/notification-dropdown/notification-dropdown.component';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { GlobalSearchComponent } from '../../../../shared/components/global-search/global-search.component';
import { CreateProjectModalComponent } from '../../../../shared/components/create-project-modal/create-project-modal.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, GlobalSearchComponent, CreateProjectModalComponent, NotificationDropdownComponent],
  template: `
    <div class="flex h-screen bg-[#F8F9FB] font-sans text-slate-800 overflow-hidden">
      
      <!-- Sidebar -->
      <aside [class.w-[280px]]="sidebarOpen" [class.w-20]="!sidebarOpen" class="bg-white border-r border-gray-100 flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col h-full z-20">
        <!-- User Profile Dropdown -->
        <div class="p-4 border-b border-gray-50 mb-2">
          <div (click)="router.navigate(['/dashboard/profile'])" class="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <div class="w-10 h-10 bg-[#1C1D22] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-gray-200">
              <lucide-icon [img]="LayoutGrid" [size]="20"></lucide-icon>
            </div>
            <div *ngIf="sidebarOpen" class="flex-1 min-w-0 animate-in fade-in duration-300">
              <p class="text-sm font-bold text-gray-900 truncate">Manajeko.</p>
              <p class="text-xs text-gray-400 truncate">{{ (authService.currentUser$ | async)?.email }}</p>
            </div>
            <lucide-icon *ngIf="sidebarOpen" [img]="MoreVertical" [size]="16" class="text-gray-400"></lucide-icon>
          </div>
        </div>

        <!-- Main Menu -->
        <div class="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hide">
          <div>
            <h3 *ngIf="sidebarOpen" class="text-xs font-bold text-gray-400 mb-4 px-2 tracking-wider">MAIN MENU</h3>
            <nav class="space-y-1">
              <button *ngFor="let item of mainMenuItems" (click)="handleMenuClick(item)" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all group">
                <lucide-icon [img]="item.icon" [size]="20" class="group-hover:scale-105 transition-transform"></lucide-icon>
                <span *ngIf="sidebarOpen" class="text-sm font-medium flex-1 text-left animate-in fade-in slide-in-from-left-2 duration-300">{{ item.label }}</span>
                <span *ngIf="sidebarOpen && item.badge" class="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-bold">{{ item.badge }}</span>
              </button>
            </nav>
          </div>

          <div>
            <div *ngIf="sidebarOpen" class="flex items-center justify-between px-2 mb-4">
              <h3 class="text-xs font-bold text-gray-400 tracking-wider">MY PAGES</h3>
              <lucide-icon [img]="ChevronDown" [size]="14" class="text-gray-400 cursor-pointer hover:text-gray-600"></lucide-icon>
            </div>
            <nav class="space-y-1">
              <button (click)="router.navigate(['/dashboard'])" [class.bg-indigo-50]="isActiveRoute('/dashboard')" [class.text-indigo-600]="isActiveRoute('/dashboard')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group text-gray-500 hover:bg-gray-50">
                 <div class="w-6 h-6 rounded-md flex items-center justify-center bg-gray-100 group-hover:bg-white group-hover:shadow-sm transition-colors">
                    <lucide-icon [img]="LayoutGrid" [size]="12"></lucide-icon>
                 </div>
                 <span *ngIf="sidebarOpen" class="text-sm font-medium flex-1 text-left truncate animate-in fade-in slide-in-from-left-2 duration-300">Dashboard</span>
              </button>

              <ng-container *ngIf="projects$ | async as projects">
                <button 
                  *ngFor="let project of projects" 
                  (click)="navigateToProject(project.id)"
                  [class.bg-indigo-50]="isActiveProject(project.id)"
                  [class.text-indigo-600]="isActiveProject(project.id)"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group text-gray-500 hover:bg-gray-50"
                >
                  <div class="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                       [ngClass]="project.attributes.color || 'bg-gray-100 group-hover:bg-white group-hover:shadow-sm'">
                     <span class="text-xs font-bold" [class.text-white]="project.attributes.color">{{ project.attributes.name.charAt(0) }}</span>
                  </div>
                  <span *ngIf="sidebarOpen" class="text-sm font-medium flex-1 text-left truncate animate-in fade-in slide-in-from-left-2 duration-300">{{ project.attributes.name }}</span>
                </button>
              </ng-container>
              
              <button (click)="openCreateProjectModal()" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-gray-600 rounded-lg mt-4 border border-transparent hover:border-gray-200 hover:bg-white transition-all">
                <div class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md">
                    <lucide-icon [img]="Plus" [size]="14"></lucide-icon>
                </div>
                <span *ngIf="sidebarOpen" class="text-sm font-medium animate-in fade-in">Create New</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Security Banner -->
        <div *ngIf="sidebarOpen" class="p-4 mt-auto animate-in slide-in-from-bottom duration-500">
          <div class="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
             <button class="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition-colors"><lucide-icon [img]="X" [size]="14"></lucide-icon></button>
             <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
               <lucide-icon [img]="Shield" [size]="20"></lucide-icon>
             </div>
             <h4 class="text-sm font-bold text-gray-900 mb-1">Account Security</h4>
             <p class="text-xs text-gray-500 mb-4 leading-relaxed">Add a secondary method of verification.</p>
             <button class="w-full bg-[#1C1D22] text-white text-xs py-2.5 rounded-lg mb-2 font-medium hover:bg-black hover:shadow-lg transition-all">Enable 2FA</button>
          </div>
        </div>

        <!-- Logout Button - Positioned at bottom -->
        <div class="p-4 border-t border-gray-100 mt-auto">
          <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all group relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <lucide-icon [img]="LogOut" [size]="20" class="relative z-10 group-hover:text-red-600 transition-colors"></lucide-icon>
            <span *ngIf="sidebarOpen" class="relative z-10 text-sm font-medium flex-1 text-left group-hover:text-red-600 transition-colors">Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F8F9FB]">
        
        <!-- Top Header -->
        <header class="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0">
          <div class="flex items-center gap-4">
             <button (click)="toggleSidebar()" class="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-md transition-colors"><lucide-icon [img]="Layout" [size]="20"></lucide-icon></button>
             <div class="flex items-center text-gray-400 text-sm gap-3">
               <span class="text-gray-300">|</span>
               <span class="hover:text-gray-600 cursor-pointer transition-colors">My Pages</span>
               <lucide-icon [img]="ChevronRight" [size]="14"></lucide-icon>
               <span class="text-gray-800 font-semibold bg-gray-50 px-2 py-1 rounded-md">Dashboard</span>
             </div>
          </div>

          <div class="flex items-center gap-6">
              <button (click)="router.navigate(['/dashboard/profile'])" class="flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm font-medium px-4 py-2 hover:bg-indigo-50 rounded-xl transition-all group">
                  <ng-container *ngIf="authService.currentUser$ | async as user">
                      <img *ngIf="user.avatar || user.avatar_url; else topbarAvatarFallback" [src]="user.avatar || user.avatar_url" alt="Profile" class="w-6 h-6 rounded-full border border-gray-200 object-cover"/>
                      <ng-template #topbarAvatarFallback>
                          <div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[10px] border border-indigo-200">
                             {{ user.initials || 'U' }}
                          </div>
                      </ng-template>
                      <span>{{ user.firstName }}</span>
                  </ng-container>
              </button>
             <div class="h-6 w-px bg-gray-100"></div>
             <div class="flex items-center gap-1 text-gray-400">
               <div class="relative">
                 <button (click)="toggleNotifications($event)" class="p-2 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative" [class.bg-indigo-50]="showNotifications" [class.text-indigo-600]="showNotifications">
                   <lucide-icon [img]="Bell" [size]="20"></lucide-icon>
                   <span *ngIf="(unreadCount$ | async) as count" class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                   </span>
                 </button>
                 <!-- Dropdown -->
                 <app-notification-dropdown *ngIf="showNotifications" class="absolute right-0 top-full" (click)="$event.stopPropagation()"></app-notification-dropdown>
               </div>
               
               <button class="p-2 hover:text-yellow-400 hover:bg-yellow-50 rounded-full transition-colors"><lucide-icon [img]="Star" [size]="18"></lucide-icon></button>
               <button class="p-2 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><lucide-icon [img]="MoreHorizontal" [size]="18"></lucide-icon></button>
             </div>
          </div>
        </header>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden p-8 scroll-smooth">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Global Search Overlay -->
      <div *ngIf="isSearchVisible" 
           class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
           (click)="isSearchVisible = false">
        <div class="flex items-start justify-center pt-20 px-4"
             (click)="$event.stopPropagation()">
          <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-top-4 duration-300">
            <!-- Search Header -->
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <lucide-icon [img]="Search" [size]="24" class="text-indigo-600"></lucide-icon>
                <h2 class="text-xl font-bold text-gray-900">Search Everything</h2>
                <button (click)="isSearchVisible = false" 
                        class="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
                  <lucide-icon [img]="X" [size]="20"></lucide-icon>
                </button>
              </div>
            </div>
            
            <!-- Search Component -->
            <div class="p-6">
              <app-global-search (close)="isSearchVisible = false"></app-global-search>
            </div>
            
            <!-- Quick Tips -->
            <div class="px-6 pb-6 pt-2">
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <kbd class="px-2 py-1 bg-gray-100 rounded border border-gray-200 font-mono">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div class="flex items-center gap-1">
                  <kbd class="px-2 py-1 bg-gray-100 rounded border border-gray-200 font-mono">Enter</kbd>
                  <span>Select</span>
                </div>
                <div class="flex items-center gap-1">
                  <kbd class="px-2 py-1 bg-gray-100 rounded border border-gray-200 font-mono">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Project Modal -->
      <app-create-project-modal
        *ngIf="showCreateProjectModal"
        [workspaceId]="currentWorkspaceId"
        (close)="closeCreateProjectModal()"
        (projectCreated)="handleProjectCreated($event)"
      ></app-create-project-modal>
    </div>
  `
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  sidebarOpen = true;
  projects$: Observable<Project[]>;
  private popStateListener: (() => void) | null = null;

  readonly LayoutGrid = LayoutGrid;
  readonly MoreVertical = MoreVertical;
  readonly Search = Search;
  readonly Bell = Bell;
  readonly Calendar = Calendar;
  readonly Settings = Settings;
  readonly ChevronDown = ChevronDown;
  readonly Plus = Plus;
  readonly X = X;
  readonly Shield = Shield;
  readonly Layout = Layout;
  readonly ChevronRight = ChevronRight;
  readonly Star = Star;
  readonly Share2 = Share2;
  readonly MoreHorizontal = MoreHorizontal;
  readonly LogOut = LogOut;

  mainMenuItems = [
    { icon: Search, label: 'Search', action: 'search' },
    { icon: Bell, label: 'Notification', badge: '', route: '/dashboard/notifications' },
    { icon: Calendar, label: 'Calendar', route: '/dashboard/calendar' },
    { icon: Settings, label: 'Settings', route: '/dashboard/profile' }
  ];

  isSearchVisible = false;

  handleMenuClick(item: any) {
    if (item.action === 'search') {
      this.isSearchVisible = !this.isSearchVisible;
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  showCreateProjectModal = false;

  currentWorkspaceId: string = '';

  constructor(
    public authService: AuthService,
    private projectService: ProjectService,
    private workspaceService: WorkspaceService,
    private notificationService: NotificationApiService,
    public router: Router,
    private location: Location
  ) {
    this.projects$ = this.projectService.projects$;

    // Initialize currentWorkspaceId synchronously
    this.currentWorkspaceId = this.workspaceService.getCurrentWorkspaceId() || '';

    // Subscribe to current workspace to keep ID updated
    this.workspaceService.currentWorkspace$.subscribe(workspace => {
      if (workspace) {
        this.currentWorkspaceId = workspace.id;
      }
    });
  }

  // Notifications
  showNotifications = false;
  unreadCount$!: Observable<number>;

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
  }

  // Close notifications on click outside (will be handled by document listener if needed, but for now simple toggle)
  // Or better, add a document click listener to close

  ngOnInit() {
    this.unreadCount$ = this.notificationService.unreadCount$;

    // Prevent browser back/forward navigation from dashboard
    history.pushState(null, '', location.href);
    this.popStateListener = () => {
      history.pushState(null, '', location.href);
    };
    window.addEventListener('popstate', this.popStateListener);

    // Close notifications on outside click
    window.addEventListener('click', () => {
       if (this.showNotifications) this.showNotifications = false;
    });

    // Update sidebar badge
    this.notificationService.unreadCount$.subscribe(count => {
      const notifItem = this.mainMenuItems.find(i => i.label === 'Notification');
      if (notifItem) {
        notifItem.badge = count > 0 ? (count > 99 ? '99+' : count.toString()) : '';
      }
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    // Clean up listener before logout
    if (this.popStateListener) {
      window.removeEventListener('popstate', this.popStateListener);
    }
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/dashboard/project', projectId]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  isActiveProject(projectId: string): boolean {
    return this.router.url.includes(`/dashboard/project/${projectId}`);
  }

  openCreateProjectModal() {
    console.log('Opening Create Project Modal');
    this.showCreateProjectModal = true;
  }

  closeCreateProjectModal() {
    this.showCreateProjectModal = false;
  }

  handleProjectCreated(project: any) {
    console.log('Project created:', project);
    if (project && project.data && project.data.id) {
      this.router.navigate(['/dashboard/project', project.data.id]);
    }
  }

  ngOnDestroy() {
    // Clean up the popstate listener when component is destroyed
    if (this.popStateListener) {
      window.removeEventListener('popstate', this.popStateListener);
    }
  }
}
