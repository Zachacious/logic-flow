import { n as nanoid } from './index.browser-00c404f8.js';

const viewports = new Map();
const nodes = new Map();
const connectors = new Map();
const connections = new Map();
const registry = () => {
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
    };
};

export { registry as r };

//# sourceMappingURL=registry-c08e114c.js.map