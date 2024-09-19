import { r as registerInstance, h, a as Host, g as getElement } from './index-d2e5e60a.js';

const logicConnectorCss = ":host{display:block}";

const LogicConnector = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.type = 'input';
        this.connectingConnector = null;
        this.connections = [];
    }
    // private _uid: string;
    // @Method()
    // async getUid() {
    //   return this._uid;
    // }
    render() {
        const sideClass = this.type === 'input' ? 'left-connector' : 'right-connector';
        const typeClass = this.type === 'input' ? 'input-connector' : 'output-connector';
        return (h(Host, { key: 'e49d756656746a19d4a1ba20bf4a51f364bb7c79', class: `logic-connector ${typeClass}` }, h("div", { key: 'cc3a413de6fca4c3717d6c3a8f5139dedfdcd6a0', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: 'e0db3a2a3ac83c8559eb3c8636c59385aa204de9', class: `connector-content ${sideClass}` }, h("slot", { key: 'e284a2d1cb86199553d7ba1eec133cfb4b6bc7df' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map