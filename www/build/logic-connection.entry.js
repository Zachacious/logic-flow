import { r as registerInstance, h, a as Host } from './index-c090f9ce.js';
import { g as global } from './global-4b3b539c.js';

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
    disconnectedCallback() {
        global().unregisterConnection(this._uid);
    }
    async getUid() {
        return this._uid;
    }
    async destroy() {
        global().unregisterConnection(this._uid);
    }
    updatePath() {
        const delta = {
            x: this.end.x - this.start.x,
            y: this.end.y - this.start.y,
        };
        const distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);
        const controlOffset = Math.min(100, distance * 0.35);
        const capOffset = this._capRadius - 1;
        // Generate the path based on type
        if (this.type === 'output') {
            // Calculate start and end points for the path
            const startInset = {
                x: this.start.x + capOffset,
                y: this.start.y,
            };
            const endInset = {
                x: this.end.x - capOffset,
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
                x: this.start.x - capOffset,
                y: this.start.y,
            };
            const endInset = {
                x: this.end.x + capOffset,
                y: this.end.y,
            };
            this.path = `M ${startInset.x},${startInset.y}
          C ${startInset.x - controlOffset},${startInset.y}
            ${endInset.x + controlOffset},${endInset.y}
            ${endInset.x},${endInset.y}`;
        }
    }
    render() {
        return (h(Host, { key: 'ac97a055911ccba1da29db32c1075e6ab296b8b7', class: "logic-connection", id: this._uid }, h("svg", { key: 'bd704960a2b76945dc19b9b89581a9476761ddba', class: "connection" }, h("path", { key: '61b07d0b05888cd319d81add7383fe3820ec50b9', class: "connection-line", d: this.path }), h("circle", { key: '3167af23f84c677258ba2148ab6083a76584a8d0', cx: this.start.x, cy: this.start.y, r: "1px", class: "connection-cap start-cap" }), h("circle", { key: '1905fedb74dbb05b223d5925985bb878e0c1d9c3', cx: this.end.x, cy: this.end.y, r: "1px", class: "connection-cap end-cap" }))));
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