import { r as registerInstance, h, a as Host, g as getElement } from './index-2e7362b2.js';
import { d as debounce } from './debounce-25523ff8.js';
import { t as throttle } from './throttle-2ef1c0d0.js';

const flowyCanvasCss = ":host{display:block}";

const FlowyCanvas = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        // @State() activeNodePos: Point = { x: 0, y: 0 };
        this._initialPinchDistance = 0;
        this._isDragging = false;
        this._dragStart = { x: 0, y: 0 };
        this._needsRedraw = true;
        this._debouncedResize = debounce(() => this.onResize(), 50);
        this._debouncedUpdateScreen = debounce(() => this.updateScreen(), 5);
        this._throttledPointerMove = throttle(e => this.onPointerMove(e), 30);
        this._throttledTouchMove = throttle(e => this.handleTouchMove(e), 30);
        this._elMouseDown = (e) => this.onPointerDown(e);
        this._elMouseUp = () => this.onPointerUp();
        this._elMouseMove = (e) => this._throttledPointerMove(e);
        this._elTouchStart = (e) => this.handleTouchStart(e);
        this._elTouchMove = (e) => this._throttledTouchMove(e);
        this._elTouchEnd = () => this.onPointerUp();
        this._elWheel = (e) => this.handleWheel(e);
        this.renderGrid = true;
        this.gridSize = 20;
        this.gridBgColor = '#f3f3f3';
        this.gridLineColor = '#555555';
        this.maxZoom = 3;
        this.minZoom = 0.2;
        this.zoomSpeed = 0.08;
        this.zoom = 1;
        this.pan = { x: 0, y: 0 };
    }
    componentDidLoad() {
        this._canvasEl = this.el.querySelector('.flowy-canvas');
        this._contentEl = this.el.querySelector('.flowy-content');
        this._gridEl = this.el.querySelector('.flowy-grid');
        this._canvasRect = this._canvasEl.getBoundingClientRect();
        const canvasEl = this._canvasEl;
        this.renderGridLines();
        this._initialPinchDistance = 0;
        // setup event listeners
        canvasEl.addEventListener('mousedown', this._elMouseDown, {
            passive: true,
        });
        canvasEl.addEventListener('mouseup', this._elMouseUp, { passive: true });
        canvasEl.addEventListener('mousemove', this._elMouseMove, {
            passive: true,
        });
        canvasEl.addEventListener('touchstart', this._elTouchStart, {
            passive: false,
        });
        canvasEl.addEventListener('touchmove', this._elTouchMove, {
            passive: true,
        });
        canvasEl.addEventListener('touchend', this._elTouchEnd, { passive: true });
        canvasEl.addEventListener('wheel', this._elWheel, { passive: false });
        // Handle resize events
        this._resizeObserver = new ResizeObserver(() => this._debouncedResize());
        this._resizeObserver.observe(this._canvasEl);
        // events.on('nodeDragStart', this.nodeDragStart.bind(this));
        // events.on('nodeDragStopped', this.nodeDragEnd.bind(this));
    }
    disconnectedCallback() {
        // Clean up resize observer
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
        // Clean up event listeners
        const canvasEl = this._canvasEl;
        canvasEl.removeEventListener('mousedown', this._elMouseDown);
        canvasEl.removeEventListener('mouseup', this._elMouseUp);
        canvasEl.removeEventListener('mousemove', this._elMouseMove);
        canvasEl.removeEventListener('touchstart', this._elTouchStart);
        canvasEl.removeEventListener('touchmove', this._elTouchMove);
        canvasEl.removeEventListener('touchend', this._elTouchEnd);
        canvasEl.removeEventListener('wheel', this._elWheel);
        // events.off('nodeDragStart', this.nodeDragStart.bind(this));
        // events.off('nodeDragStopped', this.nodeDragEnd.bind(this));
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
    // @Watch('activeNodePos')
    // activeNodePosChanged() {
    //   this._activeNode.style.transform = `translate(${this.activeNodePos.x}px, ${this.activeNodePos.y}px)`;
    // }
    onResize() {
        this._needsRedraw = true;
        this._canvasRect = this._canvasEl.getBoundingClientRect();
        this.renderGridLines();
    }
    renderGridLines() {
        if (!this.renderGrid || !this._needsRedraw)
            return;
        const canvasEl = this._gridEl;
        const ctx = canvasEl.getContext('2d');
        const width = this._canvasRect.width;
        const height = this._canvasRect.height;
        const step = this.gridSize * this.zoom;
        const dpr = window.devicePixelRatio || 1;
        canvasEl.width = width * dpr;
        canvasEl.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.strokeStyle = this.gridLineColor;
        ctx.lineWidth = 1;
        // clear
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
    // nodeDragStart(el: HTMLElement, pos: Point, offset: Point) {
    //   this._activeNode = el;
    //   this._activeNodeOffset = offset;
    //   // adjust offset for content offset
    //   // this._activeNodeOffset = {
    //   //   x: offset.x + this._contentEl.getBoundingClientRect().left,
    //   //   y: offset.y + this._contentEl.getBoundingClientRect().top,
    //   // };
    //   // console.log('nodeDragStart', this._activeNodeOffset);
    //   // this.activeNodePos = pos;
    //   this._isDraggingNode = true;
    // }
    // updateNodePosition() {
    //   if (!this._activeNode) return;
    //   this._activeNode.style.transform = `translate(${this.activeNodePos.x}px, ${this.activeNodePos.y}px)`;
    // }
    // nodeDragEnd() {
    //   this._isDraggingNode = false;
    // }
    updateScreen() {
        // this.renderGridLines();
        const contentEl = this._contentEl;
        // Apply transformations to the content, aligning with the grid
        contentEl.style.transform = `perspective(1px) scale(${this.zoom}) translate(${this.pan.x}px, ${this.pan.y}px)`;
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
        this._dragStart = {
            x: loc.x / this.zoom - this.pan.x,
            y: loc.y / this.zoom - this.pan.y,
        };
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
            this.pan = {
                x: loc.x / this.zoom - this._dragStart.x,
                y: loc.y / this.zoom - this._dragStart.y,
            };
        }
        // // handle node
        // if (this._isDraggingNode) {
        //   const loc = this.getEventLocation(event);
        //   const dx = loc.x - this.activeNodePos.x;
        //   const dy = loc.y - this.activeNodePos.y;
        //   // account for zoom and pan and original offset
        //   const newx =
        //     (this.activeNodePos.x + dx - this._activeNodeOffset.x) / this.zoom -
        //     this.pan.x;
        //   const newy =
        //     (this.activeNodePos.y + dy - this._activeNodeOffset.y) / this.zoom -
        //     this.pan.y;
        //   this.activeNodePos = { x: newx, y: newy };
        // }
    }
    handleWheel(event) {
        event.preventDefault();
        const canvasRect = this._canvasRect;
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
        // this._lastZoom = this.zoom;
        this.zoom = newZoom;
        this._needsRedraw = true;
    }
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
        // // handle node
        // if (this._isDraggingNode) {
        //   const loc = this.getEventLocation(event);
        //   const x = loc.x - this.activeNodePos.x;
        //   const y = loc.y - this.activeNodePos.y;
        //   this.activeNodePos = { x, y };
        // }
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
        const distance = Math.sqrt((touch1.clientX - touch2.clientX) ** 2 +
            (touch1.clientY - touch2.clientY) ** 2);
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
    render() {
        return (h(Host, { key: 'de0c2d47321eecdd844d5e7fccbcdee1c372f52a' }, h("div", { key: '161feab71450bafdb10209e8cb0e0291c0996860', class: "flowy-canvas" }, h("canvas", { key: 'ffdda35bbf0f01b0ae0e3a11256439a36fb7737c', class: "flowy-grid" }), h("div", { key: '6409c0fec4c0d3090b5bb1788d520aaeb39b890e', class: "flowy-content" }, h("slot", { key: '8fa6cd1bef945b4607315801f38ec742601738ba' })))));
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