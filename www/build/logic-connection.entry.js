import { r as registerInstance, h, a as Host } from './index-d2e5e60a.js';
import { g as global } from './global-87087290.js';

const logicConnectionCss = ":host{display:block}";

const LogicConnection = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = global().registerConnection(this);
        this.start = { x: 0, y: 0 };
        this.end = { x: 0, y: 0 };
        this.type = 'input';
    }
    updatePath() {
        // requestAnimationFrame(() => {
        const delta = {
            x: this.end.x - this.start.x,
            y: this.end.y - this.start.y,
        };
        const distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);
        const controlOffset = Math.min(200, distance * 0.5);
        // curve should be different depending on the direction
        // if point comes out from left - curve should go to the right
        if (this.type === 'output') {
            this.path = `M ${this.start.x},${this.start.y}
          C ${this.start.x + controlOffset},${this.start.y}
            ${this.end.x - controlOffset},${this.end.y}
            ${this.end.x},${this.end.y}`;
        }
        // if point comes out from right - curve should go to the left
        else {
            // so we need to swap control points
            this.path = `M ${this.start.x},${this.start.y}
          C ${this.start.x - controlOffset},${this.start.y}
            ${this.end.x + controlOffset},${this.end.y}
            ${this.end.x},${this.end.y}`;
        }
        // });
    }
    render() {
        return (h(Host, { key: '7c4005c13d2f9941ef84540b6d1da7eb62bc9219', class: "logic-connection", id: this._uid }, h("svg", { key: '80d5a99aee98a332a484035e9ad29fe56074f922', class: "connection" }, h("path", { key: '0c28c1e9beedac58e61ecb9876004e5db15da50e', class: "connection-line", d: this.path }))));
    }
    static get watchers() { return {
        "start": ["updatePath"],
        "end": ["updatePath"],
        "type": ["updatePath"]
    }; }
};
LogicConnection.style = logicConnectionCss;

export { LogicConnection as logic_connection };

//# sourceMappingURL=logic-connection.entry.js.map