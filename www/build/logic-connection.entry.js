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
        requestAnimationFrame(() => {
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
        });
    }
    render() {
        return (h(Host, { key: '37e6a7570d1f2e97b1620c48f04b7aeca33df936', class: "logic-connection", id: this._uid }, h("svg", { key: 'a86c35018ea4426ac78c997d72d2cb92519dbdf4', class: "connection" }, h("path", { key: '0c9b3af2a90278d8c77ecf231adc6a90630d61cd', class: "connection-line", d: this.path }))));
    }
    static get watchers() { return {
        "start": ["updatePath"],
        "end": ["updatePath"]
    }; }
};
LogicConnection.style = logicConnectionCss;

export { LogicConnection as logic_connection };

//# sourceMappingURL=logic-connection.entry.js.map