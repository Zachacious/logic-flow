import { Component, Host, Prop, h, Element, State, Watch } from '@stencil/core';
import { Point } from '../../types/Point';
import { debounce } from '../../utils/debounce';
import { throttle } from '../../utils/throttle';

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
  @State() pan: Point = { x: 0, y: 0 };
  private _lastZoom: number = 1;
  private _initialPinchDistance: number = 0;
  private _isDragging: boolean = false;
  private _dragStart: Point = { x: 0, y: 0 };

  private _canvasEl: HTMLDivElement;
  private _contentEl: HTMLDivElement;
  private _gridEl: HTMLCanvasElement;
  private _needsRedraw: boolean = false;

  private _resizeObserver: ResizeObserver;
  // Debounced version of the onResize method
  private _debouncedResize = debounce(() => this.onResize(), 200);

  componentDidLoad() {
    this._canvasEl = this.el.querySelector('.flowy-canvas') as HTMLDivElement;
    this._contentEl = this.el.querySelector('.flowy-content') as HTMLDivElement;
    this._gridEl = this.el.querySelector('.flowy-grid') as HTMLCanvasElement;

    const canvasEl = this._canvasEl;
    this.renderGridLines();

    this._initialPinchDistance = 0;
    this._lastZoom = this.zoom;

    // throttled mousemove event for performance
    const throttledPointerMove = throttle(e => this.onPointerMove(e), 30);
    const throttledTouchMove = throttle((e, fun) => this.handleTouch(e, fun(e)), 30);

    // setup event listeners
    // const canvasEl = this.el.querySelector('.flowy-virtual-area') as HTMLElement;
    canvasEl.addEventListener('mousedown', e => this.onPointerDown(e), { passive: true });
    canvasEl.addEventListener('touchstart', e => this.handleTouch(e, e => this.onPointerDown(e)), { passive: true });
    canvasEl.addEventListener('mouseup', () => this.onPointerUp(), { passive: true });
    canvasEl.addEventListener('touchend', () => this.onPointerUp(), { passive: true });
    canvasEl.addEventListener('mousemove', e => throttledPointerMove(e), { passive: true });
    canvasEl.addEventListener('touchmove', e => throttledTouchMove(e, (e: MouseEvent | TouchEvent) => this.onPointerMove(e)), { passive: true });
    canvasEl.addEventListener('wheel', e => this.handleWheel(e), { passive: false });

    // Handle resize events
    this._resizeObserver = new ResizeObserver(() => this._debouncedResize());
    this._resizeObserver.observe(this._canvasEl);
  }

  disconnectedCallback() {
    // Clean up resize observer
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }

    // Clean up event listeners
    const canvasEl = this._canvasEl;
    canvasEl.removeEventListener('mousedown', e => this.onPointerDown(e));
    canvasEl.removeEventListener('touchstart', e => this.handleTouch(e, e => this.onPointerDown(e)));
    canvasEl.removeEventListener('mouseup', () => this.onPointerUp());
    canvasEl.removeEventListener('touchend', () => this.onPointerUp());
    canvasEl.removeEventListener('mousemove', e => this.onPointerMove(e));
    canvasEl.removeEventListener('touchmove', e => this.handleTouch(e, e => this.onPointerMove(e)));
    canvasEl.removeEventListener('wheel', e => this.handleWheel(e));
  }

  // get canvasEl() {
  //   if (!this._canvasEl) {
  //     this._canvasEl = this.el.querySelector('.flowy-canvas') as HTMLDivElement;
  //   }
  //   return this._canvasEl;
  // }

  // get contentEl() {
  //   if (!this._contentEl) {
  //     this._contentEl = this.el.querySelector('.flowy-content') as HTMLDivElement;
  //   }
  //   return this._contentEl;
  // }

  // get gridEl() {
  //   if (!this._gridEl) {
  //     this._gridEl = this.el.querySelector('.flowy-grid') as HTMLCanvasElement;
  //   }
  //   return this._gridEl;
  // }

  @Watch('zoom')
  zoomChanged() {
    this._needsRedraw = true;
    this.updateScreen();
  }

  @Watch('pan')
  panChanged() {
    this._needsRedraw = true;
    this.updateScreen();
  }

  onResize() {
    this._needsRedraw = true;
    this.renderGridLines();
  }

  renderGridLines() {
    if (!this.renderGrid || !this._needsRedraw) return;
    // if (this.renderGrid) {
    // const canvasEl = this.el.querySelector('.flowy-grid') as HTMLCanvasElement;
    const canvasEl = this._gridEl;
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
    this._needsRedraw = false;
    // }
  }

  updateScreen() {
    // this.renderGridLines();
    const contentEl = this._contentEl;
    contentEl.style.transform = `scale(${this.zoom}) translate(${this.pan.x}px, ${this.pan.y}px)`;
    requestAnimationFrame(() => this.renderGridLines());
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
    this._isDragging = true;
    const loc = this.getEventLocation(event);
    this._dragStart = { x: loc.x / this.zoom - this.pan.x, y: loc.y / this.zoom - this.pan.y };
  }

  onPointerUp() {
    this._isDragging = false;
    this._initialPinchDistance = 0;
    this._lastZoom = this.zoom;
  }

  onPointerMove(event: MouseEvent | TouchEvent) {
    if (this._isDragging) {
      const loc = this.getEventLocation(event);
      this.pan = { x: loc.x / this.zoom - this._dragStart.x, y: loc.y / this.zoom - this._dragStart.y };
    }
  }

  handleWheel(event: WheelEvent) {
    event.preventDefault();

    // const canvasEl = this.el.querySelector('.flowy-canvas') as HTMLElement;
    // const canvasEl = this.getCanvasEl();
    const canvasEl = this._canvasEl;
    // Calculate the mouse position relative to the canvas
    const canvasRect = canvasEl.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;

    // Calculate the zoom level change
    const zoomDelta = event.deltaY < 0 ? this.zoomSpeed : -this.zoomSpeed;
    const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom + zoomDelta));

    // Calculate the scale factor
    const scaleFactor = newZoom / this.zoom;

    // Adjust the pan position to keep the same point under the cursor
    const newPanX = mouseX - (mouseX - this.pan.x * this.zoom) * scaleFactor;
    const newPanY = mouseY - (mouseY - this.pan.y * this.zoom) * scaleFactor;

    // Update pan and zoom
    this.pan = { x: newPanX / newZoom, y: newPanY / newZoom };
    this.zoom = newZoom;
    this._needsRedraw = true;
  }

  handleTouch(event: TouchEvent, singleTouchHandler: (touch: TouchEvent) => void) {
    if (event.touches.length === 1) {
      singleTouchHandler(event);
    } else if (event.type === 'touchmove' && event.touches.length === 2) {
      this._isDragging = false;
      this.handlePinch(event);
    }
  }

  handlePinch(event: TouchEvent) {
    event.preventDefault();

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt((touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2);
    if (this._initialPinchDistance === 0) {
      this._initialPinchDistance = distance;
    } else {
      this.adjustZoom(0, distance / this._initialPinchDistance);
    }
    // const newZoom = this.lastZoom * (distance / this.initialPinchDistance);
    // this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, newZoom));
  }

  adjustZoom(amount: number, scale: number) {
    if (!this._isDragging) {
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
