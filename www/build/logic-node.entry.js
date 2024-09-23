import { r as registerInstance, h, a as Host, g as getElement } from './index-2bf55485.js';

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
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
        return (h(Host, { key: 'b4dfdffc9e32c20ac67d25c7555411cb937bb8c0', class: "flowy-node", style: this.style }, h("div", { key: '0affa285a076a82426c46ce1b292476d1b2a1853', class: "flowy-node-header" }, this.title, h("slot", { key: '94322ddac0bf04235890d34d9eb4377e8cb16e2d', name: "header" })), h("slot", { key: '1c8577e4bc61aa0e079cc41b4561fed8aab16825' }), h("div", { key: 'f9b600a96584f4c8e546081c3e32af2e15d7fb00', class: "flowy-node-footer" }, h("slot", { key: '48450353fead58f6350c8177903a9849b71bbf59', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map