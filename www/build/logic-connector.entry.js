import { r as registerInstance, h, a as Host, g as getElement } from './index-c090f9ce.js';
import { g as global } from './global-ed0ca1da.js';

const logicConnectorCss = ":host{display:block}";

const LogicConnector = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = global().registerConnector(this);
        this._viewportId = '';
        this.type = 'input';
        this.connectingConnector = null;
        this.connections = [];
    }
    async getUid() {
        return this._uid;
    }
    async destroy() {
        global().unregisterConnector(this._uid);
    }
    updateQuadtree() {
        // console.log('updateQuadtree');
        const connector = this.el.querySelector('.connector');
        const rect = connector.getBoundingClientRect();
        // global().connectorRects[this._uid] = {
        //   left: rect.x,
        //   top: rect.y,
        //   width: rect.width,
        //   height: rect.height,
        // };
        // Get the quadtree for the viewport
        const quadtree = global().connectorQuadTrees.get(this._viewportId);
        //remove the connector from the quadtree
        quadtree.remove(this._uid);
        // Add the connector to the quadtree
        quadtree.insert({
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
            id: this._uid,
        });
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
        // Get the viewport
        const viewport = this.el.closest('flowy-canvas');
        if (viewport) {
            viewport.getUid().then(id => {
                this._viewportId = id;
                // Get the quadtree for the viewport
                const quadtree = global().connectorQuadTrees.get(id);
                // Add the connector to the quadtree
                quadtree.insert({
                    x: rect.x,
                    y: rect.y,
                    id: this._uid,
                });
            });
        }
    }
    disconnectedCallback() {
        global().unregisterConnector(this._uid);
    }
    render() {
        const sideClass = this.type === 'input' ? 'left-connector' : 'right-connector';
        const typeClass = this.type === 'input' ? 'input-connector' : 'output-connector';
        return (h(Host, { key: '1eb0bb5f1f1897c10916cd67cb36fe20e460a4a9', class: `logic-connector ${typeClass}`, id: this._uid }, h("div", { key: '81aec0d1f970e3c0052129a27c9259f9cc6b4302', class: `connector ${sideClass} ${this.connections.length > 0 && 'connected'}` }), h("div", { key: '37237a721030c2e04c2fe14e00c7f1e28db433c3', class: `connector-content ${sideClass}` }, h("slot", { key: '27398ffe63f28846f86168087563ded7654dc318' }))));
    }
    get el() { return getElement(this); }
};
LogicConnector.style = logicConnectorCss;

export { LogicConnector as logic_connector };

//# sourceMappingURL=logic-connector.entry.js.map