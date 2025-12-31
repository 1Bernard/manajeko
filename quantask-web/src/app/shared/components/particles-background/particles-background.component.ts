import { Component, ElementRef, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  clusterId: number;
}

@Component({
  selector: 'app-particles-background',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #particlesCanvas class="fixed inset-0 w-full h-full pointer-events-none opacity-60"></canvas>`,
  styles: [`
    canvas {
      z-index: 0;
    }
  `]
})
export class ParticlesBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('particlesCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private boids: Boid[] = [];
  private animationId!: number;
  private mouse = { x: -1000, y: -1000 };

  // Boids parameters
  private readonly numBoids = 150;
  private readonly numClusters = 5;
  private readonly visualRange = 100;
  private readonly minDistance = 25;
  private readonly centeringFactor = 0.004; // Reduced for slower motion
  private readonly avoidFactor = 0.04;     // Reduced for slower motion
  private readonly matchingFactor = 0.04;  // Reduced for slower motion
  private readonly speedLimit = 2;         // Significantly reduced from 5
  private readonly mouseInfluence = 0.0005; // Subtle attraction

  @HostListener('window:resize')
  onResize() {
    this.initCanvas();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.initCanvas();
    this.createBoids();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createBoids() {
    this.boids = [];
    for (let i = 0; i < this.numBoids; i++) {
      this.boids.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() * 2 - 1) * 2, // Slower initial burst
        vy: (Math.random() * 2 - 1) * 2,
        size: Math.random() * 1.5 + 1,
        clusterId: i % this.numClusters // Distribute into groups
      });
    }
  }

  private animate() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    for (let boid of this.boids) {
      this.updateBoid(boid);
      this.drawBoid(boid);
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private updateBoid(boid: Boid) {
    let centerX = 0, centerY = 0;
    let avgVX = 0, avgVY = 0;
    let closeDX = 0, closeDY = 0;
    let neighbors = 0;

    for (let other of this.boids) {
      if (other === boid) continue;

      let dx = boid.x - other.x;
      let dy = boid.y - other.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.visualRange) {
        // Only flock with same cluster
        if (other.clusterId === boid.clusterId) {
          centerX += other.x;
          centerY += other.y;
          avgVX += other.vx;
          avgVY += other.vy;
          neighbors++;
        }

        // Avoid everyone (prevents giant massing even across clusters)
        if (distance < this.minDistance) {
          closeDX += boid.x - other.x;
          closeDY += boid.y - other.y;
        }
      }
    }

    if (neighbors > 0) {
      centerX = centerX / neighbors;
      centerY = centerY / neighbors;
      avgVX = avgVX / neighbors;
      avgVY = avgVY / neighbors;

      // Cohesion & Alignment within cluster
      boid.vx += (centerX - boid.x) * this.centeringFactor;
      boid.vy += (centerY - boid.y) * this.centeringFactor;
      boid.vx += (avgVX - boid.vx) * this.matchingFactor;
      boid.vy += (avgVY - boid.vy) * this.matchingFactor;
    }

    // Separation (Global avoidance)
    boid.vx += closeDX * this.avoidFactor;
    boid.vy += closeDY * this.avoidFactor;

    // Mouse interaction (Subtle)
    let mdx = this.mouse.x - boid.x;
    let mdy = this.mouse.y - boid.y;
    let mDist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mDist < 300) {
      boid.vx += mdx * this.mouseInfluence;
      boid.vy += mdy * this.mouseInfluence;
    }

    // Screen bounds (Gentle turn)
    const margin = 150;
    const turnFactor = 0.5; // Reduced for smoother turns
    if (boid.x < margin) boid.vx += turnFactor;
    if (boid.x > window.innerWidth - margin) boid.vx -= turnFactor;
    if (boid.y < margin) boid.vy += turnFactor;
    if (boid.y > window.innerHeight - margin) boid.vy -= turnFactor;

    // Speed limit (Tighter)
    let speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
    if (speed > this.speedLimit) {
      boid.vx = (boid.vx / speed) * this.speedLimit;
      boid.vy = (boid.vy / speed) * this.speedLimit;
    }

    boid.x += boid.vx;
    boid.y += boid.vy;
  }

  private drawBoid(boid: Boid) {
    this.ctx.fillStyle = '#2D3748'; // Darker Slate (slate-800) for better visibility
    this.ctx.beginPath();
    this.ctx.arc(boid.x, boid.y, boid.size * 1.5, 0, Math.PI * 2); // Slightly larger
    this.ctx.fill();
  }
}
