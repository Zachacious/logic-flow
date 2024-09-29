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
        console.log('render', this.isVisible);
        return (h(Host, { key: '17671cbf0bc9c8a4dff151c080e993d7d3e05b3f', class: "logic-flow-connection", style: this.style }, h("svg", { key: '975232a73a1ef53fba197d45c5ff964b17f89b65', class: "connection" }, h("path", { key: 'fe9d2c0e4cb24cc090dd8f170043e3c1c6f979c4', class: "connection-line", d: this.path }), h("circle", { key: '982689ca1429881f0055d1c914dc3ad4fc5295df', cx: this.start.x, cy: this.start.y, r: "1.5px", class: "connection-cap start-cap" }), h("circle", { key: 'd80178c0698c5c5cf02630570f91581f384e12ca', cx: this.end.x, cy: this.end.y, r: "1.5px", class: "connection-cap end-cap" }))));
    }
    static get watchers() { return {
        "start": ["updatePath"],
        "end": ["updatePath"],
        "type": ["updatePath"]
    }; }
};
LogicFlowConnection.style = logicFlowConnectionCss;

export { LogicFlowConnection as L };

//# sourceMappingURL=logic-flow-connection-0b78b978.js.map