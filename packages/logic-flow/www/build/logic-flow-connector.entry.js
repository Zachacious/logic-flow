import { r as registerInstance, h, a as Host, g as getElement } from './index-4b3244cf.js';

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
        return (h(Host, { key: 'c8043c99c61498bb68c379af6dd7ef5bd6d406aa', class: `logic-flow-connector ${typeClass}` }, h("div", { key: 'e7ab8a928f57dee28e5e750ce5bf2a4cfb8d8475', class: `connector ${sideClass} ${(this.connections.length > 0 && 'connected') || ''}` }), h("div", { key: 'd123f68bd956f720cc6d7eb1d0679acdd357d506', class: `connector-content ${sideClass}` }, h("slot", { key: 'fbd584135f7ea35ff1eee41552e70998110609b8' }))));
    }
    get el() { return getElement(this); }
};
LogicFlowConnector.style = logicFlowConnectorCss;

export { LogicFlowConnector as logic_flow_connector };

//# sourceMappingURL=logic-flow-connector.entry.js.map