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
const connectorRects = {};
const quadTrees = new Map();
const global = () => {
    const registerViewport = (canvas) => {
        const id = nanoid();
        viewports.set(id, canvas);
        return id;
    };
    const unregisterViewport = (id) => {
        viewports.delete(id);
        // check for and remove quadtree
        const quadtree = quadTrees.get(id);
        if (quadtree) {
            quadTrees.delete(id);
        }
    };
    const registerNode = (node) => {
        const id = nanoid();
        nodes.set(id, node);
        return id;
    };
    const unregisterNode = (id) => {
        // remove all connections and connectors associated with the node
        // get connectors
        const node = nodes.get(id);
        if (node) {
            const connectors = node.el.querySelectorAll('logic-connector');
            connectors.forEach((connector) => {
                const cid = connector.getAttribute('id');
                // remove connections
                connector.connections.forEach((connection) => {
                    const id = connection.getAttribute('id');
                    if (id)
                        global().unregisterConnection(id);
                });
                // remove connector
                global().unregisterConnector(cid);
            });
        }
    };
    const registerConnector = (connector) => {
        const id = nanoid();
        connectors.set(id, connector);
        connectorRects[id] = { left: 0, top: 0, width: 0, height: 0 };
        return id;
    };
    const unregisterConnector = (id) => {
        connectors.delete(id);
        delete connectorRects[id];
    };
    const registerConnection = (connection) => {
        const id = nanoid();
        connections.set(id, connection);
        return id;
    };
    const unregisterConnection = (id) => {
        // remove from dom
        const el = document.getElementById(id);
        if (el) {
            el.remove();
        }
        connections.delete(id);
    };
    const getViewport = (id) => viewports.get(id);
    const getNode = (id) => nodes.get(id);
    const getConnector = (id) => connectors.get(id);
    const getConnection = (id) => connections.get(id);
    const setViewportQuadtree = (id, quadtree) => {
        quadTrees.set(id, quadtree);
    };
    return {
        registerViewport,
        unregisterViewport,
        registerNode,
        unregisterNode,
        registerConnector,
        unregisterConnector,
        registerConnection,
        unregisterConnection,
        getViewport,
        getNode,
        getConnector,
        getConnection,
        setViewportQuadtree,
        connectorRects,
        quadTrees,
    };
};

export { global as g };

//# sourceMappingURL=global-4b3b539c.js.map