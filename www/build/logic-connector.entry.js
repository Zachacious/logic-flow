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
        return (h(Host, { key: '3c47311db938164d57757ae86dafb0025cce81f4', class: `logic-connector ${typeClass}`, id: this._uid }, h("div", { key: '36372b6d726862eb44f7d5b62c721315ff06cf22', class: `connector ${sideClass}` }), h("div", { key: '59776356eec7f02a9ef149906426514496632783', class: `connector-content ${sideClass}` }, h("slot", { key: '8654f38e49396ffb77cdff3ce4d2b3a9e58fbdec' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map