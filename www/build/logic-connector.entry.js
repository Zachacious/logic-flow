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
        return (h(Host, { key: '9a1f79f664819ef215fba595deb00ae7c06fa37e', class: `logic-connector ${typeClass}` }, h("div", { key: '83b80ca6f8b21c733b08b9fb5e7608e194321ce5', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: '0ffc305c187cbffe60dfa1d27aab64facfb504ae', class: `connector-content ${sideClass}` }, h("slot", { key: '72408476e452f136f567b8343fbb9ab3ab6dfafa' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map