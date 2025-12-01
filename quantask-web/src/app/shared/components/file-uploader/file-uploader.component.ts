import { Component, OnInit, OnDestroy, forwardRef, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, Upload, X, Crop, Trash2 } from 'lucide-angular';
import Cropper from 'cropperjs';
import Sortable from 'sortablejs';

interface FileWrapper {
    file: File;
    src: string;
    progress: number;
    complete: boolean;
}

@Component({
    selector: 'app-file-uploader',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileUploaderComponent),
            multi: true
        }
    ],
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
    @Input() accept = 'image/*';
    @Input() maxSize = 2 * 1024 * 1024; // 2MB default
    @Input() multiple = true;
    @Input() aspectRatio = 16 / 9;

    @ViewChild('fileListArea') fileListArea!: ElementRef;
    @ViewChild('imageToCrop') imageToCrop!: ElementRef<HTMLImageElement>;

    filesStore: FileWrapper[] = [];
    showCropModal = false;
    cropper: Cropper | null = null;
    currentCropFileIndex = -1;
    isDragging = false;

    readonly Upload = Upload;
    readonly X = X;
    readonly Crop = Crop;
    readonly Trash2 = Trash2;
    readonly Math = Math;

    private sortable: Sortable | null = null;
    private onChange: (files: File[]) => void = () => { };
    private onTouched: () => void = () => { };

    ngOnInit() { }

    ngAfterViewInit() {
        if (this.fileListArea) {
            this.initSortable();
        }
    }

    ngOnDestroy() {
        this.filesStore.forEach(fw => URL.revokeObjectURL(fw.src));
        if (this.cropper) {
            this.cropper.destroy();
        }
        if (this.sortable) {
            this.sortable.destroy();
        }
    }

    // ControlValueAccessor implementation
    writeValue(files: File[]): void {
        if (files && files.length > 0) {
            this.filesStore = [];
            files.forEach(file => this.addFile(file));
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // Initialize Sortable.js
    initSortable() {
        if (!this.fileListArea) return;

        this.sortable = new Sortable(this.fileListArea.nativeElement, {
            handle: '.drag-handle',
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            onEnd: (evt: any) => {
                const oldIndex = evt.oldIndex;
                const newIndex = evt.newIndex;

                const [movedItem] = this.filesStore.splice(oldIndex, 1);
                this.filesStore.splice(newIndex, 0, movedItem);

                this.emitFiles();
            }
        });
    }

    // File handling
    onFileInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.handleFiles(Array.from(input.files));
            input.value = '';
        }
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer?.files) {
            this.handleFiles(Array.from(event.dataTransfer.files));
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    handleFiles(files: File[]) {
        files.forEach(file => {
            if (this.validateFile(file)) {
                this.addFile(file);
            }
        });
    }

    validateFile(file: File): boolean {
        if (this.accept && !this.matchesAccept(file, this.accept)) {
            alert(`File type not allowed: ${file.type}`);
            return false;
        }
        if (file.size > this.maxSize) {
            alert(`File ${file.name} is too large (max ${this.bytesToSize(this.maxSize)}).`);
            return false;
        }
        return true;
    }

    matchesAccept(file: File, accept: string): boolean {
        // Accept all files if wildcard
        if (accept === '*' || accept === '*/*') {
            return true;
        }

        const acceptTypes = accept.split(',').map(t => t.trim());
        return acceptTypes.some(type => {
            if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            if (type.endsWith('/*')) {
                const mainType = type.split('/')[0];
                return file.type.startsWith(mainType);
            }
            return file.type === type;
        });
    }

    addFile(file: File) {
        const fileUrl = URL.createObjectURL(file);
        const fileWrapper: FileWrapper = {
            file,
            src: fileUrl,
            progress: 0,
            complete: false
        };

        this.filesStore.push(fileWrapper);
        this.simulateUpload(fileWrapper);
        this.emitFiles();
    }

    removeFile(index: number) {
        const fileWrapper = this.filesStore[index];
        URL.revokeObjectURL(fileWrapper.src);
        this.filesStore.splice(index, 1);
        this.emitFiles();
    }

    simulateUpload(fileWrapper: FileWrapper) {
        const interval = setInterval(() => {
            fileWrapper.progress += Math.random() * 20 + 10;
            if (fileWrapper.progress >= 100) {
                fileWrapper.progress = 100;
                fileWrapper.complete = true;
                clearInterval(interval);
            }
        }, 200);
    }

    // Cropping
    openCropModal(index: number) {
        const fileWrapper = this.filesStore[index];
        if (!fileWrapper.file.type.startsWith('image/')) {
            return; // Only crop images
        }

        this.currentCropFileIndex = index;
        this.showCropModal = true;

        setTimeout(() => {
            if (this.imageToCrop) {
                this.imageToCrop.nativeElement.src = fileWrapper.src;
                this.imageToCrop.nativeElement.onload = () => {
                    if (this.cropper) this.cropper.destroy();
                    this.cropper = new Cropper(this.imageToCrop.nativeElement, {
                        viewMode: 1,
                        autoCropArea: 1,
                        responsive: true,
                        guides: true,
                        center: true,
                        highlight: false,
                        background: true,
                    } as any);
                };
            }
        }, 100);
    }

    closeCropModal() {
        this.showCropModal = false;
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }
        this.currentCropFileIndex = -1;
    }

    confirmCrop() {
        if (!this.cropper || this.currentCropFileIndex === -1) {
            return;
        }

        const originalFileWrapper = this.filesStore[this.currentCropFileIndex];
        const canvas = (this.cropper as any).getCroppedCanvas({
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });

        if (!canvas) return;

        canvas.toBlob((blob: Blob | null) => {
            if (!blob) return;

            const originalFile = originalFileWrapper.file;

            const croppedFile = new File([blob], `cropped_${originalFile.name}`, {
                type: blob.type,
                lastModified: new Date().getTime(),
            });

            URL.revokeObjectURL(originalFileWrapper.src);
            const newFileUrl = URL.createObjectURL(croppedFile);

            originalFileWrapper.file = croppedFile;
            originalFileWrapper.src = newFileUrl;

            this.emitFiles();
            this.closeCropModal();
        }, originalFileWrapper.file.type || 'image/png', 0.9);
    }

    // Helpers
    emitFiles() {
        const files = this.filesStore.map(fw => fw.file);
        this.onChange(files);
        this.onTouched();
    }

    isImage(file: File): boolean {
        return file.type.startsWith('image/');
    }

    getFileTypeIcon(file: File): string {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';

        const iconMap: { [key: string]: string } = {
            'pdf': '📄',
            'doc': '📝',
            'docx': '📝',
            'xls': '📊',
            'xlsx': '📊',
            'csv': '📊',
            'ppt': '📽️',
            'pptx': '📽️',
            'txt': '📃',
            'zip': '📦',
            'rar': '📦',
            '7z': '📦',
        };

        return iconMap[ext] || '📎';
    }

    getFileTypeClass(file: File): string {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';

        const classMap: { [key: string]: string } = {
            'pdf': 'bg-red-50 text-red-600',
            'doc': 'bg-blue-50 text-blue-600',
            'docx': 'bg-blue-50 text-blue-600',
            'xls': 'bg-green-50 text-green-600',
            'xlsx': 'bg-green-50 text-green-600',
            'csv': 'bg-green-50 text-green-600',
            'ppt': 'bg-orange-50 text-orange-600',
            'pptx': 'bg-orange-50 text-orange-600',
            'txt': 'bg-gray-50 text-gray-600',
            'zip': 'bg-purple-50 text-purple-600',
            'rar': 'bg-purple-50 text-purple-600',
            '7z': 'bg-purple-50 text-purple-600',
        };

        return classMap[ext] || 'bg-gray-100 text-gray-400';
    }

    bytesToSize(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    }
}
