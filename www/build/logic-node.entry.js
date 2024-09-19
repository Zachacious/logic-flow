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
    // private _uid: string = global().registerNode(this);
    // private _updateConnectorQuadtreeDebounced = debounce(
    //   () => this.updateConnectorQuadtree(),
    //   100,
    // );
    // @Method()
    // async getUid() {
    //   return this._uid;
    // }
    // @Method()
    // async destroy() {
    //   global().unregisterNode(this._uid);
    // }
    componentWillLoad() {
        //  set initial size
        this.updateTransform();
        // const rect = this.el.getBoundingClientRect();
        // this.size = { width: rect.width, height: rect.height };
        this.position = { x: this.position.x, y: this.position.y };
    }
    // disconnectedCallback() {
    //   global().unregisterNode(this._uid);
    // }
    onPositionChange() {
        // update transform
        this.updateTransform();
        // this._updateConnectorQuadtreeDebounced();
    }
    updateTransform() {
        // requestAnimationFrame(() => {
        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
        // });
    }
    // updateConnectorQuadtree() {
    //   const connectors = this.el.querySelectorAll('logic-connector');
    //   connectors.forEach((connector: HTMLLogicConnectorElement) => {
    //     connector.updateQuadtree();
    //   });
    // }
    render() {
        return (h(Host, { key: 'cb3e953855b4c6e447c099a3e82eb88d847c3b91', class: "flowy-node" }, h("div", { key: '826c7ab9bcac44568585d6d750d7cceb5a3f1d82', class: "flowy-node-header" }, this.title, h("slot", { key: '47b32bf61335cb330f2067bc5ed1616250dc3e67', name: "header" })), h("slot", { key: 'c220f31369dde126bedc2f56e3d024fd01873ffd' }), h("div", { key: 'b5229c22d9c01f856dc759444fd10498295294b8', class: "flowy-node-footer" }, h("slot", { key: '52fd5938a7dbab59af69ade2da4d8ae26a7459b6', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map