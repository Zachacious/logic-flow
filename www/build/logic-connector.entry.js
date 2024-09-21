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
        return (h(Host, { key: '46f29ca394e58c9900292b9ed05361040152d143', class: `logic-connector ${typeClass}` }, h("div", { key: 'b240ef6b68b2a04c4651b509a75fea2797c14d5e', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: 'a60326aeb0dcf2a3bdef33b858455768065f8389', class: `connector-content ${sideClass}` }, h("slot", { key: 'ea47ca4e87b8d0aad27025527f368144994928b9' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map