import { r as registerInstance, h, a as Host, g as getElement } from './index-d2e5e60a.js';

const logicConnectorCss = ":host{display:block}";

const LogicConnector = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.type = 'input';
        this.connectingConnector = null;
        this.connections = [];
    }
    render() {
        const sideClass = this.type === 'input' ? 'left-connector' : 'right-connector';
        const typeClass = this.type === 'input' ? 'input-connector' : 'output-connector';
        return (h(Host, { key: '79b6a99f25eeb0868972391e83b1ef53b92c3ebb', class: `logic-connector ${typeClass}` }, h("div", { key: '6af6a03b11467cfa56b729e57a69316a22c94f0b', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: '0d60a93a1497719e2a1f3622b329f6f39feaa2d7', class: `connector-content ${sideClass}` }, h("slot", { key: 'afe2bab11ea38acb4c531416fc1aa916a3a91af9' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map