import { r as registerInstance, h, a as Host } from './index-d2e5e60a.js';
import { g as global } from './global-87087290.js';

const logicConnectionCss = ":host{display:block}";

const LogicConnection = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._uid = global().registerConnection(this);
        this._capRadius = 5;
        this.start = { x: 0, y: 0 };
        this.end = { x: 0, y: 0 };
        this.type = 'input';
    }
    componentWillLoad() {
        // calculate cap width based on connector size
        // grab a .connector element from the dom
        const connector = document.querySelector('.connector');
        if (connector) {
            // get size from css
            const style = getComputedStyle(connector);
            this._capRadius = parseInt(style.width) / 2;
        }
    }
    updatePath() {
        const delta = {
            x: this.end.x - this.start.x,
            y: this.end.y - this.start.y,
        };
        const distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);
        const controlOffset = Math.min(100, distance * 0.35);
        // Generate the path based on type
        if (this.type === 'output') {
            // Calculate start and end points for the path
            const startInset = {
                x: this.start.x + this._capRadius,
                y: this.start.y,
            };
            const endInset = {
                x: this.end.x - this._capRadius,
                y: this.end.y,
            };
            this.path = `M ${startInset.x},${startInset.y}
          C ${startInset.x + controlOffset},${startInset.y}
            ${endInset.x - controlOffset},${endInset.y}
            ${endInset.x},${endInset.y}`;
        }
        else {
            // Calculate start and end points for the path
            const startInset = {
                x: this.start.x - this._capRadius,
                y: this.start.y,
            };
            const endInset = {
                x: this.end.x + this._capRadius,
                y: this.end.y,
            };
            this.path = `M ${startInset.x},${startInset.y}
          C ${startInset.x - controlOffset},${startInset.y}
            ${endInset.x + controlOffset},${endInset.y}
            ${endInset.x},${endInset.y}`;
        }
    }
    render() {
        return (h(Host, { key: '59490e625ffd532ec4e3b5dae0852853298ebcf7', class: "logic-connection", id: this._uid }, h("svg", { key: 'bf432ee24aec64bfe0f910afdbf67c1bcdc274e7', class: "connection" }, h("path", { key: '4724bf2ae45c8ce8746f0d8f4460ca076f780c54', class: "connection-line", d: this.path }), h("circle", { key: '442aa60b49a6d80d2e93bf21170deef808a4b416', cx: this.start.x, cy: this.start.y, r: "1px", class: "connection-cap start-cap" }), h("circle", { key: 'b8712bebd6df02eaf9f04a76b81e340019f62bdb', cx: this.end.x, cy: this.end.y, r: "1px", class: "connection-cap end-cap" }))));
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