import { r as registerInstance, h, a as Host, g as getElement } from './index-c090f9ce.js';
import { g as global } from './global-4b3b539c.js';

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
    async getUid() {
        return this._uid;
    }
    async destroy() {
        global().unregisterNode(this._uid);
    }
    componentWillLoad() {
        //  set initial size
        this.updateTransform();
        const rect = this.el.getBoundingClientRect();
        this.size = { width: rect.width, height: rect.height };
        this.position = { x: this.position.x, y: this.position.y };
    }
    disconnectedCallback() {
        global().unregisterNode(this._uid);
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
        return (h(Host, { key: '0efdca8a668efcf9c67352e8187dcc7b96462209', class: "flowy-node", id: this._uid }, h("div", { key: 'd2f9c6cca808e9467445eec0fd920f4df9beb0b9', class: "flowy-node-header" }, this.title, h("slot", { key: '0db3ba216d900acbec0ffd82a3b623f65d99948a', name: "header" })), h("slot", { key: '769e988ee224349579bb9be7f1e7319f540a85ac' }), h("div", { key: '0cfc22e90358f0b2f0afe656d0134a786542c869', class: "flowy-node-footer" }, h("slot", { key: '0440cfefdf5fa81e12430e9cc643b52aefaf8961', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map