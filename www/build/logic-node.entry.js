import { r as registerInstance, h, a as Host, g as getElement } from './index-2e7362b2.js';
import { t as throttle, g as getEventLocation } from './getEventLocation-16a02f08.js';
import { d as debounce } from './debounce-25523ff8.js';

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._canvasZoom = 1;
        this._canvasPan = { x: 0, y: 0 };
        this._dragStart = { x: 0, y: 0 };
        this._throttledPointerMove = throttle(e => this.onPointerMove(e), 10);
        this._throttledTouchMove = throttle(e => this.handleTouchMove(e), 10);
        this._elMouseDown = (e) => this.onPointerDown(e);
        this._elMouseUp = () => this.onPointerUp();
        this._elMouseMove = (e) => this._throttledPointerMove(e);
        this._elTouchStart = (e) => this.handleTouchStart(e);
        this._elTouchMove = (e) => this._throttledTouchMove(e);
        this._elTouchEnd = () => this.onPointerUp();
        this._debouncedUpdateTransform = debounce(() => this.updateTransform(), 10);
        this.type = 'default';
        this.title = 'Node';
        this.position = { x: 0, y: 0 };
        this.isDragging = false;
    }
    componentDidLoad() {
        window.addEventListener('mouseup', this._elMouseUp, { passive: true });
        window.addEventListener('mousemove', this._elMouseMove, { passive: false });
        this.el.addEventListener('mousedown', this._elMouseDown, {
            passive: false,
        });
        this.el.addEventListener('touchstart', this._elTouchStart, {
            passive: false,
        });
        this.el.addEventListener('touchend', this._elTouchEnd, { passive: true });
        this.el.addEventListener('touchmove', this._elTouchMove, {
            passive: false,
        });
    }
    disconnectedCallback() {
        window.removeEventListener('mouseup', this._elMouseUp);
        window.removeEventListener('mousemove', this._elMouseMove);
        this.el.removeEventListener('mousedown', this._elMouseDown);
        this.el.removeEventListener('touchstart', this._elTouchStart);
        this.el.removeEventListener('touchend', this._elTouchEnd);
        this.el.removeEventListener('touchmove', this._elTouchMove);
    }
    onPositionChange() {
        // update transform
        this._debouncedUpdateTransform();
        // this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
    updateTransform() {
        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
    }
    // handle drag and drop positioning
    onPointerDown(e) {
        e.stopPropagation();
        this.isDragging = true;
        const loc = getEventLocation(e);
        // Get the current position of the node
        const nodeRect = this.el.getBoundingClientRect();
        // Get canvas bounding rect for pan/zoom calculations
        const contentEl = this.el.closest('.flowy-content');
        if (!contentEl)
            return;
        // Store the current canvas zoom level
        const zoomMatches = contentEl.style.transform.match(/scale\((\d+(?:\.\d+)?)\)/);
        this._canvasZoom = zoomMatches ? parseFloat(zoomMatches[1]) : 1;
        // Store the current canvas pan position
        const panMatches = contentEl.style.transform.match(/translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/);
        this._canvasPan = {
            x: panMatches ? parseInt(panMatches[1], 10) : 0,
            y: panMatches ? parseInt(panMatches[2], 10) : 0,
        };
        this._dragStart = {
            x: (loc.x - nodeRect.left) / this._canvasZoom,
            y: (loc.y - nodeRect.top) / this._canvasZoom,
        };
    }
    onPointerMove(e) {
        if (!this.isDragging)
            return;
        e.stopPropagation();
        requestAnimationFrame(() => {
            const loc = getEventLocation(e);
            const newX = loc.x / this._canvasZoom - this._dragStart.x - this._canvasPan.x;
            const newY = loc.y / this._canvasZoom - this._dragStart.y - this._canvasPan.y;
            this.position = { x: newX, y: newY };
        });
    }
    onPointerUp() {
        this.isDragging = false;
    }
    handleTouchStart(e) {
        e.preventDefault();
        this.onPointerDown(e);
    }
    handleTouchMove(e) {
        e.preventDefault();
        this.onPointerMove(e);
    }
    render() {
        return (h(Host, { key: '60789d2e84dbbb19efad236e30d523769e2297c3', class: "flowy-node" }, h("div", { key: '3d8dfd59ab286d42a07dc227dcd34d2e20596b81', class: "flowy-node-header" }, this.title, h("slot", { key: 'e68f032dba0033bcfffb677606f55a8ce2728aae', name: "header" })), h("slot", { key: 'c425ea3115410cf01ca940668a6f6742fc6b75d1' }), h("div", { key: '15a9b34d0e06135a34a3da3531dd1f2df3137903', class: "flowy-node-footer" })));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map