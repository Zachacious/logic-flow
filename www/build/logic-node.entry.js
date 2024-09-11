import { r as registerInstance, h, a as Host, g as getElement } from './index-2e7362b2.js';
import { t as throttle, e as events } from './events-121209b8.js';
import './_commonjsHelpers-bc8ff177.js';

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._throttledPointerMove = throttle(e => this.onPointerMove(e), 30);
        this._throttledTouchMove = throttle(e => this.handleTouchMove(e), 30);
        this._elMouseDown = (e) => this.onPointerDown(e);
        this._elMouseUp = () => this.onPointerUp();
        this._elMouseMove = (e) => this._throttledPointerMove(e);
        this._elTouchStart = (e) => this.handleTouchStart(e);
        this._elTouchMove = (e) => this._throttledTouchMove(e);
        this._elTouchEnd = () => this.onPointerUp();
        this.type = 'default';
        this.title = 'Node';
        this.position = { x: 0, y: 0 };
        this.isDragging = false;
    }
    componentDidLoad() {
        // this.updatePosition();
        window.addEventListener('mouseup', this._elMouseUp, { passive: true });
        window.addEventListener('mousemove', this._elMouseMove, { passive: true });
        this.el.addEventListener('mousedown', this._elMouseDown, { passive: true });
        // this.el.addEventListener('mouseup', this._elMouseUp, { passive: true });
        // this.el.addEventListener('mousemove', this._elMouseMove, { passive: true });
        this.el.addEventListener('touchstart', this._elTouchStart, {
            passive: true,
        });
        this.el.addEventListener('touchend', this._elTouchEnd, { passive: true });
        this.el.addEventListener('touchmove', this._elTouchMove, { passive: true });
    }
    onIsDraggingChange() {
        if (this.isDragging) {
            events.emit('nodeDragStart', this.el, this.position);
        }
        else {
            events.emit('nodeDragStopped', this.el);
        }
    }
    // @Watch('position')
    // onPositionChange() {
    //   this.updatePosition();
    // }
    // updatePosition() {
    //   this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    // }
    // getEventLocation(event: MouseEvent | TouchEvent) {
    //   if (event instanceof TouchEvent) {
    //     if (event.touches && event.touches[0]) {
    //       return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    //     }
    //   } else {
    //     return { x: event.clientX, y: event.clientY };
    //   }
    // }
    // handle drag and drop positioning
    onPointerDown(e) {
        e.stopPropagation();
        this.isDragging = true;
        // this._dragStart = this.getEventLocation(e);
    }
    onPointerMove(e) {
        if (!this.isDragging)
            return;
        e.stopPropagation();
        // const loc = this.getEventLocation(e);
        // const dx = loc.x - this._dragStart.x;
        // const dy = loc.y - this._dragStart.y;
        // this.position = { x: this.position.x + dx, y: this.position.y + dy };
    }
    onPointerUp() {
        this.isDragging = false;
        // update position with new transform
        const transform = this.el.style.transform;
        const matches = transform.match(/translate\((\d+)px, (\d+)px\)/);
        if (matches) {
            this.position = {
                x: parseInt(matches[1], 10),
                y: parseInt(matches[2], 10),
            };
        }
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
        return (h(Host, { key: 'c397067a2597a4dbe994e86a5703a4771dac3e30', class: "flowy-node" }, h("div", { key: 'a957519f2cea703329922a2474870afc4e30ddc2', class: "flowy-node-header" }, this.title, h("slot", { key: '854f8e65e8edc48c27412d30cf9dee8093ee3473', name: "header" })), h("slot", { key: 'ff8debd9040bf0504ad89a5b3ac52127e05fb644' }), h("div", { key: 'd19edb46de5633814115ab497978290222aee6de', class: "flowy-node-footer" })));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "isDragging": ["onIsDraggingChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map