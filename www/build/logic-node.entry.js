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
        return (h(Host, { key: '16f1fffc3a1ff1fc6470fd988c27e22bd5f6d383', class: "flowy-node", id: this._uid }, h("div", { key: '18dd7ce00ec6cce1e318ed564ed698fd3741da5e', class: "flowy-node-header" }, this.title, h("slot", { key: 'cf42cddde166e9027d2a79cfdaf3ea4f5fc210a0', name: "header" })), h("slot", { key: '149aa061b658f759acb061c66f73e2df86e8b2d2' }), h("div", { key: '3f61f0893b1570980960d2231b95befc275723a1', class: "flowy-node-footer" }, h("slot", { key: '32ad9f220c3e5db390de37aadf2b73d9440e8f7f', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map