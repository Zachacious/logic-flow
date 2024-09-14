import { r as registerInstance, h, a as Host } from './index-215890eb.js';

const logicConnectorCss = ":host{display:block}";

const LogicConnector = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.type = 'input';
        this.connectingConnector = null;
        this.connections = [];
    }
    // @Prop({ mutable: true }) isDrawing: boolean = false;
    render() {
        const sideClass = this.type === 'input' ? 'left-connector' : 'right-connector';
        const typeClass = this.type === 'input' ? 'input-connector' : 'output-connector';
        return (h(Host, { key: '3dc73de041aebff804cfc9b6848e6007661da5d0', class: `logic-connector ${typeClass}` }, h("div", { key: '4623aa18a8e819972e829307bec9c891b573792e', class: `connector ${sideClass}` }), h("div", { key: '626938811fc990cf400b08b44b9e1c4e8e055587', class: `connector-content ${sideClass}` }, h("slot", { key: 'fe73828ae4a5c1d5505915e897b215a75b607fc6' }))));
    }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map