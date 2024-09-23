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
        return (h(Host, { key: '00f20a036edb9827ec7688ef9e73f02723557ab1', class: "logic-flow-node", style: this.style }, h("div", { key: '2098d441aa3cb522325123efaa8295c32cb25445', class: "logic-flow-node-header" }, this.title, h("slot", { key: '3d78c4a470397d8a1213f037d3147b0fa4a1810d', name: "header" })), h("slot", { key: '391709f7f86df976ad40abe37aa386ef58fcaeb2' }), h("div", { key: '6331e411be475eedc13f2b130a535fcc1be20c8f', class: "logic-flow-node-footer" }, h("slot", { key: '072729c075dd0e40312d83faf0f4ede986fa99a8', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicFlowNode.style = logicFlowNodeCss;

export { LogicFlowNode as logic_flow_node };

//# sourceMappingURL=logic-flow-node.entry.js.map