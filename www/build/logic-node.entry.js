import { r as registerInstance, h, a as Host, g as getElement } from './index-d2e5e60a.js';

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.type = 'default';
        this.title = 'Node';
        this.position = { x: 0, y: 0 };
        this.isDragging = false;
    }
    componentWillLoad() {
        //  set initial size
        this.updateTransform();
        this.position = { x: this.position.x, y: this.position.y };
    }
    onPositionChange() {
        // update transform
        this.updateTransform();
    }
    updateTransform() {
        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
    }
    render() {
        return (h(Host, { key: '0da812a4f8293a63848e1c7786cae98d8108a62f', class: "flowy-node" }, h("div", { key: 'a36b085f19690af5d63117824d39b3b4eee4a50c', class: "flowy-node-header" }, this.title, h("slot", { key: '06254c5df5e7270655966e39a52fa3e7ae4cd9ab', name: "header" })), h("slot", { key: '4eaaab785fc2c6d1d4e1c0da79b32a66a5ce1e29' }), h("div", { key: 'e7aff843a0afbfefc77d130ec4f1229fbc0e8274', class: "flowy-node-footer" }, h("slot", { key: '53c3c27adb137248d737cdc268529a20f43f7758', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map