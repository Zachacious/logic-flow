import { r as registerInstance, h, a as Host, g as getElement } from './index-d0f1914e.js';

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
        return (h(Host, { key: 'fac695b607bd9ff5f462b5fea0b4ea4659a5bf3f', class: `logic-flow-connector ${typeClass}` }, h("div", { key: 'd8c7dd8dbda44279533377b2f17d766f1774139e', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: 'ce490168b788a5d3864fe7474763ef4eea9b37c3', class: `connector-content ${sideClass}` }, h("slot", { key: '0b14aca6c73c27060e1814e051fbb6c6e2823c12' }))));
    }
    get el() { return getElement(this); }
};
LogicFlowConnector.style = logicFlowConnectorCss;

export { LogicFlowConnector as logic_flow_connector };

//# sourceMappingURL=logic-flow-connector.entry.js.map