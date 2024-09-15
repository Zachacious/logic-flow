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
        return (h(Host, { key: '109c17b40cece960ad5990bbd9be744d59d369ad', class: "flowy-node", id: this._uid }, h("div", { key: 'c1be5a4894ba7ac2185331c34796c820426f5ec7', class: "flowy-node-header" }, this.title, h("slot", { key: 'db09222735f469bbef9ba3f2b58bf2f728c259b2', name: "header" })), h("slot", { key: 'd937098f2c35996f8d5df0358cfa56eca5e0e7e5' }), h("div", { key: '0713dc3b69aae37a2e4c7ed6c208caba4c282f6b', class: "flowy-node-footer" }, h("slot", { key: '45580640b669bfee386bd70d60b003de0dd5cfe3', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map