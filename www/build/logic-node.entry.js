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
        return (h(Host, { key: 'a5e83e456c355088af7580eebffb34a2e8f8483c', class: "flowy-node" }, h("div", { key: '6523ae0df732d93e19945c454a21e008bd7990f9', class: "flowy-node-header" }, this.title, h("slot", { key: 'c2f2c4506a7ec97d99412f640c7ec5935a1d1614', name: "header" })), h("slot", { key: 'fe837660f6432015448b2c69fa2c738b4f995b9d' }), h("div", { key: 'b84b267c29f55055c3cf0631cb6ca415391be341', class: "flowy-node-footer" }, h("slot", { key: 'fd2a2e1a941c648c338ebbc456a23fc68cf33698', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map