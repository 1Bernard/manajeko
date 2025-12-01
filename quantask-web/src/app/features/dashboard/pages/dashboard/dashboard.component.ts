import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from '../../../project/pages/project-list/project-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProjectListComponent],
  template: `
    <div class="space-y-6">
      <app-project-list></app-project-list>
    </div>
  `
})
export class DashboardComponent { }
