import { r as registerInstance, h, a as Host, g as getElement } from './index-215890eb.js';
import { d as debounce } from './debounce-25523ff8.js';
import { n as nanoid } from './index.browser-00c404f8.js';

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = nanoid();
        this._dragStart = { x: 0, y: 0 };
        this._debouncedUpdateTransform = debounce(() => this.updateTransform(), 10);
        this.type = 'default';
        this.title = 'Node';
        this.position = { x: 0, y: 0 };
        this.isDragging = false;
    }
    onPositionChange() {
        // update transform
        this._debouncedUpdateTransform();
    }
    updateTransform() {
        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
    }
    render() {
        return (h(Host, { key: '75f550b0230250b6aefc5f1ed68ff33cc1efe648', class: "flowy-node", id: this._uid }, h("div", { key: 'f6784f49f503510db7cf67ea8bea42a6003365dd', class: "flowy-node-header" }, this.title, h("slot", { key: 'ca3211a3fd6ac0f6dc8e047ea70d3291d1f8cdef', name: "header" })), h("slot", { key: 'e34a753e0d81d2410849515e4b08ab4b35e5a02a' }), h("div", { key: 'b2e5ac496a3ba1277b5acc3f8d87bd446a622f55', class: "flowy-node-footer" }, h("slot", { key: '233df9ce72e31b64c1409e1281987adacaaf0893', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map