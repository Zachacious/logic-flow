import { r as registerInstance, h, a as Host, g as getElement } from './index-c090f9ce.js';
import { g as global } from './global-4b3b539c.js';

const logicConnectorCss = ":host{display:block}";

const LogicConnector = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = global().registerConnector(this);
        this.type = 'input';
        this.connectingConnector = null;
        this.connections = [];
    }
    async getUid() {
        return this._uid;
    }
    async destroy() {
        global().unregisterConnector(this._uid);
    }
    componentDidLoad() {
        const connector = this.el.querySelector('.connector');
        const rect = connector.getBoundingClientRect();
        global().connectorRects[this._uid] = {
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
        };
    }
    disconnectedCallback() {
        global().unregisterConnector(this._uid);
    }
    render() {
        const sideClass = this.type === 'input' ? 'left-connector' : 'right-connector';
        const typeClass = this.type === 'input' ? 'input-connector' : 'output-connector';
        return (h(Host, { key: '7fb680dc9631511da98fbc9f7a7f661b65231cf0', class: `logic-connector ${typeClass}`, id: this._uid }, h("div", { key: '9ccea58463826cf8c91e13c9b92b77a0b02c1151', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: 'b56257bc90391849e32c695a9c276328f37ac10b', class: `connector-content ${sideClass}` }, h("slot", { key: '84d21e9f50e9e3bc05322167f907a545461cbad5' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map