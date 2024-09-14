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
        return (h(Host, { key: 'cbafb3a62808b57124ec66e7c8a973f498d320bb', class: "logic-connection" }, h("svg", { key: 'e6b4335987f904b2c02cda513271fb9162749144', class: "connection" }, h("path", { key: 'cec10120dc36fffb9a1877ecd7d037fff65acf2b', class: "connection-line", d: d }))));
    }
};
LogicConnection.style = logicConnectionCss;

export { LogicConnection as logic_connection };

//# sourceMappingURL=logic-connection.entry.js.map