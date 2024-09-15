import { nanoid } from 'nanoid';
import { LogicConnection } from './components';
import { FlowyCanvas } from './components/flowy-canvas/flowy-canvas';
import { LogicConnector } from './components/logic-connector/logic-connector';
import { LogicNode } from './components/logic-node/logic-node';
import { Rect } from './types/Rect';

const viewports = new Map<string, FlowyCanvas>();
const nodes = new Map<string, LogicNode>();
const connectors = new Map<string, LogicConnector>();
const connections = new Map<string, LogicConnection>();

const connectorRects = <Record<string, Rect>>{};

export const global = () => {
  const registerViewport = (canvas: FlowyCanvas) => {
    const id = nanoid();
    viewports.set(id, canvas);
    return id;
  };

  const registerNode = (node: LogicNode) => {
    const id = nanoid();
    nodes.set(id, node);
    return id;
  };

  const registerConnector = (connector: LogicConnector) => {
    const id = nanoid();
    connectors.set(id, connector);
    connectorRects[id] = { left: 0, top: 0, width: 0, height: 0 };
    return id;
  };

  const registerConnection = (connection: LogicConnection) => {
    const id = nanoid();
    connections.set(id, connection);
    return id;
  };

  const getViewport = (id: string) => viewports.get(id);
  const getNode = (id: string) => nodes.get(id);
  const getConnector = (id: string) => connectors.get(id);
  const getConnection = (id: string) => connections.get(id);

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
