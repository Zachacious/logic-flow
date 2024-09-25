import { r as registerInstance, h, a as Host, g as getElement } from './index-b0f06aeb.js';

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
        return (h(Host, { key: 'aafadd77c06f2590c38558a4f5f7e7d883d78f1c', class: `logic-flow-connector ${typeClass}` }, h("div", { key: '613fc23eb2ca71e7becc7048be12cb6e7dd2d893', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: '7f878cc9f641d0d3e331f18fa58516fed5d7c0a7', class: `connector-content ${sideClass}` }, h("slot", { key: '583028291f911011c4d8016862b9bb5cb11e745a' }))));
    }
    get el() { return getElement(this); }
};
LogicFlowConnector.style = logicFlowConnectorCss;

export { LogicFlowConnector as logic_flow_connector };

//# sourceMappingURL=logic-flow-connector.entry.js.map