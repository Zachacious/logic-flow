import { r as registerInstance, h, a as Host, g as getElement } from './index-215890eb.js';
import { d as debounce } from './debounce-25523ff8.js';
import { n as nanoid } from './index.browser-00c404f8.js';

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = nanoid();
        this._dragStart = { x: 0, y: 0 };
        this._debouncedUpdateTransform = debounce(() => this.updateTransform(), 10);
        this.type = 'default';
        this.title = 'Node';
        this.position = { x: 0, y: 0 };
        this.isDragging = false;
    }
    onPositionChange() {
        // update transform
        this._debouncedUpdateTransform();
    }
    updateTransform() {
        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
    }
    render() {
        return (h(Host, { key: '425633f510c2b082e7eda3e1fa9b3d2952219e5e', class: "flowy-node", id: this._uid }, h("div", { key: '091fd7f34e339419b86a931fa26d72644400115e', class: "flowy-node-header" }, this.title, h("slot", { key: 'cae0826c347698991611c603fa310a903642b278', name: "header" })), h("slot", { key: 'bea2b11c4c7f33bb84525b8896f49694ce870638' }), h("div", { key: 'f05e726aafc00fafaf8073d982d2874f315fb406', class: "flowy-node-footer" }, h("slot", { key: '26a362005e94b4a07f174644ae29557795a25dc8', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map