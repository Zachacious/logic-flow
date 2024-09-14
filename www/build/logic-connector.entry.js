import { r as registerInstance, h, a as Host } from './index-215890eb.js';

const logicConnectorCss = ":host{display:block}";

const LogicConnector = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.type = 'input';
        this.connectingConnector = null;
        this.connection = null;
    }
    // @Prop({ mutable: true }) isDrawing: boolean = false;
    render() {
        const sideClass = this.type === 'input' ? 'left-connector' : 'right-connector';
        const typeClass = this.type === 'input' ? 'input-connector' : 'output-connector';
        return (h(Host, { key: '9f9eb5366e6c773ad7a057e0b13dda142d78116f', class: `logic-connector ${typeClass}` }, h("div", { key: 'd1485ac0191778fad7634d8c742056d2105649f5', class: `connector ${sideClass}` }), h("div", { key: 'fdc232f1218f894d786d4eddc02ccee028ef9083', class: `connector-content ${sideClass}` }, h("slot", { key: '4c74e20639669d4ff264238682d7014ee176bd17' }))));
    }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map