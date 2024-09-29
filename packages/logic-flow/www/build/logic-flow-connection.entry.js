import { r as registerInstance, h, a as Host } from './index-4b3244cf.js';

const logicFlowConnectionCss = ":host{display:block}";

const LogicFlowConnection = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._capRadius = 5;
        this.style = {};
        this.start = { x: 0, y: 0 };
        this.end = { x: 0, y: 0 };
        this.type = 'input';
        this.isVisible = true;
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
    componentWillRender() {
        if (!this.isVisible) {
            this.style = { display: 'none' };
        }
        else {
            this.style = {};
        }
    }
    render() {
        // console.log('render', this.isVisible);
        return (h(Host, { key: '6dd9ffa37aa5454cf949fff32b72445e8ebb6076', class: "logic-flow-connection", style: this.style }, h("svg", { key: 'a72f244b12c2b4dfed5d81eb213f380c2f316808', class: "connection" }, h("path", { key: 'ff1c465c0210ea6e0f8a3bffeef5c3cea842a4b8', class: "connection-line", d: this.path }), h("circle", { key: '3e1f4d0e656220e89df34a26f412c8a7e0c79030', cx: this.start.x, cy: this.start.y, r: "1.5px", class: "connection-cap start-cap" }), h("circle", { key: 'c3333b708a917f686f4d86b1ac89ba84a4e0d133', cx: this.end.x, cy: this.end.y, r: "1.5px", class: "connection-cap end-cap" }))));
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