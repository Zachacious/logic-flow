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
        return (h(Host, { key: 'a37eb86b3b56273b9fa311c9383ea634aefa31bc', class: `logic-connector ${typeClass}`, id: this._uid }, h("div", { key: '657c825b8e47fc7e9aa787fd8e7663ad1b67330d', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: 'ac1533cc3915d495ba794ae266043f1142641d5a', class: `connector-content ${sideClass}` }, h("slot", { key: '98aa65a7b09411786c10528569d2874e7a9ffe28' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map