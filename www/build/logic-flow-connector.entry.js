import { r as registerInstance, h, a as Host, g as getElement } from './index-519b580e.js';

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
        return (h(Host, { key: 'c12ae0873dd6319a983f53f57244635d96b380d5', class: `logic-flow-connector ${typeClass}` }, h("div", { key: 'c058a8fafac8014aedd0274bad45c5a72e317997', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: '91999bf05d2bce28e671f48fdab16acdecb188aa', class: `connector-content ${sideClass}` }, h("slot", { key: '818e7c38b0f845add900699d3eb57be80ea47524' }))));
    }
    get el() { return getElement(this); }
};
LogicFlowConnector.style = logicFlowConnectorCss;

export { LogicFlowConnector as logic_flow_connector };

//# sourceMappingURL=logic-flow-connector.entry.js.map