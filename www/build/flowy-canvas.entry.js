import { r as registerInstance, h, a as Host, g as getElement } from './index-775bd678.js';
import { d as debounce } from './debounce-25523ff8.js';

const throttle = (fn, delay) => {
    let lastFunc;
    let lastRan;
    return (...args) => {
        if (!lastRan) {
            fn(...args);
            lastRan = Date.now();
        }
        else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= delay) {
                    fn(...args);
                    lastRan = Date.now();
                }
            }, delay - (Date.now() - lastRan));
        }
    };
};

const flowyCanvasCss = ":host{display:block}";

const FlowyCanvas = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._lastZoom = 1;
        // private _lastPan: Point = { x: 0, y: 0 };
        this._initialPinchDistance = 0;
        this._isDragging = false;
        this._dragStart = { x: 0, y: 0 };
        this._renderGridData = { lastPan: { x: 0, y: 0 }, lastZoom: 1 };
        this._needsRedraw = true;
        // Debounced version of the onResize method
        this._debouncedResize = debounce(() => this.onResize(), 200);
        this._debouncedUpdateScreen = debounce(() => this.updateScreen(), 10);
        this.renderGrid = true;
        this.gridSize = 20;
        this.gridBgColor = '#f3f3f3';
        this.gridLineColor = '#555555';
        this.maxZoom = 5;
        this.minZoom = 0.1;
        this.zoomSpeed = 0.05;
        this.zoom = 1;
        this.pan = { x: 0, y: 0 };
    }
    componentDidLoad() {
        this._canvasEl = this.el.querySelector('.flowy-canvas');
        this._contentEl = this.el.querySelector('.flowy-content');
        this._gridEl = this.el.querySelector('.flowy-grid');
        const canvasEl = this._canvasEl;
        this.renderGridLines();
        this._initialPinchDistance = 0;
        this._lastZoom = this.zoom;
        // this._lastPan = this.pan;
        // throttled mousemove event for performance
        const throttledPointerMove = throttle(e => this.onPointerMove(e), 30);
        const throttledTouchMove = throttle(e => this.handleTouchMove(e), 30);
        // setup event listeners
        // const canvasEl = this.el.querySelector('.flowy-virtual-area') as HTMLElement;
        canvasEl.addEventListener('mousedown', e => this.onPointerDown(e), { passive: true });
        canvasEl.addEventListener('mouseup', () => this.onPointerUp(), { passive: true });
        canvasEl.addEventListener('mousemove', e => throttledPointerMove(e), { passive: true });
        canvasEl.addEventListener('touchstart', e => this.handleTouchStart(e), { passive: false });
        canvasEl.addEventListener('touchmove', e => throttledTouchMove(e), { passive: true });
        canvasEl.addEventListener('touchend', () => this.onPointerUp(), { passive: true });
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
        canvasEl.removeEventListener('mouseup', () => this.onPointerUp());
        canvasEl.removeEventListener('mousemove', e => this.onPointerMove(e));
        canvasEl.removeEventListener('touchstart', e => this.handleTouchStart(e));
        canvasEl.removeEventListener('touchmove', e => this.handleTouchMove(e));
        canvasEl.removeEventListener('touchend', () => this.onPointerUp());
        canvasEl.removeEventListener('wheel', e => this.handleWheel(e));
    }
    zoomChanged() {
        this._needsRedraw = true;
        // this.updateScreen();
        this._debouncedUpdateScreen();
    }
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
        if (!this.renderGrid || !this._needsRedraw)
            return;
        this._renderGridData = { lastPan: Object.assign({}, this.pan), lastZoom: this.zoom };
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
    getEventLocation(event) {
        if (event instanceof TouchEvent) {
            if (event.touches && event.touches[0]) {
                return { x: event.touches[0].clientX, y: event.touches[0].clientY };
            }
        }
        else {
            return { x: event.clientX, y: event.clientY };
        }
    }
    onPointerDown(event) {
        this._isDragging = true;
        const loc = this.getEventLocation(event);
        this._dragStart = { x: loc.x / this.zoom - this.pan.x, y: loc.y / this.zoom - this.pan.y };
    }
    onPointerUp() {
        this._isDragging = false;
        this._initialPinchDistance = 0;
        // this._lastZoom = this.zoom;
    }
    onPointerMove(event) {
        if (this._isDragging) {
            // this._lastPan = this.pan;
            const loc = this.getEventLocation(event);
            this.pan = { x: loc.x / this.zoom - this._dragStart.x, y: loc.y / this.zoom - this._dragStart.y };
        }
    }
    handleWheel(event) {
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
        this._lastZoom = this.zoom;
        this.zoom = newZoom;
        this._needsRedraw = true;
    }
    // handleTouch(event: TouchEvent) {
    //   if (event.touches.length === 1) {
    //     this.onPointerDown(event); // direct call to the intended handler
    //   } else if (event.touches.length === 2) {
    //     this._isDragging = false;
    //     this.handlePinch(event);
    //   }
    // }
    handleTouchStart(event) {
        if (event.touches.length === 1) {
            // Single touch -> start panning
            this.onPointerDown(event);
        }
        else if (event.touches.length === 2) {
            // Multi-touch -> start pinch zoom
            this._initialPinchDistance = 0; // Reset initial pinch distance
            this.handlePinch(event); // Start pinch gesture
        }
    }
    handleTouchMove(event) {
        if (event.touches.length === 1) {
            // Single touch -> panning
            this.onPointerMove(event);
        }
        else if (event.touches.length === 2) {
            // Multi-touch -> pinch zooming
            this.handlePinch(event);
        }
    }
    handlePinch(event) {
        if (event.touches.length !== 2)
            return;
        // handle panning while pinching
        this.onPointerMove(event);
        event.preventDefault(); // Prevent default behavior like scrolling
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        // Calculate the distance between the two touch points (pinch)
        const distance = Math.sqrt((touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2);
        if (this._initialPinchDistance === 0) {
            // If it's the start of the pinch, initialize the pinch distance
            this._initialPinchDistance = distance;
        }
        else {
            // Calculate the scale factor based on the distance change
            const scaleFactor = distance / this._initialPinchDistance;
            // Calculate the midpoint between the two fingers (the pinch center)
            const pinchCenterX = (touch1.clientX + touch2.clientX) / 2;
            const pinchCenterY = (touch1.clientY + touch2.clientY) / 2;
            // Apply zoom and keep the pinch center fixed
            this.adjustZoomOnPinch(scaleFactor, pinchCenterX, pinchCenterY);
            // Update the initial pinch distance for the next move
            this._initialPinchDistance = distance;
        }
    }
    adjustZoomOnPinch(scaleFactor, pinchCenterX, pinchCenterY) {
        // Calculate new zoom, ensuring it stays within min/max bounds
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom * scaleFactor));
        // Calculate the ratio of the new zoom level compared to the current zoom
        // const zoomDelta = newZoom / this.zoom;
        // Find the pinch center position relative to the content's current position and zoom
        const pinchContentX = (pinchCenterX - this.pan.x * this.zoom) / this.zoom;
        const pinchContentY = (pinchCenterY - this.pan.y * this.zoom) / this.zoom;
        // Adjust pan so the pinch center stays fixed after zooming
        this.pan = {
            x: pinchCenterX / newZoom - pinchContentX,
            y: pinchCenterY / newZoom - pinchContentY,
        };
        // Apply the new zoom level
        this.zoom = newZoom;
        // Trigger a screen redraw
        this._debouncedUpdateScreen();
    }
    adjustZoom(amount, scale, center) {
        const zoomSensitivity = 0.05; // A sensitivity factor for zoom
        const oldZoom = this.zoom;
        // Modify zoom scaling with a sensitivity factor
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, oldZoom * (1 + (scale - 1) * zoomSensitivity)));
        if (center) {
            const canvasRect = this._canvasEl.getBoundingClientRect();
            const pointX = center.x - canvasRect.left;
            const pointY = center.y - canvasRect.top;
            const scaleFactor = newZoom / oldZoom;
            const newPanX = pointX - (pointX - this.pan.x * oldZoom) * scaleFactor;
            const newPanY = pointY - (pointY - this.pan.y * oldZoom) * scaleFactor;
            this.pan = { x: newPanX / newZoom, y: newPanY / newZoom };
        }
        this.zoom = newZoom;
    }
    render() {
        return (h(Host, { key: 'be5347da0f9fc75cffa8aac304081d07f130f501' }, h("div", { key: '0431b33d87d5366d6acf99c371fed6ce0cbb0f8d', class: "flowy-canvas" }, h("canvas", { key: 'f777bfd88027affd722a742ff40c5c614d5cc4c1', class: "flowy-grid" }), h("div", { key: '998e9b2b1573c37cdd5c3d21fd979294e3359053', class: "flowy-content" }, h("slot", { key: '68ea39dbc57a902d8c58df0c2f4ecf8ecd8758fd' })))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "zoom": ["zoomChanged"],
        "pan": ["panChanged"]
    }; }
};
FlowyCanvas.style = flowyCanvasCss;

export { FlowyCanvas as flowy_canvas };

//# sourceMappingURL=flowy-canvas.entry.js.map