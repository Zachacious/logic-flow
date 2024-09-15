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
        // Calculate start and end points for the path
        const startInset = {
            x: this.start.x + this._capRadius,
            y: this.start.y,
        };
        const endInset = {
            x: this.end.x - this._capRadius,
            y: this.end.y,
        };
        // Generate the path based on type
        if (this.type === 'output') {
            this.path = `M ${startInset.x},${startInset.y}
          C ${startInset.x + controlOffset},${startInset.y}
            ${endInset.x - controlOffset},${endInset.y}
            ${endInset.x},${endInset.y}`;
        }
        else {
            this.path = `M ${startInset.x},${startInset.y}
          C ${startInset.x - controlOffset},${startInset.y}
            ${endInset.x + controlOffset},${endInset.y}
            ${endInset.x},${endInset.y}`;
        }
    }
    render() {
        return (h(Host, { key: '6dc2be20b3e882b289517c1e06f5a24299c378e8', class: "logic-connection", id: this._uid }, h("svg", { key: 'b72cb5af566b7d70ee68a4a8d9200edc9e8a0ec0', class: "connection" }, h("path", { key: '7917d0ac61572c5f5e56327aaa5bb3d3e54cafc0', class: "connection-line", d: this.path }), h("circle", { key: 'f1bef6c850deb9f6f8f7f3a0e981792294a5a243', cx: this.start.x, cy: this.start.y, r: "1px", class: "connection-cap start-cap" }), h("circle", { key: 'fce16d9e4f507b21a460a301458f45dd513e4966', cx: this.end.x, cy: this.end.y, r: "1px", class: "connection-cap end-cap" }))));
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