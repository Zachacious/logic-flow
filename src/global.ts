import { nanoid } from 'nanoid';
import { LogicConnection } from './components';
import { FlowyCanvas } from './components/flowy-canvas/flowy-canvas';
import { LogicConnector } from './components/logic-connector/logic-connector';
import { LogicNode } from './components/logic-node/logic-node';
import { Rect } from './types/Rect';
import { Quadtree } from './types/Quadtree';

const viewports = new Map<string, FlowyCanvas>();
const nodes = new Map<string, LogicNode>();
const connectors = new Map<string, LogicConnector>();
const connections = new Map<string, LogicConnection>();

const connectorRects = <Record<string, Rect>>{};
const quadTrees = new Map<string, Quadtree>();

export const global = () => {
  const registerViewport = (canvas: FlowyCanvas) => {
    const id = nanoid();
    viewports.set(id, canvas);
    return id;
  };

  const unregisterViewport = (id: string) => {
    viewports.delete(id);
    // check for and remove quadtree
    const quadtree = quadTrees.get(id);
    if (quadtree) {
      quadTrees.delete(id);
    }
  };

  const registerNode = (node: LogicNode) => {
    const id = nanoid();
    nodes.set(id, node);
    return id;
  };

  const unregisterNode = (id: string) => {
    // remove all connections and connectors associated with the node
    // get connectors
    const node = nodes.get(id);
    if (node) {
      const connectors = node.el.querySelectorAll('logic-connector');
      connectors.forEach((connector: HTMLLogicConnectorElement) => {
        const cid = connector.getAttribute('id');
        // remove connections
        connector.connections.forEach(
          (connection: HTMLLogicConnectionElement) => {
            const id = connection.getAttribute('id');
            if (id) global().unregisterConnection(id);
          },
        );
        // remove connector
        global().unregisterConnector(cid);
      });
    }
  };

  const registerConnector = (connector: LogicConnector) => {
    const id = nanoid();
    connectors.set(id, connector);
    connectorRects[id] = { left: 0, top: 0, width: 0, height: 0 };
    return id;
  };

  const unregisterConnector = (id: string) => {
    connectors.delete(id);
    delete connectorRects[id];
  };

  const registerConnection = (connection: LogicConnection) => {
    const id = nanoid();
    connections.set(id, connection);
    return id;
  };

  const unregisterConnection = (id: string) => {
    // remove from dom
    const el = document.getElementById(id);
    if (el) {
      el.remove();
    }
    connections.delete(id);
  };

  const getViewport = (id: string) => viewports.get(id);
  const getNode = (id: string) => nodes.get(id);
  const getConnector = (id: string) => connectors.get(id);
  const getConnection = (id: string) => connections.get(id);

  const setViewportQuadtree = (id: string, quadtree: Quadtree) => {
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
