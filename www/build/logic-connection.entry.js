import { r as registerInstance, h, a as Host } from './index-d2e5e60a.js';

const logicConnectionCss = ":host{display:block}";

const LogicConnection = class {
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
        return (h(Host, { key: 'be754786bf1c1fed530f3ec8af326521276b1d06', class: "logic-connection" }, h("svg", { key: 'a7413425f8f657f03ac5eeb143eaf2e11509507f', class: "connection" }, h("path", { key: 'f7673ee5555212f6cfa309d31dfe042cef5d8cd4', class: "connection-line", d: this.path }), h("circle", { key: '9f53043b814f914f71a8a045cd2bf49499dcddb4', cx: this.start.x, cy: this.start.y, r: "1px", class: "connection-cap start-cap" }), h("circle", { key: '9d22d51a77e0faaee1db68f59877bd14c98c777c', cx: this.end.x, cy: this.end.y, r: "1px", class: "connection-cap end-cap" }))));
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