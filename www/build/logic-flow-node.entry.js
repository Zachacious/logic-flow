import { r as registerInstance, h, a as Host, g as getElement } from './index-519b580e.js';

const logicFlowNodeCss = ":host{display:block}";

const LogicFlowNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.style = {};
        this.type = 'default';
        this.title = 'Node';
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
    // @Watch('data-visible')
    // onDataChange() {
    //   // console.log('data-trigger changed', this.el.dataset.visible);
    //   forceUpdate(this);
    //   console.log('force update', this.el.id);
    // }
    updateTransform() {
        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
    }
    // componentWillRender() {
    //   if (!this.isVisible) return false;
    // }
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
        return (h(Host, { key: '13015bdf221f15ee0f9514337eff5f20ecfdca1b', class: "logic-flow-node", style: this.style }, h("div", { key: '62c5b21931a50195407abef866e4b87ecab83b44', class: "logic-flow-node-header" }, this.title, h("slot", { key: '2d4eb743fcdf36eb48c3828acac2cdb21ed10203', name: "header" })), h("slot", { key: '24df37415368f6ead75e489026f3a01a8793b298' }), h("div", { key: '64619bcdba3c925e71b3e8ce5fb4540fa7d0e1ac', class: "logic-flow-node-footer" }, h("slot", { key: 'cfc4a5698b21173a0f56d3f06e4bcafe0aaa90ca', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicFlowNode.style = logicFlowNodeCss;

export { LogicFlowNode as logic_flow_node };

//# sourceMappingURL=logic-flow-node.entry.js.map