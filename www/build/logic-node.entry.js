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
        return (h(Host, { key: '6285b4d2289695a4c0ca377d75b2e21685530ef9', class: "flowy-node" }, h("div", { key: 'e0b1b02a1d80511a9b32fd8d9cbf63940cd82b82', class: "flowy-node-header" }, this.title, h("slot", { key: 'a31e0b8cc559c509bdb3014b885fb56d7764b7c0', name: "header" })), h("slot", { key: 'bd6a651c1ae63150e86f9948b8352203109ae94b' }), h("div", { key: 'a54a6a8dec99776d1c3245c3037e39c97ea51a2b', class: "flowy-node-footer" }, h("slot", { key: 'b7e9e614e1b25f9edadf9120d9abdd6ea487c45a', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map