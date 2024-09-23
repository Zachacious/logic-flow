import { r as registerInstance, h } from './index-2bf55485.js';
import { f as format } from './utils-11fcde98.js';

const myComponentCss = ":host{display:block}";

const MyComponent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.first = undefined;
        this.middle = undefined;
        this.last = undefined;
    }
    getText() {
        return format(this.first, this.middle, this.last);
    }
    render() {
        return h("div", { key: '5a16f4e2bb456617adc9e3b81669d622f7df219b' }, "Hello, World! I'm ", this.getText());
    }
};
MyComponent.style = myComponentCss;

export { MyComponent as my_component };

//# sourceMappingURL=my-component.entry.js.map