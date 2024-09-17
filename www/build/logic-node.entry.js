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
        this._updateConnectorQuadtreeDebounced();
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
        return (h(Host, { key: '9b232f30dba9825b0ddfc0126431914eb740ee97', class: "flowy-node", id: this._uid }, h("div", { key: 'f1390e044b1438c144ca9595ded0bd8647247bba', class: "flowy-node-header" }, this.title, h("slot", { key: '7daaaf97eafe19486e859054faa239f27d3f4ef7', name: "header" })), h("slot", { key: '8ca059c675a9366ed8309b84e00000c3ac0e1643' }), h("div", { key: 'f23fe9ab02e8ffb7de08eb6e847caf5d931baa34', class: "flowy-node-footer" }, h("slot", { key: '49dd564b93041167355b67f5970783726f376326', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map