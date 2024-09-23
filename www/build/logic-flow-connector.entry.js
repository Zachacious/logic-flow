import { r as registerInstance, h, a as Host, g as getElement } from './index-2bf55485.js';

const logicFlowConnectorCss = ":host{display:block}";

const LogicFlowConnector = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.type = 'input';
        this.connectingConnector = null;
        this.connections = [];
    }
    render() {
        const sideClass = this.type === 'input' ? 'left-connector' : 'right-connector';
        const typeClass = this.type === 'input' ? 'input-connector' : 'output-connector';
        return (h(Host, { key: '46898498102a32970234b732db2a68a757dc5477', class: `logic-flow-connector ${typeClass}` }, h("div", { key: 'e8b3e6f79e259df9b56f7d563fc349da2ac408c3', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: 'c0e865ec9e7b5b4c90ed6c9c050a217437e49868', class: `connector-content ${sideClass}` }, h("slot", { key: 'fffeaf8718f7a3c6ee7c02c95b3b30f5116b762e' }))));
    }
    get el() { return getElement(this); }
};
LogicFlowConnector.style = logicFlowConnectorCss;

export { LogicFlowConnector as logic_flow_connector };

//# sourceMappingURL=logic-flow-connector.entry.js.map