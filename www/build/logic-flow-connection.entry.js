import { r as registerInstance, h, a as Host } from './index-519b580e.js';

const logicFlowConnectionCss = ":host{display:block}";

const LogicFlowConnection = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
        const capOffset = this._capRadius;
        // Generate the path based on type
        if (this.type === 'output') {
            // Calculate start and end points for the path
            const startInset = {
                x: this.start.x + capOffset - 1,
                y: this.start.y,
            };
            const endInset = {
                x: this.end.x - capOffset + 1,
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
                x: this.start.x - capOffset + 1,
                y: this.start.y,
            };
            const endInset = {
                x: this.end.x + capOffset - 1,
                y: this.end.y,
            };
            this.path = `M ${startInset.x},${startInset.y}
          C ${startInset.x - controlOffset},${startInset.y}
            ${endInset.x + controlOffset},${endInset.y}
            ${endInset.x},${endInset.y}`;
        }
    }
    render() {
        return (h(Host, { key: 'c61725f25826ac9e581105f1d514769c98a65cf9', class: "logic-flow-connection" }, h("svg", { key: '01ed8395c5e38154414a855804df764bc9758c08', class: "connection" }, h("path", { key: '12686c778ad2bc67d00f3e1ed9b27aa2bd992f07', class: "connection-line", d: this.path }), h("circle", { key: '4a7b36983c2273cbb3b5d4d51103e31f5053431c', cx: this.start.x, cy: this.start.y, r: "1.5px", class: "connection-cap start-cap" }), h("circle", { key: 'db72971975cb9a6692bb99e011e82e2a12aa4142', cx: this.end.x, cy: this.end.y, r: "1.5px", class: "connection-cap end-cap" }))));
    }
    static get watchers() { return {
        "start": ["updatePath"],
        "end": ["updatePath"],
        "type": ["updatePath"]
    }; }
};
LogicFlowConnection.style = logicFlowConnectionCss;

export { LogicFlowConnection as logic_flow_connection };

//# sourceMappingURL=logic-flow-connection.entry.js.map