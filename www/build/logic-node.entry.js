import { r as registerInstance, h, a as Host, g as getElement } from './index-2e7362b2.js';
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
        return (h(Host, { key: '90d4e6570a91d62693fb1f646cc0066eb06b05a8', class: "flowy-node", id: this._uid }, h("div", { key: '71f08e43a6fead7086e272d14f91bc17be70c881', class: "flowy-node-header" }, this.title, h("slot", { key: 'ef634018d2e7a8269d614a50f750bc86b6c97bb9', name: "header" })), h("slot", { key: 'fb7392f49c5d16771b107bc9dcb18e390eaf5df6' }), h("div", { key: 'a7f4223a867a79e6c4c9cd13deba65004f7e4ea2', class: "flowy-node-footer" }, h("slot", { key: '0627943f7a9486bc6bb19f46050e3e5c43d19e39', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map