import { r as registerInstance, h, a as Host, g as getElement } from './index-775bd678.js';

const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

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
        this._initialPinchDistance = 0;
        this._isDragging = false;
        this._dragStart = { x: 0, y: 0 };
        this._needsRedraw = false;
        // Debounced version of the onResize method
        this._debouncedResize = debounce(() => this.onResize(), 200);
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
        canvasEl.addEventListener('touchmove', e => throttledTouchMove(e, (e) => this.onPointerMove(e)), { passive: true });
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
    zoomChanged() {
        this._needsRedraw = true;
        this.updateScreen();
    }
    panChanged() {
        this._needsRedraw = true;
        this.updateScreen();
    }
    onResize() {
        this._needsRedraw = true;
        this.renderGridLines();
    }
    renderGridLines() {
        if (!this.renderGrid || !this._needsRedraw)
            return;
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
        this._lastZoom = this.zoom;
    }
    onPointerMove(event) {
        if (this._isDragging) {
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
        this.zoom = newZoom;
        this._needsRedraw = true;
    }
    handleTouch(event, singleTouchHandler) {
        if (event.touches.length === 1) {
            singleTouchHandler(event);
        }
        else if (event.type === 'touchmove' && event.touches.length === 2) {
            this._isDragging = false;
            this.handlePinch(event);
        }
    }
    handlePinch(event) {
        event.preventDefault();
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.sqrt((touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2);
        if (this._initialPinchDistance === 0) {
            this._initialPinchDistance = distance;
        }
        else {
            this.adjustZoom(0, distance / this._initialPinchDistance);
        }
        // const newZoom = this.lastZoom * (distance / this.initialPinchDistance);
        // this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, newZoom));
    }
    adjustZoom(amount, scale) {
        if (!this._isDragging) {
            if (amount !== 0) {
            }
            else if (scale !== 1) {
                this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom - scale));
            }
        }
    }
    render() {
        return (h(Host, { key: '351a2613fdb4ee288081b06c3a1ccc5d0006568d' }, h("div", { key: '4cbdf7752526ab7da14ef8960cdebe0944cfdb4f', class: "flowy-canvas" }, h("canvas", { key: '8dd49fae2fb88755621649c1bf392aa9cb6ea6ac', class: "flowy-grid" }), h("div", { key: 'a0a2073c744799d5da43805422a19d9a2c1d4048', class: "flowy-content" }, h("slot", { key: 'a3fd40404f4846c37ce970319c8de8946b32773e' })))));
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