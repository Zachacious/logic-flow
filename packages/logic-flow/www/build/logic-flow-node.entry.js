import { r as registerInstance, h, a as Host, g as getElement } from './index-d0f1914e.js';

const logicFlowNodeCss = ":host{display:block}";

const LogicFlowNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.style = {};
        this.type = 'default';
        this.name = 'Node';
        this.position = { x: 0, y: 0 };
        this.isVisible = true;
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
    componentWillRender() {
        if (!this.isVisible) {
            this.style = { display: 'none' };
        }
        else {
            this.style = {};
        }
    }
    render() {
        console.log('render', this.isVisible);
        return (h(Host, { key: '94522f0175aee6bb2d4ebd9c1ebb03204b8a5d87', class: "logic-flow-node", style: this.style }, h("div", { key: '18f60ffa236241e864b077bf09e0dd73a3b5d2e5', class: "logic-flow-node-header" }, this.name, h("slot", { key: 'e7b937fc90a074d028199527a99f840f86c59751', name: "header" })), h("slot", { key: '0b78beae388362f339f1a1d8e840d0b714037038' }), h("div", { key: '24797e1ec9493f5b6248ea1f933d2ea841d8f3ef', class: "logic-flow-node-footer" }, h("slot", { key: '6eb33170eb3743030d41151e189facf55ce0d36c', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicFlowNode.style = logicFlowNodeCss;

export { LogicFlowNode as logic_flow_node };

//# sourceMappingURL=logic-flow-node.entry.js.map