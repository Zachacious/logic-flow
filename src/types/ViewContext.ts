import { nanoid } from 'nanoid';
import { Rect } from './Rect';
import { Quadtree } from './Quadtree';
import { Camera } from './Camera';
import { Coords } from './Coords';

type EntityType = 'node' | 'connector' | 'connection' | 'viewport';

export class ViewContext {
  static instances = new Map<string, ViewContext>();

  uid: string;
  nodes = new Map<string, HTMLLogicNodeElement>();
  connectors = new Map<string, HTMLLogicConnectorElement>();
  connections = new Map<string, HTMLLogicConnectionElement>();
  connectorRects = <Record<string, Rect>>{};
  connectorQuadtree: Quadtree;
  camera = new Camera();
  observer: MutationObserver;

  // viewport variables
  viewportEl: HTMLDivElement;
  contentEl: HTMLDivElement;
  gridEl: HTMLCanvasElement;
  needsRedraw = true;
  viewportRect: DOMRect;
  initialPinchDistance = 0;
  isPanning = false;
  dragStart: Coords = { x: 0, y: 0 };
  activeNode: HTMLLogicNodeElement;
  activeNodeDragging = false;
  activeNodeDragStart: Coords = { x: 0, y: 0 };
  activeConnector: HTMLLogicConnectorElement;
  activeConnectorStartPos: Coords = { x: 0, y: 0 };
  activeConnection: HTMLLogicConnectionElement;

  constructor(viewport: HTMLFlowyCanvasElement) {
    const id = nanoid();
    viewport.id = id;
    const viewportId = id;
    if (ViewContext.instances.has(viewportId)) {
      return ViewContext.instances.get(viewportId);
    }
    this.uid = viewportId;
    ViewContext.instances.set(this.uid, this);

    ViewContext.initializeViewport(viewport);

    this.observer = new MutationObserver(this.viewportMutation);
    this.observer.observe(viewport, {
      childList: true,
      subtree: true,
    });
  }

  destroy() {
    this.observer.disconnect();

    ViewContext.instances.delete(this.uid);
  }

  static seekAndDestroy(type: EntityType, id: string) {
    // search and destroy in all instances
    for (const [, instance] of ViewContext.instances) {
      switch (type) {
        case 'node':
          instance.unregisterNode(id);
          break;
        case 'connector':
          instance.unregisterConnector(id);
          break;
        case 'connection':
          instance.unregisterConnection(id);
          break;
        case 'viewport':
          instance.destroy();
          break;
      }
    }
  }

  registerNode(node: HTMLLogicNodeElement) {
    const id = nanoid();
    node.id = id;
    this.nodes.set(id, node);
    return id;
  }

  unregisterNode(id: string) {
    // remove all connections and connectors associated with the node
    // get connectors
    const node = this.nodes.get(id);
    if (node) {
      // TODO: not sure if this is necessary with mutation observer

      // const connectors = node.querySelectorAll('logic-connector');
      // connectors.forEach((connector: HTMLLogicConnectorElement) => {
      //   const cid = connector.id;
      //   // remove connections
      //   connector.connections.forEach(
      //     (connection: HTMLLogicConnectionElement) => {
      //       const id = connection.id;
      //       if (id) this.unregisterConnection(id);
      //     },
      //   );
      //   // remove connector
      //   this.unregisterConnector(cid);
      // });

      // remove from nodes
      this.nodes.delete(id);
    }
  }

  registerConnector(connector: HTMLLogicConnectorElement) {
    const id = nanoid();
    connector.id = id;
    this.connectors.set(id, connector);
    const connectorEl = connector.querySelector('.connector');
    const rect = connectorEl.getBoundingClientRect();
    this.connectorRects[id] = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height,
    };

    return id;
  }

  unregisterConnector(id: string) {
    this.connectors.delete(id);
    delete this.connectorRects[id];
  }

  registerConnection(connection: HTMLLogicConnectionElement) {
    const id = nanoid();
    connection.id = id;
    this.connections.set(id, connection);
    return id;
  }

  unregisterConnection(id: string) {
    // remove from dom
    const el = document.getElementById(id);
    if (el) {
      el.remove();
    }
    this.connections.delete(id);
  }

  // mutation observer callback
  // when elements are added or removed from the dom
  // we need to register or unregister them if they are nodes, connectors or connections
  viewportMutation(mutations: MutationRecord[]) {
    if (!mutations.length) return;
    // happens whenu using bringNodeToFront
    // - stop the observer from firing
    if (!this.registerNode) return;

    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node instanceof HTMLElement) {
            if (node.tagName === 'LOGIC-NODE') {
              const logicNode = node as HTMLLogicNodeElement;
              this.registerNode(logicNode);
            } else if (node.tagName === 'LOGIC-CONNECTOR') {
              const logicConnector = node as HTMLLogicConnectorElement;
              this.registerConnector(logicConnector);
            } else if (node.tagName === 'LOGIC-CONNECTION') {
              const logicConnection = node as HTMLLogicConnectionElement;
              this.registerConnection(logicConnection);
            }
          }
        }

        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const node = mutation.removedNodes[i];
          if (node instanceof HTMLElement) {
            if (node.tagName === 'LOGIC-NODE') {
              const logicNode = node as HTMLLogicNodeElement;
              this.unregisterNode(logicNode.getAttribute('id'));
            } else if (node.tagName === 'LOGIC-CONNECTOR') {
              const logicConnector = node as HTMLLogicConnectorElement;
              this.unregisterConnector(logicConnector.getAttribute('id'));
            } else if (node.tagName === 'LOGIC-CONNECTION') {
              const logicConnection = node as HTMLLogicConnectionElement;
              this.unregisterConnection(logicConnection.getAttribute('id'));
            }
          }
        }
      }
    });
  }

  static initializeViewport(viewport: HTMLFlowyCanvasElement) {
    // need to register all nodes, connectors and connections
    // that are already in the dom

    const id = viewport.id;
    const instance = ViewContext.instances.get(id);

    const contentEl = viewport.querySelector('.flowy-content');
    const children = contentEl.children;

    const traverse = (el: HTMLElement) => {
      if (el.tagName === 'LOGIC-NODE') {
        const logicNode = el as HTMLLogicNodeElement;
        instance.registerNode(logicNode);
      } else if (el.tagName === 'LOGIC-CONNECTOR') {
        const logicConnector = el as HTMLLogicConnectorElement;
        instance.registerConnector(logicConnector);
      } else if (el.tagName === 'LOGIC-CONNECTION') {
        const logicConnection = el as HTMLLogicConnectionElement;
        instance.registerConnection(logicConnection);
      }

      const children = el.children;
      for (let i = 0; i < children.length; i++) {
        traverse(children[i] as HTMLElement);
      }
    };

    for (let i = 0; i < children.length; i++) {
      traverse(children[i] as HTMLElement);
    }
  }

  static bringToFront(node: HTMLElement) {
    node.parentElement?.appendChild(node);
  }

  static setCursor(cursor: string) {
    document.body.style.cursor = cursor;
  }

  static resetCursor() {
    document.body.style.cursor = 'default';
  }

  getRectCenter(rect: DOMRect | Rect) {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  startPanning(worldCoords: Coords, cursor = 'grabbing') {
    ViewContext.setCursor(cursor);
    this.isPanning = true;
    this.dragStart = worldCoords;
  }

  panCamera(loc: Coords) {
    this.camera.pos = {
      x: loc.x / this.camera.zoom - this.dragStart.x,
      y: loc.y / this.camera.zoom - this.dragStart.y,
    };
  }

  resetPointerStates() {
    this.isPanning = false;
    this.initialPinchDistance = 0;
    ViewContext.resetCursor();
  }

  startNodeDrag(
    target: HTMLLogicNodeElement,
    worldCoords: Coords,
    cursor = 'grabbing',
  ): boolean {
    const node = target.closest('logic-node') as HTMLLogicNodeElement;
    if (!node) return false;

    ViewContext.setCursor(cursor);
    this.activeNode = node;
    ViewContext.bringToFront(node);

    const pos = this.activeNode.position;
    this.activeNodeDragging = true;
    this.activeNodeDragStart = {
      x: worldCoords.x - pos.x,
      y: worldCoords.y - pos.y,
    };

    return true;
  }

  updateNodeConnectorPos(aNode: HTMLLogicNodeElement, delta: Coords) {
    const connectors = aNode.querySelectorAll(
      'logic-connector',
    ) as NodeListOf<HTMLLogicConnectorElement>;

    for (let i = 0; i < connectors.length; i++) {
      const connector = connectors[i];
      const rect = { ...this.connectorRects[connector.id] };
      rect.left += delta.x;
      rect.top += delta.y;
      this.connectorRects[connector.id] = rect;

      this.updateNodeConnectorConnectionsPos(connector, rect);
    }
  }

  updateNodeConnectorConnectionsPos(
    connector: HTMLLogicConnectorElement,
    rect: Rect,
  ) {
    if (connector.connections.length) {
      const pos = this.getRectCenter(rect);

      for (let i = 0; i < connector.connections.length; i++) {
        const connection = connector.connections[i];
        if (connector.type === 'input') {
          connection.end = pos;
        } else {
          connection.start = pos;
        }
      }
    }
  }

  snapToGrid(pos: Coords, gridSize: number) {
    return {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize,
    };
  }

  calcNodePos(worldCoords: Coords) {
    const pos = {
      x: worldCoords.x - this.activeNodeDragStart.x,
      y: worldCoords.y - this.activeNodeDragStart.y,
    };

    return this.snapToGrid(pos, 10);
  }

  moveNode(loc: Coords, gridSize: number) {
    const aNode = this.activeNode;
    const worldCoords = this.camera.toWorldCoords(loc);
    const oldPos = aNode.position;

    let newPos = this.calcNodePos(worldCoords);

    // calc new position
    if (this.snapToGrid) {
      newPos = this.snapToGrid(newPos, gridSize);
    }

    const delta = {
      x: newPos.x - oldPos.x,
      y: newPos.y - oldPos.y,
    };

    // update node position and it's connections
    this.updateNodeConnectorPos(aNode, delta); // ???

    aNode.position = newPos;
  }

  endNodeDrag() {
    this.activeNodeDragging = false;
    this.updateNodeConnectorsQuadtree(this.activeNode);
    this.activeNode = null;
  }

  createNewConnection(startPos: Coords, type: 'input' | 'output') {
    const connection = document.createElement(
      'logic-connection',
    ) as HTMLLogicConnectionElement;
    connection.start = startPos;
    connection.end = startPos;
    connection.type = type;

    this.activeConnection = connection;
    this.contentEl.appendChild(connection);
  }

  moveActiveConnection(loc: Coords, snappingDist: number) {
    const aConn = this.activeConnection;
    const worldCoords = this.camera.toWorldCoords(loc);

    const snappableConnector = this.connectorQuadtree.checkNearby(
      loc.x,
      loc.y,
      snappingDist * this.camera.zoom,
    );

    if (snappableConnector) {
      const rect = this.connectorRects[snappableConnector.id];
      aConn.end = this.getRectCenter(rect);
    } else {
      aConn.end = worldCoords;
    }
  }

  getTargetConnector(target: HTMLElement, loc: Coords, snappingDist: number) {
    let targetConnector = target.closest(
      'logic-connector .connector',
    ) as HTMLLogicConnectorElement;

    const snappedConnector = this.connectorQuadtree.checkNearby(
      loc.x,
      loc.y,
      snappingDist * this.camera.zoom,
    );

    if (snappedConnector) {
      targetConnector = this.connectors.get(snappedConnector.id);
    }

    return targetConnector;
  }

  startNewConnection(target: HTMLLogicConnectorElement, cursor = 'grabbing') {
    const connEl = target.closest(
      'logic-connector .connector',
    ) as HTMLLogicConnectorElement;
    if (!connEl) return false;

    ViewContext.setCursor(cursor);
    this.activeConnector = connEl;

    const parentConn = connEl.closest(
      'logic-connector',
    ) as HTMLLogicConnectorElement;
    const rect = this.connectorRects[parentConn.id];
    const center = this.getRectCenter(rect);

    this.createNewConnection(center, parentConn.type);

    return true;
  }

  processConnection(target: HTMLLogicConnectorElement) {
    const aConn = this.activeConnector.closest(
      'logic-connector',
    ) as HTMLLogicConnectorElement;
    const tConn = target.closest(
      'logic-connector',
    ) as HTMLLogicConnectorElement;

    // find parent nodes
    const aNode = aConn.closest('logic-node') as HTMLLogicNodeElement;
    const tNode = tConn.closest('logic-node') as HTMLLogicNodeElement;

    // validate connection
    if (!this.isValidConnection(aConn, tConn, aNode, tNode, target)) {
      this.activeConnection.remove();
      return;
    }

    this.updateConnectionEndpoints(aConn, tConn);
    this.finalizeConnection(aConn, tConn);
  }

  isValidConnection(
    aConn: HTMLLogicConnectorElement,
    tConn: HTMLLogicConnectorElement,
    aNode: HTMLLogicNodeElement,
    tNode: HTMLLogicNodeElement,
    targetConn: HTMLLogicConnectorElement,
  ) {
    // avoid connecting to self or already connected
    if (
      this.activeConnector.connectingConnector === tConn ||
      tConn.connectingConnector === aConn
    ) {
      // perhaps send an error event
      // console.log('already connected');
      return false;
    }

    if (aNode === tNode || this.activeConnector === targetConn) {
      // connecting to self
      return false;
    }

    // ensure is between input/output not same type
    if (aConn.type === tConn.type) {
      // console.log('same type');
      return false;
    }

    return true;
  }

  updateConnectionEndpoints(
    active: HTMLLogicConnectorElement,
    target: HTMLLogicConnectorElement,
  ) {
    const targRect = this.connectorRects[target.id];

    if (active.type === 'input') {
      // swap start and end connections
      this.activeConnection.start = this.getRectCenter(targRect);
      this.activeConnection.end = this.activeConnectorStartPos;
      this.activeConnection.type = 'output';

      const rect = this.connectorRects[active.id];
      this.activeConnection.end = this.getRectCenter(rect);
    } else {
      this.activeConnection.end = this.getRectCenter(targRect);
    }
  }

  finalizeConnection(
    active: HTMLLogicConnectorElement,
    target: HTMLLogicConnectorElement,
  ) {
    active.connectingConnector = target;
    active.connections.push(this.activeConnection);
    target.connectingConnector = active;
    target.connections.push(this.activeConnection);
  }

  startDisconnectConnection(
    target: HTMLLogicConnectionElement,
    loc: Coords,
    snappingDist: number,
    cursor = 'grabbing',
  ) {
    const connection = target.closest(
      'logic-connection',
    ) as HTMLLogicConnectionElement;
    if (!connection) return false;

    ViewContext.bringToFront(connection);

    const snappableConnector = this.connectorQuadtree.checkNearby(
      loc.x,
      loc.y,
      snappingDist * this.camera.zoom,
    );

    if (!snappableConnector) return false;

    ViewContext.setCursor(cursor);
    this.activeConnection = connection;

    const snapConnector = this.connectors.get(snappableConnector.id);
    this.activeConnector =
      snapConnector.connectingConnector as HTMLLogicConnectorElement;

    this.disconnectConnector(
      this.activeConnection,
      this.activeConnector,
      snapConnector,
    );

    // handle type specific logic
    if (this.activeConnector.type === 'input') {
      this.swapConnectionEndpoints(this.activeConnection);
      this.activeConnection.type = 'input';
    }

    return true;
  }

  disconnectConnector(
    connection: HTMLLogicConnectionElement,
    connector: HTMLLogicConnectorElement,
    snapConnector: HTMLLogicConnectorElement,
  ) {
    connector.connections = connector.connections.filter(c => c !== connection);
    snapConnector.connections = snapConnector.connections.filter(
      c => c !== connection,
    );

    connector.connectingConnector = null;
    snapConnector.connectingConnector = null;
  }

  swapConnectionEndpoints(connection: HTMLLogicConnectionElement) {
    const { start, end } = connection;
    connection.start = end;
    connection.end = start;
  }

  updateNodeConnectorsQuadtree(node: HTMLLogicNodeElement) {
    const connectors = node.querySelectorAll(
      'logic-connector',
    ) as NodeListOf<HTMLLogicConnectorElement>;
    for (let i = 0; i < connectors.length; i++) {
      const connector = connectors[i];
      const rect = this.connectorRects[connector.id];

      this.connectorQuadtree.remove(connector.id);
      this.connectorQuadtree.insert({
        id: connector.id,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }
}
