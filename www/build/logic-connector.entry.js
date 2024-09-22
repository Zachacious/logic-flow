import { r as registerInstance, h, a as Host, g as getElement } from './index-2bf55485.js';

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
        return (h(Host, { key: 'ae9f7cbfd462a770ca58e2a374c6332dee2ed39a', class: `logic-connector ${typeClass}` }, h("div", { key: '0779818655bc33fbf39a680b6745eaa8b44b09ad', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: '8c895bd1bc85a9cc8e657d6deedc7704771cdfaa', class: `connector-content ${sideClass}` }, h("slot", { key: 'b492b7fc00abe2e9149ea3c8843db090dd830499' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map