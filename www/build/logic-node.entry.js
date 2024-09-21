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
        return (h(Host, { key: 'e870475b64739e36e4cd79aae7cb0d530c80dc60', class: "flowy-node" }, h("div", { key: '6e5126e3a337a8ad5664c1b4e3b3fc88aff4d20e', class: "flowy-node-header" }, this.title, h("slot", { key: 'd9939347d9c06601d028e1f866a968a4df35a978', name: "header" })), h("slot", { key: 'b5f1490d465c9488760a17ad1b15ed6af893ef03' }), h("div", { key: '23181955c818e2dd6c8db599c6bb775f83d76110', class: "flowy-node-footer" }, h("slot", { key: 'b7b5e027ba43ce194736b54a10db91552f137b74', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map