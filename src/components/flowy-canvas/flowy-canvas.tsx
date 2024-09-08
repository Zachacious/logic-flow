import interact from '@interactjs/interact';
import { Component, Host, Prop, h, Element, State, Watch } from '@stencil/core';
import { Point } from '../../types/Point';

@Component({
  tag: 'flowy-canvas',
  styleUrl: 'flowy-canvas.css',
  shadow: false,
})
export class FlowyCanvas {
  @Element() el: HTMLElement;

  @Prop() renderGrid: boolean = true;
  @Prop() gridSize: number = 20;
  @Prop() gridBgColor: string = '#f3f3f3';
  @Prop() gridLineColor: string = '#555555';
  @Prop() maxZoom: number = 5;
  @Prop() minZoom: number = 0.1;
  @Prop() zoomSpeed: number = 0.05;

  @State() zoom: number = 1;
  @State() lastZoom: number = 1;
  @State() initialPinchDistance: number = 0;
  @State() pan: Point = { x: 0, y: 0 };
  @State() isDragging: boolean = false;
  @State() dragStart: Point = { x: 0, y: 0 };

  // initialize the grid by adding css to the host element
  componentDidLoad() {
    const canvasEl = this.el.querySelector('.flowy-canvas') as HTMLElement;
    // if (this.renderGrid) {
    //   canvasEl.style.background = ` conic-gradient(from 90deg at 1px 1px, ${this.gridBgColor} 90deg, ${this.gridLineColor} 0) 0 0/${this.gridSize}px ${this.gridSize}px`;
    // }
    this.renderGridLines();

    // use interact js
    // const interactGrid = interact('.flowy-canvas');
    this.initialPinchDistance = 0;
    this.lastZoom = this.zoom;

    // setup event listeners
    // const canvasEl = this.el.querySelector('.flowy-virtual-area') as HTMLElement;
    canvasEl.addEventListener('mousedown', e => this.onPointerDown(e));
    canvasEl.addEventListener('touchstart', e => this.handleTouch(e, e => this.onPointerDown(e)));
    canvasEl.addEventListener('mouseup', () => this.onPointerUp());
    canvasEl.addEventListener('touchend', () => this.onPointerUp());
    canvasEl.addEventListener('mousemove', e => this.onPointerMove(e));
    canvasEl.addEventListener('touchmove', e => this.handleTouch(e, e => this.onPointerMove(e)));
    canvasEl.addEventListener('wheel', e => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom + this.zoomSpeed));
      }
      if (e.deltaY > 0) {
        this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom - this.zoomSpeed));
      }

      const contentEl = this.el.querySelector('.flowy-content') as HTMLElement;
      // adjust pan to keep the same point under the cursor
      const canvasRect = contentEl.getBoundingClientRect();
      const canvasCenter = { x: canvasRect.width / 2, y: canvasRect.height / 2 };
      // cursor delta from center
      const cursorDelta = {
        x: e.clientX - canvasCenter.x,
        y: e.clientY - canvasCenter.y,
      };

      // const zoomFactor = this.zoomSpeed;

      // adjust pan

      if (e.deltaY < 0) {
        this.pan = {
          x: this.pan.x - cursorDelta.x * this.zoomSpeed,
          y: this.pan.y - cursorDelta.y * this.zoomSpeed,
        };
      }
      if (e.deltaY > 0) {
        this.pan = {
          x: this.pan.x + cursorDelta.x,
          y: this.pan.y + cursorDelta.y,
        };
      }

      this.adjustZoom(e.deltaY * this.zoomSpeed, 0);
      this.lastZoom = this.zoom;
    });
  }

  renderGridLines() {
    if (this.renderGrid) {
      // const canvasEl = this.el.querySelector('.flowy-canvas') as HTMLElement;
      // canvasEl.style.background = ` conic-gradient(from 90deg at 1px 1px, ${this.gridBgColor} 90deg, ${this.gridLineColor} 0) 0 0/${this.gridSize * -this.zoom}px ${
      //   this.gridSize * -this.zoom
      // }px`;

      const canvasEl = this.el.querySelector('.flowy-grid') as HTMLCanvasElement;
      const ctx = canvasEl.getContext('2d');
      const width = window.innerWidth;
      const height = window.innerHeight;
      const step = this.gridSize * this.zoom;

      canvasEl.width = width;
      canvasEl.height = height;

      ctx.strokeStyle = this.gridLineColor;
      ctx.lineWidth = 1;

      // clear
      ctx.clearRect(0, 0, width, height);
      // fill bg color
      ctx.fillStyle = this.gridBgColor;
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      for (let x = this.pan.x * this.zoom; x <= width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      for (let xleft = this.pan.x * this.zoom; xleft >= -width; xleft -= step) {
        ctx.moveTo(xleft, 0);
        ctx.lineTo(xleft, height);
      }

      for (let y = this.pan.y * this.zoom; y <= height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      for (let ytop = this.pan.y * this.zoom; ytop >= -height; ytop -= step) {
        ctx.moveTo(0, ytop);
        ctx.lineTo(width, ytop);
      }

      ctx.stroke();
    }
  }

  updateScreen() {
    this.renderGridLines();
    const contentEl = this.el.querySelector('.flowy-content') as HTMLElement;
    contentEl.style.transform = `scale(${this.zoom}) translate(${this.pan.x}px, ${this.pan.y}px)`;
  }

  @Watch('zoom')
  zoomChanged() {
    this.updateScreen();
  }

  @Watch('pan')
  panChanged() {
    this.updateScreen();
  }

  // get location from event data for mouse or touch
  getEventLocation(event: MouseEvent | TouchEvent) {
    if (event instanceof TouchEvent) {
      if (event.touches && event.touches[0]) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
    } else {
      return { x: event.clientX, y: event.clientY };
    }
  }

  onPointerDown(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    const loc = this.getEventLocation(event);
    this.dragStart = { x: loc.x / this.zoom - this.pan.x, y: loc.y / this.zoom - this.pan.y };
  }

  onPointerUp() {
    this.isDragging = false;
    this.initialPinchDistance = 0;
    this.lastZoom = this.zoom;
  }

  onPointerMove(event: MouseEvent | TouchEvent) {
    if (this.isDragging) {
      const loc = this.getEventLocation(event);
      this.pan = { x: loc.x / this.zoom - this.dragStart.x, y: loc.y / this.zoom - this.dragStart.y };
    }
  }

  handleTouch(event: TouchEvent, singleTouchHandler: (touch: TouchEvent) => void) {
    if (event.touches.length === 1) {
      singleTouchHandler(event);
    } else if (event.type === 'touchmove' && event.touches.length === 2) {
      this.isDragging = false;
      this.handlePinch(event);
    }
  }

  handlePinch(event: TouchEvent) {
    event.preventDefault();

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt((touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2);
    if (this.initialPinchDistance === 0) {
      this.initialPinchDistance = distance;
    } else {
      this.adjustZoom(0, distance / this.initialPinchDistance);
    }
    // const newZoom = this.lastZoom * (distance / this.initialPinchDistance);
    // this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, newZoom));
  }

  adjustZoom(amount: number, scale: number) {
    if (!this.isDragging) {
      if (amount !== 0) {
      } else if (scale !== 1) {
        this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom - scale));
      }
    }
  }

  render() {
    return (
      <Host>
        {/* <div class="flowy-virtual-area"> */}
        <div class="flowy-canvas">
          <canvas class="flowy-grid"></canvas>
          <div class="flowy-content">
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
