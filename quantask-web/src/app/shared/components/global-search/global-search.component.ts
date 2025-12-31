import { Component, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Search, X, FileText, Folder, User } from 'lucide-angular';
import { SearchService, SearchResult } from '../../../core/services/search.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-global-search',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
        <div class="relative" (clickOutside)="closeResults()">
            <div class="relative">
                <lucide-icon [img]="Search" [size]="18" 
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
                <input 
                    #searchInput
                    type="text" 
                    [(ngModel)]="query"
                    (ngModelChange)="onSearchChange($event)"
                    (focus)="showResults = true"
                    (keydown)="onKeyDown($event)"
                    placeholder="Search tasks, projects, people..."
                    class="w-full pl-12 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                />
                <button 
                    *ngIf="query"
                    (click)="clearSearch()"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <lucide-icon [img]="X" [size]="16"></lucide-icon>
                </button>
            </div>

            <!-- Results Dropdown -->
            <div *ngIf="showResults && (results || isLoading)" 
                class="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto z-50">
                
                <!-- Loading State -->
                <div *ngIf="isLoading" class="p-4 text-center text-gray-500">
                    <div class="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                    <p class="mt-2 text-sm">Searching...</p>
                </div>

                <!-- Results -->
                <div *ngIf="!isLoading && results">
                    <!-- No Results -->
                    <div *ngIf="results.total === 0" class="p-8 text-center text-gray-500">
                        <lucide-icon [img]="Search" [size]="32" class="mx-auto mb-2 opacity-20"></lucide-icon>
                        <p class="text-sm">No results found for "{{ query }}"</p>
                    </div>

                    <!-- Tasks -->
                    <div *ngIf="results.tasks && results.tasks.length > 0" class="border-b border-gray-100">
                        <div class="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Tasks ({{ results.tasks.length }})
                        </div>
                        <div *ngFor="let task of results.tasks; let i = index"
                            (click)="navigateToTask(task)"
                            [class.bg-indigo-50]="selectedIndex === getTaskIndex(i)"
                            class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                            <div class="flex items-start gap-3">
                                <lucide-icon [img]="FileText" [size]="16" class="text-gray-400 mt-0.5"></lucide-icon>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">{{ task.title }}</p>
                                    <p *ngIf="task.description" class="text-xs text-gray-500 truncate mt-0.5">{{ task.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Projects -->
                    <div *ngIf="results.projects && results.projects.length > 0" class="border-b border-gray-100">
                        <div class="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Projects ({{ results.projects.length }})
                        </div>
                        <div *ngFor="let project of results.projects; let i = index"
                            (click)="navigateToProject(project)"
                            [class.bg-indigo-50]="selectedIndex === getProjectIndex(i)"
                            class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                            <div class="flex items-start gap-3">
                                <lucide-icon [img]="Folder" [size]="16" class="text-gray-400 mt-0.5"></lucide-icon>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">{{ project.attributes.name }}</p>
                                    <p *ngIf="project.attributes.description" class="text-xs text-gray-500 truncate mt-0.5">{{ project.attributes.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Users -->
                    <div *ngIf="results.users && results.users.length > 0">
                        <div class="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            People ({{ results.users.length }})
                        </div>
                        <div *ngFor="let user of results.users; let i = index"
                            [class.bg-indigo-50]="selectedIndex === getUserIndex(i)"
                            class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                            <div class="flex items-start gap-3">
                                <!-- Avatar Logic -->
                                <img *ngIf="user.attributes.avatar_url; else searchInitials" 
                                     [src]="user.attributes.avatar_url" 
                                     class="w-8 h-8 rounded-full object-cover border border-gray-200" 
                                />
                                <ng-template #searchInitials>
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 border border-gray-100" 
                                         [style.background-color]="getAvatarColor(user.attributes.name)">
                                        {{ getInitials(user.attributes.name) }}
                                    </div>
                                </ng-template>

                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900">{{ user.attributes.name }}</p>
                                    <p class="text-xs text-gray-500 truncate mt-0.5">{{ user.attributes.email }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
    @ViewChild('searchInput') searchInput!: ElementRef;
    @Output() close = new EventEmitter<void>();

    query = '';
    results: SearchResult | null = null;
    showResults = false;
    isLoading = false;
    selectedIndex = 0;

    private searchSubject = new Subject<string>();

    readonly Search = Search;
    readonly X = X;
    readonly FileText = FileText;
    readonly Folder = Folder;
    readonly User = User;

    constructor(
        private searchService: SearchService,
        private router: Router
    ) { }

    ngOnInit() {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(query => {
                if (query.trim().length < 2) {
                    this.results = null;
                    this.isLoading = false;
                    return [];
                }
                this.isLoading = true;
                return this.searchService.globalSearch(query);
            })
        ).subscribe({
            next: (results) => {
                this.results = results;
                this.isLoading = false;
                this.selectedIndex = 0;
            },
            error: (err) => {
                console.error('Search error:', err);
                this.isLoading = false;
            }
        });
    }

    ngOnDestroy() {
        this.searchSubject.complete();
    }

    onSearchChange(query: string) {
        this.searchSubject.next(query);
    }

    clearSearch() {
        this.query = '';
        this.results = null;
        this.showResults = false;
    }

    closeResults() {
        this.showResults = false;
    }

    onKeyDown(event: KeyboardEvent) {
        if (!this.results) return;

        const totalItems = (this.results.tasks?.length || 0) +
            (this.results.projects?.length || 0) +
            (this.results.users?.length || 0);

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.selectedIndex = (this.selectedIndex + 1) % totalItems;
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.selectedIndex = (this.selectedIndex - 1 + totalItems) % totalItems;
        } else if (event.key === 'Enter') {
            event.preventDefault();
            this.selectItem(this.selectedIndex);
        } else if (event.key === 'Escape') {
            this.closeResults();
        }
    }

    selectItem(index: number) {
        const tasksCount = this.results?.tasks?.length || 0;
        const projectsCount = this.results?.projects?.length || 0;

        if (index < tasksCount) {
            this.navigateToTask(this.results!.tasks[index]);
        } else if (index < tasksCount + projectsCount) {
            this.navigateToProject(this.results!.projects[index - tasksCount]);
        }
    }

    getTaskIndex(i: number): number {
        return i;
    }

    getProjectIndex(i: number): number {
        return (this.results?.tasks?.length || 0) + i;
    }

    getUserIndex(i: number): number {
        return (this.results?.tasks?.length || 0) + (this.results?.projects?.length || 0) + i;
    }

    navigateToTask(task: any) {
        console.log('Navigating to task:', task);

        // Handle both snake_case (backend) and camelCase (frontend transformed) keys
        const projectId = task.project_id ||
            task.attributes?.project_id ||
            task.attributes?.projectId;

        if (!projectId) {
            console.error('No project_id found in task:', task);
            return;
        }

        this.router.navigate(['/dashboard/project', projectId]);
        this.closeResults();
        this.clearSearch();
        this.close.emit();
    }

    navigateToProject(project: any) {
        this.router.navigate(['/dashboard/project', project.id]);
        this.closeResults();
        this.clearSearch();
        this.close.emit();
    }

    getAvatarColor(name: string): string {
        const colors = ['#E0E7FF', '#D1FAE5', '#FEF3C7', '#FCE7F3', '#E0F2FE', '#FFEDD5']; // Pastel backgrounds
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    }

    getInitials(name: string): string {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }
}
