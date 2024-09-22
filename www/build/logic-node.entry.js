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
        return (h(Host, { key: 'da34c199ed8f1e19e0c2f94ece60e24dbf130cce', class: "flowy-node", style: this.style }, h("div", { key: 'fea4a28bddb8e1d241e12bed3e76c1e1338c88eb', class: "flowy-node-header" }, this.title, h("slot", { key: '1557a9727e24b0c7ab7a2031d159cd64d8d2ff43', name: "header" })), h("slot", { key: '5d31f84a2086d662122383d2e472d4c8c03af54f' }), h("div", { key: '206e8a98d9da02444904bacc5a5236f4c4b6eca2', class: "flowy-node-footer" }, h("slot", { key: 'c7b74fab13d4a952f31d224cc45c628c5ef40497', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map