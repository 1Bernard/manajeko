import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-create-workspace-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Background backdrop -->
      <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity"></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button type="button" (click)="close.emit()" class="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 class="text-base font-semibold leading-6 text-slate-900" id="modal-title">Create new workspace</h3>
                <div class="mt-2">
                  <p class="text-sm text-slate-500">Create a new workspace to organize your projects and collaborate with your team.</p>
                  
                  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mt-4 space-y-4">
                    <div>
                      <label for="name" class="block text-sm font-medium leading-6 text-slate-900">Workspace Name</label>
                      <div class="mt-2">
                        <input 
                          type="text" 
                          id="name" 
                          formControlName="name"
                          class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="e.g. Acme Corp"
                        >
                      </div>
                    </div>

                    <div>
                      <label for="description" class="block text-sm font-medium leading-6 text-slate-900">Description (Optional)</label>
                      <div class="mt-2">
                        <textarea 
                          id="description" 
                          formControlName="description"
                          rows="3" 
                          class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        ></textarea>
                      </div>
                    </div>

                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button 
                        type="submit" 
                        [disabled]="form.invalid || isLoading"
                        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                      >
                        {{ isLoading ? 'Creating...' : 'Create Workspace' }}
                      </button>
                      <button 
                        type="button" 
                        (click)="close.emit()"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CreateWorkspaceModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() create = new EventEmitter<{ name: string; description: string }>();

    form: FormGroup;
    isLoading = false;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    onSubmit() {
        if (this.form.valid) {
            this.isLoading = true;
            this.create.emit(this.form.value);
        }
    }
}
