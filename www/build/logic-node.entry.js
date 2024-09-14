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
        return (h(Host, { key: '613b4744cd0959709de0e9709c9556a440a43cee', class: "flowy-node", id: this._uid }, h("div", { key: 'a2bfbebffcad9df500b70861aba0a67b90309fbb', class: "flowy-node-header" }, this.title, h("slot", { key: 'c8533d7736d207cc5181047e56e6842fc9ceb9fa', name: "header" })), h("slot", { key: '6a33416f39baeb1b657d9e3bfdb1c83681b0091d' }), h("div", { key: 'f53cf36d237bf623b46c391f81f5b1663bd9a77e', class: "flowy-node-footer" }, h("slot", { key: '208a7b6e60f846a5e8ae0e2624a8536c33e6aa35', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map