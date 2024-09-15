import { r as registerInstance, h, a as Host, g as getElement } from './index-d2e5e60a.js';
import { g as global } from './global-87087290.js';

const logicConnectorCss = ":host{display:block}";

const LogicConnector = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = global().registerConnector(this);
        this.type = 'input';
        this.connectingConnector = null;
        this.connections = [];
    }
    componentDidLoad() {
        const connector = this.el.querySelector('.connector');
        const rect = connector.getBoundingClientRect();
        global().connectorRects[this._uid] = {
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
        };
    }
    render() {
        const sideClass = this.type === 'input' ? 'left-connector' : 'right-connector';
        const typeClass = this.type === 'input' ? 'input-connector' : 'output-connector';
        return (h(Host, { key: '0003a7416d75d31b9aa1a5dd7c10e02ce42b0688', class: `logic-connector ${typeClass}`, id: this._uid }, h("div", { key: '5d73cd0ca0b6034141119f3fb7b6e9aa1a8b2bc9', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: 'b9200b9f89d488afc5f18a9f166f6d13eccb953e', class: `connector-content ${sideClass}` }, h("slot", { key: '02689ac1a7c4d603bdfeba42c812101789c0de09' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map