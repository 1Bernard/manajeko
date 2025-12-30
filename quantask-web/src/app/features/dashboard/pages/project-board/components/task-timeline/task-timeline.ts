import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, Clock, AlertCircle } from 'lucide-angular';
import { Task } from '../../../../../../core/services/task.service';
import { AvatarComponent } from '../../../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-task-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AvatarComponent],
  templateUrl: './task-timeline.html',
  styleUrls: ['./task-timeline.css']
})
export class TaskTimelineComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  @Output() taskClick = new EventEmitter<Task>();

  readonly Calendar = Calendar;

  timelineStart: Date = new Date();
  timelineEnd: Date = new Date();
  days: Date[] = [];
  taskBars: any[] = [];

  dayWidth = 60; // px
  headerHeight = 50; // px

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks'] && this.tasks) {
      this.calculateTimeline();
    }
  }

  calculateTimeline(): void {
    if (this.tasks.length === 0) return;

    // 1. Determine Range
    const dates = this.tasks.flatMap(t => {
      const d = [];
      if (t.start_date) d.push(new Date(t.start_date));
      if (t.due_date) d.push(new Date(t.due_date));
      if (!t.start_date && !t.due_date) d.push(new Date(t.created_at)); // Fallback
      return d;
    });

    if (dates.length === 0) {
      this.timelineStart = new Date();
      this.timelineEnd = new Date();
      this.timelineEnd.setDate(this.timelineEnd.getDate() + 7);
    } else {
      const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

      // Add buffer
      this.timelineStart = new Date(minDate);
      this.timelineStart.setDate(this.timelineStart.getDate() - 3);

      this.timelineEnd = new Date(maxDate);
      this.timelineEnd.setDate(this.timelineEnd.getDate() + 7);
    }

    // 2. Generate Days (Columns)
    this.days = [];
    const curr = new Date(this.timelineStart);
    while (curr <= this.timelineEnd) {
      this.days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    // 3. Generate Bars
    this.taskBars = this.tasks.map(task => {
      const startDate = task.start_date ? new Date(task.start_date) : new Date(task.created_at);
      const endDate = task.due_date ? new Date(task.due_date) : new Date(startDate);

      // Ensure End >= Start
      if (endDate < startDate) endDate.setTime(startDate.getTime());

      // Calculate position
      const diffStart = Math.ceil((startDate.getTime() - this.timelineStart.getTime()) / (1000 * 60 * 60 * 24));
      const diffDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1; // +1 to include full day

      return {
        task,
        left: diffStart * this.dayWidth,
        width: Math.max(diffDuration * this.dayWidth, this.dayWidth), // Min width 1 day
        colorClass: this.getPriorityColor(task.priority)
      };
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'urgent': return 'bg-red-600';
      case 'medium': return 'bg-orange-400';
      case 'low': return 'bg-blue-400';
      default: return 'bg-indigo-500';
    }
  }

  onTaskClick(task: Task): void {
    this.taskClick.emit(task);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
}
