import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, UserPlus, Mail } from 'lucide-angular';
import { WorkspaceService } from '../../../core/services/workspace.service';

@Component({
    selector: 'app-invite-member-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" (click)="close.emit()">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <lucide-icon [img]="UserPlus" [size]="20" class="text-indigo-600"></lucide-icon>
            Invite Member
          </h2>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <lucide-icon [img]="X" [size]="20"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
          <p class="text-sm text-gray-500 mb-4">
            Invite a new member to your workspace. They will receive an email invitation.
          </p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div class="relative">
                <lucide-icon [img]="Mail" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></lucide-icon>
                <input 
                  type="email" 
                  [(ngModel)]="email" 
                  placeholder="colleague@example.com"
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  [disabled]="isLoading"
                />
              </div>
            </div>

            <div *ngIf="message" [class.text-green-600]="success" [class.text-red-600]="!success" class="text-sm font-medium">
              {{ message }}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button 
            (click)="close.emit()" 
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            [disabled]="isLoading">
            Cancel
          </button>
          <button 
            (click)="invite()" 
            [disabled]="!email || isLoading"
            class="px-6 py-2 bg-[#1C1D22] text-white text-sm font-bold rounded-lg hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <span *ngIf="isLoading">Sending...</span>
            <span *ngIf="!isLoading">Send Invite</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class InviteMemberModalComponent {
    @Input() workspaceId!: string;
    @Output() close = new EventEmitter<void>();

    email = '';
    isLoading = false;
    message = '';
    success = false;

    readonly X = X;
    readonly UserPlus = UserPlus;
    readonly Mail = Mail;

    constructor(private workspaceService: WorkspaceService) { }

    invite() {
        if (!this.email || !this.workspaceId) return;

        this.isLoading = true;
        this.message = '';

        this.workspaceService.inviteMember(this.workspaceId, this.email).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                this.success = true;
                this.message = response.message || 'Invitation sent successfully!';
                setTimeout(() => {
                    this.close.emit();
                }, 2000);
            },
            error: (error: any) => {
                this.isLoading = false;
                this.success = false;
                this.message = error.error?.error || 'Failed to send invitation.';
            }
        });
    }
}
