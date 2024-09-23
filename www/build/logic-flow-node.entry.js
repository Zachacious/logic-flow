import { r as registerInstance, h, a as Host, g as getElement } from './index-2bf55485.js';

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
        return (h(Host, { key: '8611c6f0ef81e0ea9b3a0543698ff7c71eeb58ea', class: "logic-flow-node", style: this.style }, h("div", { key: 'f556fa2604c90ca5924dbd6df973fb58be5f50e2', class: "logic-flow-node-header" }, this.title, h("slot", { key: '5653b3f15b9d34e0fcf899001ff2950c78d08eb2', name: "header" })), h("slot", { key: '6a37abedddb418d86ec991080becba2c7bc7a6e1' }), h("div", { key: 'cb9888d0c98cf88a5415f01a8fd7ec8db8e11dc9', class: "logic-flow-node-footer" }, h("slot", { key: '996517a2a4a14c4cef040dc4d8f219f81309d5ab', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicFlowNode.style = logicFlowNodeCss;

export { LogicFlowNode as logic_flow_node };

//# sourceMappingURL=logic-flow-node.entry.js.map