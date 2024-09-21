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
        return (h(Host, { key: 'c5602f5b33ce579188b419c4d71331c79b904c46', class: "flowy-node" }, h("div", { key: '8d413ad5ed4409fcead781618f9a54e821671f89', class: "flowy-node-header" }, this.title, h("slot", { key: '095742879581b6002d2b7423ea08bc69b329e371', name: "header" })), h("slot", { key: 'de6edbb650d2c1993c2043baa48b417f0fca872d' }), h("div", { key: '965b146d653efb0a5c66b9f6450ebc112a06f173', class: "flowy-node-footer" }, h("slot", { key: '370940bfbaa0d31590ec266a201b36e098c86016', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map