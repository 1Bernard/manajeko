import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-reveal-on-scroll',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div #revealContainer
      [class]="'transition-all duration-1000 ease-out transform ' + (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10') + ' ' + className"
      [style.transitionDelay]="delay + 'ms'">
      <ng-content></ng-content>
    </div>
  `
})
export class RevealOnScrollComponent implements AfterViewInit, OnDestroy {
    @Input() className: string = '';
    @Input() delay: number = 0;
    @ViewChild('revealContainer') container!: ElementRef;

    isVisible = false;
    private observer!: IntersectionObserver;

    ngAfterViewInit() {
        this.observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    this.isVisible = true;
                    this.observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (this.container) {
            this.observer.observe(this.container.nativeElement);
        }
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
