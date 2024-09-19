import { r as registerInstance, h, a as Host } from './index-d2e5e60a.js';

const logicConnectionCss = ":host{display:block}";

const LogicConnection = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        // private _uid: string = global().registerConnection(this);
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
    // disconnectedCallback() {
    //   global().unregisterConnection(this._uid);
    // }
    // @Method()
    // async getUid() {
    //   return this._uid;
    // }
    // @Method()
    // async destroy() {
    //   global().unregisterConnection(this._uid);
    // }
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
        return (h(Host, { key: 'aaef39b3062099e142bf63ea602940356a76f370', class: "logic-connection" }, h("svg", { key: 'aeb7356d108fd930c3eb61cd9682b4ae37fe30b1', class: "connection" }, h("path", { key: '9637b22e1cfeebd94138481448547995f0d9f870', class: "connection-line", d: this.path }), h("circle", { key: '3be14b227adaabab87578043da016c6101853fec', cx: this.start.x, cy: this.start.y, r: "1px", class: "connection-cap start-cap" }), h("circle", { key: 'dbfdf1869dcd33fe061c709fe2e64c9a7c54b7ae', cx: this.end.x, cy: this.end.y, r: "1px", class: "connection-cap end-cap" }))));
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