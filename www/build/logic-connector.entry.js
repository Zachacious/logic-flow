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
        return (h(Host, { key: '01ff49d4f4066109773ab4d87255650a4657af4f', class: `logic-connector ${typeClass}`, id: this._uid }, h("div", { key: 'eec33258cd925e808007982ffc51295bdff41e57', class: `connector ${sideClass}` }), h("div", { key: 'a8a47503f5c9960739553774ffb425815a6a89b1', class: `connector-content ${sideClass}` }, h("slot", { key: '217a9db19c8a3d9ebf867092dc8f66606e0ca820' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map