import { r as registerInstance, h, a as Host, g as getElement } from './index-d2e5e60a.js';
import { g as global } from './global-87087290.js';

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = global().registerNode(this);
        this.type = 'default';
        this.title = 'Node';
        this.position = { x: 0, y: 0 };
        this.size = { width: 0, height: 0 };
        this.isDragging = false;
    }
    componentWillLoad() {
        //  set initial size
        this.updateTransform();
        const rect = this.el.getBoundingClientRect();
        this.size = { width: rect.width, height: rect.height };
        this.position = { x: this.position.x, y: this.position.y };
    }
    onPositionChange() {
        // update transform
        this.updateTransform();
        // this._debouncedUpdateTransform();
    }
    updateTransform() {
        // requestAnimationFrame(() => {
        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
        // });
    }
    render() {
        return (h(Host, { key: '8c569ff6db72193bc0c5623d5b2c721d89c0fff9', class: "flowy-node", id: this._uid }, h("div", { key: 'cc77d6aa7ab908a64e8bbef52c15d4976219cde3', class: "flowy-node-header" }, this.title, h("slot", { key: 'b8e635b76234eb237283b76fcefaeaf82b5aadf8', name: "header" })), h("slot", { key: 'cda17d469f18edb5e7d1ae3ce7698b8223d91e5c' }), h("div", { key: 'b1d5890aa0d3cb980009aedf8a6cb6b3e3a5c91c', class: "flowy-node-footer" }, h("slot", { key: 'e6dc2adf702dd4b0d5d4110b966441ccf90605ac', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map