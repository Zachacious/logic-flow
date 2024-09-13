import { r as registerInstance, h, a as Host } from './index-2e7362b2.js';

const logicConnectorCss = ":host{display:block}";

const LogicConnector = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.type = 'input';
    }
    render() {
        const sideClass = this.type === 'input' ? 'left-connector' : 'right-connector';
        const typeClass = this.type === 'input' ? 'input-connector' : 'output-connector';
        return (h(Host, { key: '2222df67cd4402e640283002e013fd7509cb96af', class: `logic-connector ${typeClass}` }, h("div", { key: '3e33d4b1b7bf576c928c101a3eaa112959c63977', class: `connector ${sideClass}` }), h("div", { key: '8173491fa8b25c975bedb04a19b88c6b661947ef', class: `connector-content ${sideClass}` }, h("slot", { key: 'fa72e597cbd804fc498ab2e3c89e1c62c547b2a0' }))));
    }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map