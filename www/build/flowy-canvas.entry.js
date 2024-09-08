import { r as registerInstance, h, a as Host, g as getElement } from './index-4f7a8ee4.js';

const flowyCanvasCss = ":host{display:block}";

const FlowyCanvas = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.renderGrid = true;
        this.gridSize = 20;
        this.gridBgColor = '#f3f3f3';
        this.gridLineColor = '#555555';
        this.maxZoom = 5;
        this.minZoom = 0.1;
        this.zoomSpeed = 0.05;
        this.zoom = 1;
        this.lastZoom = 1;
        this.initialPinchDistance = 0;
        this.pan = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
    }
    // initialize the grid by adding css to the host element
    componentDidLoad() {
        const canvasEl = this.el.querySelector('.flowy-canvas');
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
            const contentEl = this.el.querySelector('.flowy-content');
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
            const canvasEl = this.el.querySelector('.flowy-grid');
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
        const contentEl = this.el.querySelector('.flowy-content');
        contentEl.style.transform = `scale(${this.zoom}) translate(${this.pan.x}px, ${this.pan.y}px)`;
    }
    zoomChanged() {
        this.updateScreen();
    }
    panChanged() {
        this.updateScreen();
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
        this.isDragging = true;
        const loc = this.getEventLocation(event);
        this.dragStart = { x: loc.x / this.zoom - this.pan.x, y: loc.y / this.zoom - this.pan.y };
    }
    onPointerUp() {
        this.isDragging = false;
        this.initialPinchDistance = 0;
        this.lastZoom = this.zoom;
    }
    onPointerMove(event) {
        if (this.isDragging) {
            const loc = this.getEventLocation(event);
            this.pan = { x: loc.x / this.zoom - this.dragStart.x, y: loc.y / this.zoom - this.dragStart.y };
        }
    }
    handleTouch(event, singleTouchHandler) {
        if (event.touches.length === 1) {
            singleTouchHandler(event);
        }
        else if (event.type === 'touchmove' && event.touches.length === 2) {
            this.isDragging = false;
            this.handlePinch(event);
        }
    }
    handlePinch(event) {
        event.preventDefault();
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.sqrt((touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2);
        if (this.initialPinchDistance === 0) {
            this.initialPinchDistance = distance;
        }
        else {
            this.adjustZoom(0, distance / this.initialPinchDistance);
        }
        // const newZoom = this.lastZoom * (distance / this.initialPinchDistance);
        // this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, newZoom));
    }
    adjustZoom(amount, scale) {
        if (!this.isDragging) {
            if (amount !== 0) {
            }
            else if (scale !== 1) {
                this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom - scale));
            }
        }
    }
    render() {
        return (h(Host, { key: '2a3c6f960827aafe13ee6833d683c6258792bb1c' }, h("div", { key: '17f4bcd76fbe4b1985c4c141c0c2b2e3b9d263d4', class: "flowy-canvas" }, h("canvas", { key: '6bf343d142d70155e14919c84e19aea5638ec46f', class: "flowy-grid" }), h("div", { key: '918bf6a821a3e07c3b89282013a445c483171570', class: "flowy-content" }, h("slot", { key: 'd99480c5f533c107327049e67fdadb2f2d89f20b' })))));
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