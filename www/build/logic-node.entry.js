import { r as registerInstance, h, a as Host, g as getElement } from './index-2e7362b2.js';
import { d as debounce } from './debounce-25523ff8.js';
import { n as nanoid } from './index.browser-00c404f8.js';

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = nanoid();
        this._canvasZoom = 1;
        this._canvasPan = { x: 0, y: 0 };
        this._dragStart = { x: 0, y: 0 };
        // private _throttledPointerMove = throttle(e => this.onPointerMove(e), 10);
        // private _throttledTouchMove = throttle(e => this.handleTouchMove(e), 10);
        // private _elMouseDown = (e: MouseEvent | TouchEvent) => this.onPointerDown(e);
        // private _elMouseUp = () => this.onPointerUp();
        // private _elMouseMove = (e: MouseEvent | TouchEvent) =>
        //   this._throttledPointerMove(e);
        // private _elTouchStart = (e: TouchEvent) => this.handleTouchStart(e);
        // private _elTouchMove = (e: TouchEvent) => this._throttledTouchMove(e);
        // private _elTouchEnd = () => this.onPointerUp();
        this._debouncedUpdateTransform = debounce(() => this.updateTransform(), 10);
        this.type = 'default';
        this.title = 'Node';
        this.position = { x: 0, y: 0 };
        this.isDragging = false;
    }
    componentDidLoad() {
        // window.addEventListener('mouseup', this._elMouseUp, { passive: true });
        // window.addEventListener('mousemove', this._elMouseMove, { passive: false });
        // this.el.addEventListener('mousedown', this._elMouseDown, {
        //   passive: false,
        // });
        // this.el.addEventListener('touchstart', this._elTouchStart, {
        //   passive: false,
        // });
        // this.el.addEventListener('touchend', this._elTouchEnd, { passive: true });
        // this.el.addEventListener('touchmove', this._elTouchMove, {
        //   passive: false,
        // });
    }
    disconnectedCallback() {
        // window.removeEventListener('mouseup', this._elMouseUp);
        // window.removeEventListener('mousemove', this._elMouseMove);
        // this.el.removeEventListener('mousedown', this._elMouseDown);
        // this.el.removeEventListener('touchstart', this._elTouchStart);
        // this.el.removeEventListener('touchend', this._elTouchEnd);
        // this.el.removeEventListener('touchmove', this._elTouchMove);
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
    // onPointerDown(e: MouseEvent | TouchEvent) {
    //   // e.stopPropagation();
    //   this.isDragging = true;
    //   const loc = getEventLocation(e);
    //   // Get the current position of the node
    //   const nodeRect = this.el.getBoundingClientRect();
    //   // Get canvas bounding rect for pan/zoom calculations
    //   const contentEl = this.el.closest('.flowy-content') as HTMLElement;
    //   if (!contentEl) return;
    //   // Store the current canvas zoom level
    //   const zoomMatches = contentEl.style.transform.match(
    //     /scale\((\d+(?:\.\d+)?)\)/,
    //   );
    //   this._canvasZoom = zoomMatches ? parseFloat(zoomMatches[1]) : 1;
    //   // Store the current canvas pan position
    //   const panMatches = contentEl.style.transform.match(
    //     /translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/,
    //   );
    //   this._canvasPan = {
    //     x: panMatches ? parseInt(panMatches[1], 10) : 0,
    //     y: panMatches ? parseInt(panMatches[2], 10) : 0,
    //   };
    //   this._dragStart = {
    //     x: (loc.x - nodeRect.left) / this._canvasZoom,
    //     y: (loc.y - nodeRect.top) / this._canvasZoom,
    //   };
    // }
    // onPointerMove(e: MouseEvent | TouchEvent) {
    //   if (!this.isDragging) return;
    //   e.stopPropagation();
    //   requestAnimationFrame(() => {
    //     const loc = getEventLocation(e);
    //     const newX =
    //       loc.x / this._canvasZoom - this._dragStart.x - this._canvasPan.x;
    //     const newY =
    //       loc.y / this._canvasZoom - this._dragStart.y - this._canvasPan.y;
    //     this.position = { x: newX, y: newY };
    //   });
    // }
    // onPointerUp() {
    //   this.isDragging = false;
    // }
    // handleTouchStart(e: TouchEvent) {
    //   e.preventDefault();
    //   this.onPointerDown(e);
    // }
    // handleTouchMove(e: TouchEvent) {
    //   e.preventDefault();
    //   this.onPointerMove(e);
    // }
    render() {
        return (h(Host, { key: 'c88364e6fe899dab72eb501e7364d28fd0af86a6', class: "flowy-node", id: this._uid }, h("div", { key: '52e4daab17dcb6e6182b800e34aa0142cc67ec81', class: "flowy-node-header" }, this.title, h("slot", { key: '25b671834aaf9aa59007c5617f40d09db263e9b5', name: "header" })), h("slot", { key: '53c2f2e1dc0724860e032fa759735d4c1fd56bb6' }), h("div", { key: '914a9074949352113e0d160391b390a87a6e589e', class: "flowy-node-footer" })));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map