import { r as registerInstance, h, a as Host } from './index-215890eb.js';

const logicConnectorCss = ":host{display:block}";

const LogicConnector = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.type = 'input';
        this.connectingConnector = null;
        this.isDrawing = false;
    }
    render() {
        const sideClass = this.type === 'input' ? 'left-connector' : 'right-connector';
        const typeClass = this.type === 'input' ? 'input-connector' : 'output-connector';
        return (h(Host, { key: 'c24c24f258b89c9e884ca2881eda92528ac1bad9', class: `logic-connector ${typeClass}` }, h("div", { key: '2e288f9bf66ef30862af46ae229e025ca29e3ca4', class: `connector ${sideClass}` }, this.isDrawing && (h("svg", { key: '5058c2f0754b6f83e56b090eca2a8bc7f17ce0fb', class: "connection-layer", xmlns: "http://www.w3.org/2000/svg" }, h("path", { key: '6df049c42c020171aca8063eb530c57e1f2c7c3b', class: "connection-line", d: "" })))), h("div", { key: 'c2865b90d5ce9aa4197132f90ae7024599276bcf', class: `connector-content ${sideClass}` }, h("slot", { key: '9034592d2f92a9225a972a3e10bb321535f31a02' }))));
    }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map