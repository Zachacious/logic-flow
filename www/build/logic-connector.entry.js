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
        return (h(Host, { key: '9c07b7612ab1ce2d26906c47b138bae337dc98c7', class: `logic-connector ${typeClass}` }, h("div", { key: 'dbd8bc6514732bf38ee6c8c3f8b2e10b8320129e', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: 'e0441495eb4e4bd54bb05c3dbe4bb3230ba8e1d5', class: `connector-content ${sideClass}` }, h("slot", { key: '1b13e20f8c8682c7225dbbee60fbf28616c8a4fb' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map