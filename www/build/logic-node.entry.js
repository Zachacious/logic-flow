import { r as registerInstance, h, a as Host, g as getElement } from './index-d2e5e60a.js';
import { g as global } from './global-87087290.js';

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = global().registerNode(this);
        this.type = 'default';
        this.title = 'Node';
        this.position = { x: 0, y: 0 };
        this.size = { width: 0, height: 0 };
        this.isDragging = false;
    }
    componentWillLoad() {
        //  set initial size
        this.updateTransform();
        const rect = this.el.getBoundingClientRect();
        this.size = { width: rect.width, height: rect.height };
        this.position = { x: this.position.x, y: this.position.y };
    }
    onPositionChange() {
        // update transform
        this.updateTransform();
        // this._debouncedUpdateTransform();
    }
    updateTransform() {
        requestAnimationFrame(() => {
            this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
        });
    }
    render() {
        return (h(Host, { key: '577ba957bc720d475133e8f8e281c5f8e91f8125', class: "flowy-node", id: this._uid }, h("div", { key: '9812ea713751cc296a66f4699ece4ab41788f190', class: "flowy-node-header" }, this.title, h("slot", { key: 'aa614ab15f7494fca005153c065e6a8a790a6e58', name: "header" })), h("slot", { key: 'a56eb4103d2047b87d0fe4b233991970095dc73e' }), h("div", { key: 'b4586177510d61626edbbc7796bd012bf294b106', class: "flowy-node-footer" }, h("slot", { key: '7bd928fe142513cd953e0b5c928b9b4bf3039e7c', name: "footer" }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map