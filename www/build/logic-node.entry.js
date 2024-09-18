import { r as registerInstance, h, a as Host, g as getElement } from './index-c090f9ce.js';
import { g as global } from './global-ed0ca1da.js';
import { d as debounce } from './debounce-25523ff8.js';

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = global().registerNode(this);
        this._updateConnectorQuadtreeDebounced = debounce(() => this.updateConnectorQuadtree(), 100);
        this.type = 'default';
        this.title = 'Node';
        this.position = { x: 0, y: 0 };
        this.size = { width: 0, height: 0 };
        this.isDragging = false;
    }
    async getUid() {
        return this._uid;
    }
    async destroy() {
        global().unregisterNode(this._uid);
    }
    componentWillLoad() {
        //  set initial size
        this.updateTransform();
        const rect = this.el.getBoundingClientRect();
        this.size = { width: rect.width, height: rect.height };
        this.position = { x: this.position.x, y: this.position.y };
    }
    disconnectedCallback() {
        global().unregisterNode(this._uid);
    }
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
    updateConnectorQuadtree() {
        const connectors = this.el.querySelectorAll('logic-connector');
        connectors.forEach((connector) => {
            connector.updateQuadtree();
        });
    }
    render() {
        return (h(Host, { key: 'aa7261ccb734a25e74ed936b14c641a48be4edad', class: "flowy-node", id: this._uid }, h("div", { key: '9e46c2c565bc3ac417c3fc485c2d72367dc2f0e9', class: "flowy-node-header" }, this.title, h("slot", { key: '7c3b70714aded7b52b22eb25405df1902860689d', name: "header" })), h("slot", { key: '85a808e05e478b911257248aedf3588d4e28c850' }), h("div", { key: '17b62893cf037af3eefa4ccfa7df1d869ba3aa5c', class: "flowy-node-footer" }, h("slot", { key: '316a364887886b5c1ff2dcde9ed39d24b5b5aa18', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map