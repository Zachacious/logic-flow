import { r as registerInstance, h, a as Host, g as getElement } from './index-4b3244cf.js';

const logicFlowNodeCss = ":host{display:block}";

const LogicFlowNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.style = {};
        this.type = 'default';
        this.position = { x: 0, y: 0 };
        this.isVisible = true;
        this.isDragging = false;
    }
    componentWillLoad() {
        //  set initial size
        this.updateTransform();
        // this.position = { x: this.position.x, y: this.position.y };
        this.onPositionChange(this.position);
    }
    onPositionChange(newValue) {
        if (typeof newValue === 'string') {
            this.position = JSON.parse(newValue);
        }
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
        // console.log('render', this.isVisible);
        return (h(Host, { key: 'e29bcde796f3fa11cb76620ca9c9fb1e165ce27f', class: "logic-flow-node", style: this.style, tabIndex: "0" }, h("slot", { key: '2c546d53db26e7e85ef093a89d4d6ad5926e2ae6' })));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicFlowNode.style = logicFlowNodeCss;

export { LogicFlowNode as logic_flow_node };

//# sourceMappingURL=logic-flow-node.entry.js.map