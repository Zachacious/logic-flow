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
        return (h(Host, { key: '764caa8146baf244a73a2fe2ce5b0dbee7925261', class: "logic-flow-node", style: this.style }, h("slot", { key: '27d3623e362e3b76e0b05cb8a558e2342c88c2a2' })));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicFlowNode.style = logicFlowNodeCss;

export { LogicFlowNode as L };

//# sourceMappingURL=logic-flow-node-770c55f4.js.map