const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes));
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1;
  let step = -~((1.6 * mask * defaultSize) / alphabet.length);
  return (size = defaultSize) => {
    let id = '';
    while (true) {
      let bytes = getRandom(step);
      let j = step;
      while (j--) {
        id += alphabet[bytes[j] & mask] || '';
        if (id.length === size) return id
      }
    }
  }
};
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random);
let nanoid = (size = 21) => {
  let id = '';
  let bytes = crypto.getRandomValues(new Uint8Array(size));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id
};

const viewports = new Map();
const nodes = new Map();
const connectors = new Map();
const connections = new Map();
const connectorRects = new Map();
const global = () => {
    const registerViewport = (canvas) => {
        const id = nanoid();
        viewports.set(id, canvas);
        return id;
    };
    const registerNode = (node) => {
        const id = nanoid();
        nodes.set(id, node);
        return id;
    };
    const registerConnector = (connector) => {
        const id = nanoid();
        connectors.set(id, connector);
        return id;
    };
    const registerConnection = (connection) => {
        const id = nanoid();
        connections.set(id, connection);
        return id;
    };
    const getViewport = (id) => viewports.get(id);
    const getNode = (id) => nodes.get(id);
    const getConnector = (id) => connectors.get(id);
    const getConnection = (id) => connections.get(id);
    return {
        registerViewport,
        registerNode,
        registerConnector,
        registerConnection,
        getViewport,
        getNode,
        getConnector,
        getConnection,
        connectorRects,
    };
};

export { global as g };

//# sourceMappingURL=global-5986860c.js.map