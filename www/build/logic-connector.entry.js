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
        return (h(Host, { key: '4dd55ef96c28d7d69f3a6379f629a729a184591e', class: `logic-connector ${typeClass}` }, h("div", { key: '4ee15c3b7dcfce5168335e1225975d5345f80b50', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: '74e9d742687dcf3051b9928901cac3639a76b5d1', class: `connector-content ${sideClass}` }, h("slot", { key: '6fb5b621c28e2b5c948887274b9b0cd587a8983c' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map