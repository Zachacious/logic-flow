import { r as registerInstance, h, a as Host, g as getElement } from './index-b0f06aeb.js';

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
        return (h(Host, { key: '55896fcc4241149925dba3d85d3422392bb6a29f', class: "logic-flow-node", style: this.style }, h("div", { key: '6bef45bdf4c187f73e436dff228dddd29febe746', class: "logic-flow-node-header" }, this.title, h("slot", { key: '2bc34b78ce0191321bcb278c335c9cc30756d19b', name: "header" })), h("slot", { key: '04ac93a2df7803e692dc64180249d1a8c9216e76' }), h("div", { key: 'c52ac3267db1c10829366896d2e369aa5d7a5421', class: "logic-flow-node-footer" }, h("slot", { key: 'ee623848b68a21491da22077dbf653a342b09cbe', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicFlowNode.style = logicFlowNodeCss;

export { LogicFlowNode as logic_flow_node };

//# sourceMappingURL=logic-flow-node.entry.js.map