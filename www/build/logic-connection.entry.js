import { r as registerInstance, h, a as Host } from './index-215890eb.js';

const logicConnectionCss = ":host{display:block}";

const LogicConnection = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.start = { x: 0, y: 0 };
        this.end = { x: 0, y: 0 };
    }
    render() {
        const delta = {
            x: this.end.x - this.start.x,
            y: this.end.y - this.start.y,
        };
        const distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);
        const angle = Math.atan2(delta.y, delta.x);
        const controlOffset = Math.min(100, distance * 0.3);
        // draw smooth bezier curve
        const d = `M ${this.start.x},${this.start.y}
          C ${this.start.x + controlOffset},${this.start.y}
            ${this.end.x - controlOffset},${this.end.y}
            ${this.end.x},${this.end.y}`;
        return (h(Host, { key: '61688278dbf2ff9e4fb37bc6a1b3a5367608eb9b', class: "logic-connection" }, h("svg", { key: '37dc072e42f34bbb94d5c7ee82168d355cf04c55', class: "connection" }, h("path", { key: 'a2ff4dc7590f51ceafa99a2a42c23a646b6831e8', class: "connection-line", d: d }))));
    }
};
LogicConnection.style = logicConnectionCss;

export { LogicConnection as logic_connection };

//# sourceMappingURL=logic-connection.entry.js.map