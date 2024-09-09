import { Component, Host, Prop, h, Element, State, Watch } from '@stencil/core';
import { Point } from '../types/Point';
import { debounce } from '../utils/debounce';
import { throttle } from '../utils/throttle';
import interact from 'interactjs';

@Component({
  tag: 'flowy-canvas-old',
  shadow: false,
})
export class FlowyCanvasOld {
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
  private _initialZoom: number = 1;
  // private _lastPan: Point = { x: 0, y: 0 };
  private _initialPinchDistance: number = 0;
  private _isDragging: boolean = false;
  private _dragStart: Point = { x: 0, y: 0 };
  private _renderGridData: { lastPan: Point; lastZoom: number } = { lastPan: { x: 0, y: 0 }, lastZoom: 1 };

  private _canvasEl: HTMLDivElement;
  private _contentEl: HTMLDivElement;
  private _gridEl: HTMLCanvasElement;
  private _needsRedraw: boolean = true;

  private _resizeObserver: ResizeObserver;
  // Debounced version of the onResize method
  private _debouncedResize = debounce(() => this.onResize(), 200);
  private _debouncedUpdateScreen = debounce(() => this.updateScreen(), 1);

  componentDidLoad() {
    this._canvasEl = this.el.querySelector('.flowy-canvas') as HTMLDivElement;
    this._contentEl = this.el.querySelector('.flowy-content') as HTMLDivElement;
    this._gridEl = this.el.querySelector('.flowy-grid') as HTMLCanvasElement;

    const canvasEl = this._canvasEl;
    this.renderGridLines();

    this._initialPinchDistance = 0;
    this._lastZoom = this.zoom;
    // this._lastPan = this.pan;

    interact(this._canvasEl)
      .draggable({
        listeners: {
          start: event => this.onDragStart(event),
          move: event => this.onDragMove(event),
          end: event => this.onDragEnd(event),
        },
        inertia: false, // Disable inertia for smoother touch behavior
      })
      .gesturable({
        listeners: {
          start: event => this.onGestureStart(event),
          move: event => this.onGestureMove(event),
          end: event => this.onGestureEnd(event),
        },
      });

    // Add custom mouse and touch event listeners for middle mouse panning and scroll wheel zoom
    this._canvasEl.addEventListener('wheel', this.handleWheelZoom.bind(this), { passive: false });
    this._canvasEl.addEventListener('mousedown', this.handleMiddleMousePan.bind(this), { passive: true });
    this._canvasEl.addEventListener('mouseup', this.onPointerUp.bind(this), { passive: true });

    // throttled mousemove event for performance
    // const throttledPointerMove = throttle(e => this.onPointerMove(e), 30);
    // const throttledTouchMove = throttle((e, fun) => this.handleTouch(e, fun(e)), 30);

    // setup event listeners
    // const canvasEl = this.el.querySelector('.flowy-virtual-area') as HTMLElement;
    // canvasEl.addEventListener('mousedown', e => this.onPointerDown(e), { passive: true });
    // canvasEl.addEventListener('touchstart', e => this.handleTouch(e, e => this.onPointerDown(e)), { passive: false });
    // canvasEl.addEventListener('mouseup', () => this.onPointerUp(), { passive: true });
    // canvasEl.addEventListener('touchend', () => this.onPointerUp(), { passive: true });
    // canvasEl.addEventListener('mousemove', e => throttledPointerMove(e), { passive: true });
    // canvasEl.addEventListener('touchmove', e => throttledTouchMove(e, (e: MouseEvent | TouchEvent) => this.onPointerMove(e)), { passive: false });
    // canvasEl.addEventListener('wheel', e => this.handleWheel(e), { passive: false });

    // Handle resize events
    this._resizeObserver = new ResizeObserver(() => this._debouncedResize());
    this._resizeObserver.observe(this._canvasEl);
  }

  disconnectedCallback() {
    interact(this._canvasEl).unset(); // Unset Interact.js from the canvas

    // Clean up resize observer
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }

    this._canvasEl.removeEventListener('wheel', this.handleWheelZoom.bind(this));
    this._canvasEl.removeEventListener('mousedown', this.handleMiddleMousePan.bind(this));
    this._canvasEl.removeEventListener('mouseup', this.onPointerUp.bind(this));

    // Clean up event listeners
    // const canvasEl = this._canvasEl;
    // canvasEl.removeEventListener('mousedown', e => this.onPointerDown(e));
    // canvasEl.removeEventListener('touchstart', e => this.handleTouch(e, e => this.onPointerDown(e)));
    // canvasEl.removeEventListener('mouseup', () => this.onPointerUp());
    // canvasEl.removeEventListener('touchend', () => this.onPointerUp());
    // canvasEl.removeEventListener('mousemove', e => this.onPointerMove(e));
    // canvasEl.removeEventListener('touchmove', e => this.handleTouch(e, e => this.onPointerMove(e)));
    // canvasEl.removeEventListener('wheel', e => this.handleWheel(e));
  }

  @Watch('zoom')
  zoomChanged() {
    this._needsRedraw = true;
    // this.updateScreen();
    this._debouncedUpdateScreen();
  }

  @Watch('pan')
  panChanged() {
    this._needsRedraw = true;
    // this.updateScreen();
    this._debouncedUpdateScreen();
  }

  onResize() {
    this._needsRedraw = true;
    this.renderGridLines();
  }

  // shouldRedraw() {
  //   const redrawThreshold = 0.1;
  //   const lastPan = this._renderGridData.lastPan;
  //   const lastZoom = this._renderGridData.lastZoom;
  //   const panChanged = Math.abs(this.pan.x - lastPan.x) > redrawThreshold || Math.abs(this.pan.y - lastPan.y) > redrawThreshold;
  //   const zoomChanged = Math.abs(this.zoom - lastZoom) > redrawThreshold;

  //   return panChanged || zoomChanged;
  // }

  renderGridLines() {
    if (!this.renderGrid || !this._needsRedraw) return;

    this._renderGridData = { lastPan: { ...this.pan }, lastZoom: this.zoom };

    const canvasEl = this._gridEl;
    const ctx = canvasEl.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    const step = this.gridSize * this.zoom;

    // canvasEl.width = width;
    // canvasEl.height = height;
    const dpr = window.devicePixelRatio || 1;
    canvasEl.width = width * dpr;
    canvasEl.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = this.gridLineColor;
    ctx.lineWidth = 1;

    // clear
    ctx.clearRect(0, 0, width, height);
    // fill bg color
    ctx.fillStyle = this.gridBgColor;
    ctx.fillRect(0, 0, width, height);

    const panOffsetX = (-this.pan.x % this.gridSize) * this.zoom;
    const panOffsetY = (-this.pan.y % this.gridSize) * this.zoom;

    ctx.beginPath();

    // Draw vertical grid lines (x axis)
    for (let x = -panOffsetX; x <= width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    // Draw horizontal grid lines (y axis)
    for (let y = -panOffsetY; y <= height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();

    this._needsRedraw = false;
  }

  updateScreen() {
    // this.renderGridLines();
    const contentEl = this._contentEl;
    // Apply transformations to the content, aligning with the grid
    // contentEl.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`;
    // contentEl.style.transform = `translate(${this.pan.x * this.zoom}px, ${this.pan.y * this.zoom}px) scale(${this.zoom})`;
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

  // onPointerDown(event: MouseEvent | TouchEvent) {
  //   this._isDragging = true;
  //   const loc = this.getEventLocation(event);
  //   this._dragStart = { x: loc.x / this.zoom - this.pan.x, y: loc.y / this.zoom - this.pan.y };
  // }

  // onPointerUp() {
  //   this._isDragging = false;
  //   this._initialPinchDistance = 0;
  //   // this._lastZoom = this.zoom;
  // }

  // onPointerMove(event: MouseEvent | TouchEvent) {
  //   if (this._isDragging) {
  //     // this._lastPan = this.pan;
  //     const loc = this.getEventLocation(event);
  //     this.pan = { x: loc.x / this.zoom - this._dragStart.x, y: loc.y / this.zoom - this._dragStart.y };
  //   }
  // }

  // handleWheel(event: WheelEvent) {
  //   event.preventDefault();

  //   // const canvasEl = this.el.querySelector('.flowy-canvas') as HTMLElement;
  //   // const canvasEl = this.getCanvasEl();
  //   const canvasEl = this._canvasEl;
  //   // Calculate the mouse position relative to the canvas
  //   const canvasRect = canvasEl.getBoundingClientRect();
  //   const mouseX = event.clientX - canvasRect.left;
  //   const mouseY = event.clientY - canvasRect.top;

  //   // Calculate the zoom level change
  //   const zoomDelta = event.deltaY < 0 ? this.zoomSpeed : -this.zoomSpeed;
  //   const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom + zoomDelta));

  //   // Calculate the scale factor
  //   const scaleFactor = newZoom / this.zoom;

  //   // Adjust the pan position to keep the same point under the cursor
  //   const newPanX = mouseX - (mouseX - this.pan.x * this.zoom) * scaleFactor;
  //   const newPanY = mouseY - (mouseY - this.pan.y * this.zoom) * scaleFactor;

  //   // Update pan and zoom
  //   this.pan = { x: newPanX / newZoom, y: newPanY / newZoom };
  //   this._lastZoom = this.zoom;
  //   this.zoom = newZoom;
  //   this._needsRedraw = true;
  // }

  // handleTouch(event: TouchEvent, singleTouchHandler: (touch: TouchEvent) => void) {
  //   if (event.touches.length === 1) {
  //     if (!this._isDragging) {
  //       singleTouchHandler(event);
  //     }
  //   } else if (event.touches.length === 2) {
  //     this._isDragging = false; // Disable pan while pinching
  //     this.handlePinch(event);
  //   }
  // }
  // handlePinch(event: TouchEvent) {
  //   event.preventDefault();
  //   const touch1 = event.touches[0];
  //   const touch2 = event.touches[1];

  //   const currentDistance = Math.sqrt((touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2);

  //   const panSensitivity = 0.1; // Sensitivity for panning
  //   const pinchThreshold = 10; // Minimum distance difference to start pinch

  //   if (this._initialPinchDistance === 0) {
  //     this._initialPinchDistance = currentDistance;
  //   } else {
  //     const distanceDiff = Math.abs(currentDistance - this._initialPinchDistance);

  //     if (distanceDiff > pinchThreshold) {
  //       // Pinching
  //       const center = {
  //         x: (touch1.clientX + touch2.clientX) / 2,
  //         y: (touch1.clientY + touch2.clientY) / 2,
  //       };

  //       this.adjustZoom(0, currentDistance / this._initialPinchDistance, center);
  //     } else {
  //       // Two-finger panning
  //       const midPoint = {
  //         x: (touch1.clientX + touch2.clientX) / 2,
  //         y: (touch1.clientY + touch2.clientY) / 2,
  //       };

  //       if (!this._isDragging) {
  //         this._dragStart = { x: midPoint.x - this.pan.x, y: midPoint.y - this.pan.y };
  //       } else {
  //         // Adjust pan with sensitivity
  //         this.pan = {
  //           x: (midPoint.x - this._dragStart.x) * panSensitivity,
  //           y: (midPoint.y - this._dragStart.y) * panSensitivity,
  //         };
  //       }

  //       this._isDragging = true;
  //     }
  //   }
  // }

  // adjustZoom(amount: number, scale: number, center?: Point) {
  //   const zoomSensitivity = 0.05; // A sensitivity factor for zoom
  //   const oldZoom = this.zoom;

  //   // Apply scale factor to current zoom
  //   const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, oldZoom * (1 + (scale - 1) * zoomSensitivity)));

  //   if (center) {
  //     const canvasRect = this._canvasEl.getBoundingClientRect();
  //     const pointX = center.x - canvasRect.left;
  //     const pointY = center.y - canvasRect.top;

  //     const scaleFactor = newZoom / oldZoom;

  //     const newPanX = pointX - (pointX - this.pan.x * oldZoom) * scaleFactor;
  //     const newPanY = pointY - (pointY - this.pan.y * oldZoom) * scaleFactor;

  //     this.pan = { x: newPanX / newZoom, y: newPanY / newZoom };
  //   }

  //   this.zoom = newZoom;
  // }

  // Interact.js gesture handlers for panning and pinch-to-zoom
  onDragStart(event) {
    this._isDragging = true;
    this._dragStart = { x: event.clientX / this.zoom - this.pan.x, y: event.clientY / this.zoom - this.pan.y };
  }

  onDragMove(event) {
    if (this._isDragging) {
      const deltaX = event.dx / this.zoom;
      const deltaY = event.dy / this.zoom;
      this.pan = { x: this.pan.x + deltaX, y: this.pan.y + deltaY };
      this._debouncedUpdateScreen();
    }
  }

  onDragEnd(event) {
    this._isDragging = false;
  }

  onGestureStart(event) {
    this._initialZoom = this.zoom;
  }

  onGestureMove(event) {
    const scaleChange = event.scale;
    const canvasRect = this._canvasEl.getBoundingClientRect();
    const zoomCenter = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top,
    };
    this.adjustZoom(0, scaleChange, zoomCenter);
  }

  onGestureEnd(event) {
    this._initialPinchDistance = 0;
  }

  // Custom wheel zoom handler
  handleWheelZoom(event) {
    event.preventDefault();

    const zoomDelta = event.deltaY < 0 ? this.zoomSpeed : -this.zoomSpeed;
    const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom + zoomDelta));

    const canvasRect = this._canvasEl.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;
    const scaleFactor = newZoom / this.zoom;

    const newPanX = mouseX - (mouseX - this.pan.x * this.zoom) * scaleFactor;
    const newPanY = mouseY - (mouseY - this.pan.y * this.zoom) * scaleFactor;

    this.pan = { x: newPanX / newZoom, y: newPanY / newZoom };
    this.zoom = newZoom;
    this._needsRedraw = true;
    this._debouncedUpdateScreen();
  }

  // Handle middle mouse panning
  handleMiddleMousePan(event) {
    if (event.button === 1) {
      // Middle mouse button
      this._isDragging = true;
      this._dragStart = { x: event.clientX / this.zoom - this.pan.x, y: event.clientY / this.zoom - this.pan.y };
      document.addEventListener('mousemove', this.onDragMove.bind(this), { passive: true });
      document.addEventListener('mouseup', this.onPointerUp.bind(this), { passive: true });
    }
  }

  onPointerUp(event) {
    this._isDragging = false;
    document.removeEventListener('mousemove', this.onDragMove.bind(this));
    document.removeEventListener('mouseup', this.onPointerUp.bind(this));
  }

  // Adjust zoom based on scale or pinch
  adjustZoom(amount, scale, zoomCenter) {
    if (amount !== 0) {
      const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom + amount));
      this.zoom = newZoom;
    } else if (scale !== 1) {
      const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this._initialZoom * scale));
      this.zoom = newZoom;

      if (zoomCenter) {
        const scaleFactor = newZoom / this._initialZoom;
        const newPanX = zoomCenter.x - (zoomCenter.x - this.pan.x * this.zoom) * scaleFactor;
        const newPanY = zoomCenter.y - (zoomCenter.y - this.pan.y * this.zoom) * scaleFactor;
        this.pan = { x: newPanX / newZoom, y: newPanY / newZoom };
      }
    }

    this._needsRedraw = true;
    this._debouncedUpdateScreen();
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
