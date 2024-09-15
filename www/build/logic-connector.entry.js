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
        return (h(Host, { key: '8b18a4e138faf7e4c4cce7c0efdabc82542027d9', class: `logic-connector ${typeClass}`, id: this._uid }, h("div", { key: 'b64b068923f325c4184a33733457073a2fedd8b4', class: `connector ${sideClass}` }), h("div", { key: '0063821ae0cc3eceb0d8fcab17a6714d82499763', class: `connector-content ${sideClass}` }, h("slot", { key: '50fbc68f6af8288108c58e1cdc3d7a56746ffb3b' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map