import { nanoid } from 'nanoid';
import { LogicFlowConnection } from './components';
import { LogicFlowViewport } from './components/logic-flow-viewport/logic-flow-viewport';
import { LogicFlowConnector } from './components/logic-flow-connector/logic-flow-connector';
import { LogicFlowNode } from './components/logic-flow-node/logic-flow-node';
import { Rect } from './types/Rect';
import { Quadtree } from './types/Quadtree';
import { Camera } from './types/Camera';

const viewports = new Map<string, LogicFlowViewport>();
const nodes = new Map<string, LogicFlowNode>();
const connectors = new Map<string, LogicFlowConnector>();
const connections = new Map<string, LogicFlowConnection>();

const connectorRects = <Record<string, Rect>>{};
const connectorQuadTrees = new Map<string, Quadtree>();

const camera = new Camera();

export const global = () => {
  const registerViewport = (canvas: LogicFlowViewport) => {
    const id = nanoid();
    viewports.set(id, canvas);
    return id;
  };

  const unregisterViewport = (id: string) => {
    viewports.delete(id);
    // check for and remove quadtree
    const quadtree = connectorQuadTrees.get(id);
    if (quadtree) {
      connectorQuadTrees.delete(id);
    }
  };

  const registerNode = (node: LogicFlowNode) => {
    const id = nanoid();
    nodes.set(id, node);
    return id;
  };

  const unregisterNode = (id: string) => {
    // remove all connections and connectors associated with the node
    // get connectors
    const node = nodes.get(id);
    if (node) {
      const connectors = node.el.querySelectorAll('logic-flow-connector');
      connectors.forEach((connector: HTMLLogicFlowConnectorElement) => {
        const cid = connector.getAttribute('id');
        // remove connections
        connector.connections.forEach(
          (connection: HTMLLogicFlowConnectionElement) => {
            const id = connection.getAttribute('id');
            if (id) global().unregisterConnection(id);
          },
        );
        // remove connector
        global().unregisterConnector(cid);
      });
    }
  };

  const registerConnector = (connector: LogicFlowConnector) => {
    const id = nanoid();
    connectors.set(id, connector);
    connectorRects[id] = { left: 0, top: 0, width: 0, height: 0 };
    return id;
  };

  const unregisterConnector = (id: string) => {
    connectors.delete(id);
    delete connectorRects[id];
  };

  const registerConnection = (connection: LogicFlowConnection) => {
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
    connectorQuadTrees.set(id, quadtree);
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
    connectorQuadTrees,
    camera,
  };
};
