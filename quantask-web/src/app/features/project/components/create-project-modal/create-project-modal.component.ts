import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-create-project-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 class="text-base font-semibold leading-6 text-slate-900" id="modal-title">Create new project</h3>
                <div class="mt-2">
                  <p class="text-sm text-slate-500">Add a new project to your workspace to start tracking tasks.</p>
                  
                  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mt-4 space-y-4">
                    <div>
                      <label for="name" class="block text-sm font-medium leading-6 text-slate-900">Project Name</label>
                      <div class="mt-2">
                        <input 
                          type="text" 
                          id="name" 
                          formControlName="name"
                          class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="e.g. Website Redesign"
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

                    <div>
                      <label for="visibility" class="block text-sm font-medium leading-6 text-slate-900">Visibility</label>
                      <div class="mt-2">
                        <select 
                          id="visibility" 
                          formControlName="visibility"
                          class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option value="private">Private (Only members)</option>
                          <option value="public">Public (Entire workspace)</option>
                        </select>
                      </div>
                    </div>

                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button 
                        type="submit" 
                        [disabled]="form.invalid || isLoading"
                        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                      >
                        {{ isLoading ? 'Creating...' : 'Create Project' }}
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
export class CreateProjectModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() create = new EventEmitter<{ name: string; description: string; visibility: string }>();

    form: FormGroup;
    isLoading = false;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            visibility: ['private', Validators.required]
        });
    }

    onSubmit() {
        if (this.form.valid) {
            this.isLoading = true;
            this.create.emit(this.form.value);
        }
    }
}
