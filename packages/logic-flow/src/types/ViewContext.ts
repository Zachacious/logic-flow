import { nanoid } from 'nanoid';
import { Rect } from './Rect';
import { Quadtree } from './Quadtree';
import { Camera } from './Camera';
import { Coords } from './Coords';
import { throttle } from '../utils/throttle';
import { Offset } from './Offset';

export class ViewContext {
  static instances = new Map<string, ViewContext>();

  uid: string;
  nodes = new Map<string, HTMLLogicFlowNodeElement>();
  connectors = new Map<string, HTMLLogicFlowConnectorElement>();
  connectorSnapDistance = 10;
  connections = new Map<string, HTMLLogicFlowConnectionElement>();
  connectorRects = <Record<string, Rect>>{};
  connectionRects = <Record<string, Rect>>{};
  connectorQuadtree: Quadtree;
  viewportQuadtree: Quadtree;
  nodeRects = <Record<string, Rect>>{};
  camera = new Camera();
  observer: MutationObserver;
  visibleElements: string[] = [];
  prevVisibleElements: string[] = [];

  // viewport variables
  viewportEl: HTMLDivElement;
  contentEl: HTMLDivElement;
  gridEl: HTMLCanvasElement;
  needsRedraw = true;
  viewportRect: Rect;
  initialPinchDistance = 0;
  isPanning = false;
  snapToGrid = false;
  dragStart: Coords = { x: 0, y: 0 };
  activeNode: HTMLLogicFlowNodeElement;
  activeNodeDragging = false;
  activeNodeDragStart: Coords = { x: 0, y: 0 };
  activeConnector: HTMLLogicFlowConnectorElement;
  activeConnectorStartPos: Coords = { x: 0, y: 0 };
  activeConnection: HTMLLogicFlowConnectionElement;
  viewportOffset: Offset = { top: 0, left: 0 };
  bringingToFront = false;

  debouncedUpdateVisibleElements = throttle(
    () => this.updateVisibleElements(),
    20,
  );

  constructor(viewport: HTMLLogicFlowViewportElement) {
    const id = viewport.id || nanoid();
    viewport.id = id;
    const viewportId = id;
    if (ViewContext.instances.has(viewportId)) {
      return ViewContext.instances.get(viewportId);
    }
    this.uid = viewportId;
    ViewContext.instances.set(this.uid, this);

    if (!this.viewportRect) {
      const rect = viewport.getBoundingClientRect();
      this.viewportOffset = {
        top: rect.top,
        left: rect.left,
      };
      this.viewportRect = {
        left: rect.left - rect.left,
        top: rect.top - rect.top,
        width: rect.width - rect.left,
        height: rect.height - rect.top,
      };
      // this.updateViewportRect();
    }

    const boundry = {
      left: this.viewportRect.left,
      top: this.viewportRect.top,
      width: this.viewportRect.width,
      height: this.viewportRect.height,
    };

    this.connectorQuadtree = new Quadtree(boundry, 4, this.camera);
    this.viewportQuadtree = new Quadtree(boundry, 4, this.camera);

    ViewContext.initializeViewport(viewport);

    this.observer = new MutationObserver((m: MutationRecord[]) =>
      this.viewportMutation(m),
    );
    this.observer.observe(viewport, {
      childList: true,
      subtree: true,
    });
  }

  destroy() {
    this.observer.disconnect();

    ViewContext.instances.delete(this.uid);
  }

  updateViewportRect() {
    const rect = this.viewportEl.getBoundingClientRect();
    this.viewportOffset = {
      top: rect.top,
      left: rect.left,
    };
    this.viewportRect = {
      left: rect.left - rect.left,
      top: rect.top - rect.top,
      width: rect.width - rect.left,
      height: rect.height - rect.top,
    };
  }

  addNode(node: HTMLLogicFlowNodeElement) {
    const id = nanoid();
    node.id = id;
    this.nodes.set(id, node);

    // set data attribute for the context id
    node.setAttribute('data-viewport', this.uid);

    const n = node;

    // wait for next frame to update connectors rects until the connectors have registered
    requestIdleCallback(
      () => {
        // update rect
        const rect = n.getBoundingClientRect();

        this.nodeRects[id] = {
          left: n?.position?.x || n.startX || rect.x,
          top: n?.position?.y || n.startY || rect.y,
          width: rect.width,
          height: rect.height,
        };

        // add to quadtree
        this.updateViewportQuadtree(n);

        // this.updateNodeConnectorsQuadtree(node);
      },
      { timeout: 100 },
    );

    return id;
  }

  removeNode(id: string) {
    console.log('remove node', id);
    // remove all connections and connectors associated with the node
    // get connectors
    const node = this.nodes.get(id);
    if (node) {
      const connectors = node.querySelectorAll('logic-flow-connector');
      connectors.forEach((connector: HTMLLogicFlowConnectorElement) => {
        const cid = connector.id;
        // remove connections
        connector.connections.forEach(
          (connection: HTMLLogicFlowConnectionElement) => {
            const id = connection.id;
            if (id) this.removeConnection(id);
          },
        );
        // remove connector
        this.removeConnector(cid);
      });

      // remove from quadtree
      this.viewportQuadtree.remove(id);
      delete this.nodeRects[id];
      // node.setAttribute('data-viewport', '');

      // remove from nodes
      this.nodes.delete(id);
    }
  }

  addConnector(connector: HTMLLogicFlowConnectorElement) {
    const id = nanoid();
    connector.id = id;
    this.connectors.set(id, connector);
    requestAnimationFrame(() => {
      const connectorEl = connector.querySelector('.connector');
      const rect = connectorEl.getBoundingClientRect();
      this.connectorRects[id] = {
        left:
          (rect.x - this.viewportOffset.left) / this.camera.zoom -
          this.camera.pos.x,
        top:
          (rect.y - this.viewportOffset.top) / this.camera.zoom -
          this.camera.pos.y,
        width: rect.width / this.camera.zoom,
        height: rect.height / this.camera.zoom,
      };

      // add to quadtree
      const qrect = this.connectorRects[id];
      this.connectorQuadtree.insert({
        id,
        x: qrect.left + qrect.width / 2,
        y: qrect.top + qrect.height / 2,
      });
    });

    return id;
  }

  removeConnector(id: string) {
    const connector = this.connectors.get(id);
    if (!connector) return;

    // remove connections
    connector.connections.forEach(
      (connection: HTMLLogicFlowConnectionElement) => {
        const id = connection.id;
        if (id) this.removeConnection(id);
      },
    );

    this.connectors.delete(id);
    this.connectorQuadtree.remove(id);
    delete this.connectorRects[id];
  }

  addConnection(connection: HTMLLogicFlowConnectionElement) {
    const id = nanoid();
    connection.id = id;
    this.connections.set(id, connection);
    // set data attribute for the context id
    connection.setAttribute('data-viewport', this.uid);

    return id;
  }

  removeConnection(id: string) {
    const connection = this.connections.get(id);
    if (!connection) return;

    // handle connectors
    const connectors = connection.connectors;
    if (connectors.size > 0) {
      for (const connector of connectors) {
        const connIndex = connector.connections.indexOf(connection);
        if (connIndex > -1) {
          connector.connections.splice(connIndex, 1);
        }
        connector.connectingConnector = null;
        // update quadtree
      }
    }

    delete this.connectionRects[id];
    this.viewportQuadtree.remove(id);
    this.connections.delete(id);
    connection.remove();
  }

  // mutation observer callback
  // when elements are added or removed from the dom
  // we need to register or unregister them if they are nodes, connectors or connections
  viewportMutation(mutations: MutationRecord[]) {
    if (!mutations.length) return;
    // happens whenu using bringNodeToFront
    // - stop the observer from firing
    // if (!this.registerNode) return;
    if (this.bringingToFront) {
      this.bringingToFront = false;
      return;
    }

    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node instanceof HTMLElement) {
            if (node.tagName === 'LOGIC-FLOW-NODE') {
              const logicNode = node as HTMLLogicFlowNodeElement;
              this.addNode(logicNode);
            } else if (node.tagName === 'LOGIC-FLOW-CONNECTOR') {
              const logicConnector = node as HTMLLogicFlowConnectorElement;
              this.addConnector(logicConnector);
            } else if (node.tagName === 'LOGIC-FLOW-CONNECTION') {
              const logicConnection = node as HTMLLogicFlowConnectionElement;
              this.addConnection(logicConnection);
            }
          }
        }

        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const node = mutation.removedNodes[i];
          if (node instanceof HTMLElement) {
            if (node.tagName === 'LOGIC-FLOW-NODE') {
              const logicNode = node as HTMLLogicFlowNodeElement;
              this.removeNode(logicNode.getAttribute('id'));
            } else if (node.tagName === 'LOGIC-FLOW-CONNECTOR') {
              const logicConnector = node as HTMLLogicFlowConnectorElement;
              this.removeConnector(logicConnector.getAttribute('id'));
            } else if (node.tagName === 'LOGIC-FLOW-CONNECTION') {
              const logicConnection = node as HTMLLogicFlowConnectionElement;
              this.removeConnection(logicConnection.getAttribute('id'));
            }
          }
        }
      }
    });
  }

  static initializeViewport(viewport: HTMLLogicFlowViewportElement) {
    // need to register all nodes, connectors and connections
    // that are already in the dom

    const id = viewport.id;
    const instance = ViewContext.instances.get(id);

    const contentEl = viewport.querySelector('.viewport-content');
    const children = contentEl.children;

    const traverse = (el: HTMLElement) => {
      if (el.tagName === 'LOGIC-FLOW-NODE') {
        const logicNode = el as HTMLLogicFlowNodeElement;
        instance.addNode(logicNode);
      } else if (el.tagName === 'LOGIC-FLOW-CONNECTOR') {
        const logicConnector = el as HTMLLogicFlowConnectorElement;
        instance.addConnector(logicConnector);
      } else if (el.tagName === 'LOGIC-FLOW-CONNECTION') {
        const logicConnection = el as HTMLLogicFlowConnectionElement;
        instance.addConnection(logicConnection);
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

  bringToFront(node: HTMLElement) {
    this.bringingToFront = true;
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

    this.debouncedUpdateVisibleElements();
  }

  resetPointerStates() {
    this.isPanning = false;
    this.initialPinchDistance = 0;
    ViewContext.resetCursor();
  }

  startNodeDrag(
    target: HTMLLogicFlowNodeElement,
    worldCoords: Coords,
    cursor = 'grabbing',
  ): boolean {
    if (!target) return false;

    const node = target.closest('logic-flow-node') as HTMLLogicFlowNodeElement;
    if (!node) return false;

    ViewContext.setCursor(cursor);
    this.activeNode = node;
    this.bringToFront(node);

    const pos = this.activeNode.position;
    this.activeNodeDragging = true;
    this.activeNodeDragStart = {
      x: worldCoords.x - pos.x,
      y: worldCoords.y - pos.y,
    };

    return true;
  }

  updateNodeConnectorPos(aNode: HTMLLogicFlowNodeElement, delta: Coords) {
    const connectors = aNode.querySelectorAll(
      'logic-flow-connector',
    ) as NodeListOf<HTMLLogicFlowConnectorElement>;

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
    connector: HTMLLogicFlowConnectorElement,
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

  calcSnapToGrid(pos: Coords, gridSize: number) {
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

    if (!this.snapToGrid) return pos;

    return this.calcSnapToGrid(pos, this.connectorSnapDistance);
  }

  moveNode(loc: Coords, gridSize: number) {
    const aNode = this.activeNode;
    const worldCoords = this.camera.toWorldCoords(loc);
    const oldPos = aNode.position;

    let newPos = this.calcNodePos(worldCoords);

    // calc new position
    if (this.snapToGrid) {
      newPos = this.calcSnapToGrid(newPos, gridSize);
    }

    const delta = {
      x: newPos.x - oldPos.x,
      y: newPos.y - oldPos.y,
    };

    // update node rect
    const rect = this.nodeRects[aNode.id];
    rect.left = newPos.x;
    rect.top = newPos.y;
    rect.width = aNode.clientWidth || rect.width;
    rect.height = aNode.clientHeight || rect.height;
    this.nodeRects[aNode.id] = rect;

    aNode.position = newPos;

    // update node position and it's connections
    this.updateNodeConnectorPos(aNode, delta); // ???
  }

  endNodeDrag() {
    this.activeNodeDragging = false;
    this.updateNodeConnectorsQuadtree(this.activeNode);

    const connectors = this.activeNode.querySelectorAll('logic-flow-connector');

    let connections = [];
    for (let i = 0; i < connectors.length; i++) {
      const connector = connectors[i] as HTMLLogicFlowConnectorElement;
      connections = connections.concat(connector.connections);
    }

    for (let i = 0; i < connections.length; i++) {
      const connection = connections[i] as HTMLLogicFlowConnectionElement;
      const path = connection.querySelector('path');
      const rect = path.getBoundingClientRect();
      this.connectionRects[connection.id] = {
        left:
          (rect.x - this.viewportOffset.left) / this.camera.zoom -
          this.camera.pos.x,
        top:
          (rect.y - this.viewportOffset.top) / this.camera.zoom -
          this.camera.pos.y,
        width: rect.width / this.camera.zoom,
        height: rect.height / this.camera.zoom,
      };
      this.updateViewportQuadtree(connection);

      // use debug div to show connection
      // const debug = document.getElementById('debug');
      // const debugRect = this.connectionRects[connection.id];
      // if (debug) {
      //   debug.style.left = `${debugRect.left}px`;
      //   debug.style.top = `${debugRect.top}px`;
      //   debug.style.width = `${debugRect.width}px`;
      //   debug.style.height = `${debugRect.height}px`;
      // }
    }
    this.updateViewportQuadtree(this.activeNode);

    this.activeNode = null;
  }

  createNewConnection(startPos: Coords, type: 'input' | 'output') {
    const connection = document.createElement(
      'logic-flow-connection',
    ) as HTMLLogicFlowConnectionElement;
    connection.start = startPos;
    connection.end = startPos;
    connection.type = type;

    this.activeConnection = connection;
    this.contentEl.appendChild(connection);
  }

  moveActiveConnection(loc: Coords, snappingDist: number) {
    const aConn = this.activeConnection;

    const worldCoords = this.camera.toWorldCoords({
      x: loc.x - this.viewportOffset.left,
      y: loc.y - this.viewportOffset.top,
    });

    const snappableConnector = this.connectorQuadtree.checkNearby(
      {
        x: loc.x - this.viewportOffset.left,
        y: loc.y - this.viewportOffset.top,
      },
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
      'logic-flow-connector .connector',
    ) as HTMLLogicFlowConnectorElement;

    const snappedConnector = this.connectorQuadtree.checkNearby(
      {
        x: loc.x - this.viewportOffset.left,
        y: loc.y - this.viewportOffset.top,
      },
      snappingDist * this.camera.zoom,
    );

    if (snappedConnector) {
      targetConnector = this.connectors.get(snappedConnector.id);
    }

    return targetConnector;
  }

  startNewConnection(
    target: HTMLLogicFlowConnectorElement,
    cursor = 'grabbing',
  ) {
    if (!target) return false;

    const connEl = target.closest(
      'logic-flow-connector .connector',
    ) as HTMLLogicFlowConnectorElement;
    if (!connEl) return false;

    ViewContext.setCursor(cursor);
    this.activeConnector = connEl;

    const parentConn = connEl.closest(
      'logic-flow-connector',
    ) as HTMLLogicFlowConnectorElement;
    const rect = this.connectorRects[parentConn.id];
    const center = this.getRectCenter(rect);

    this.createNewConnection(center, parentConn.type);

    return true;
  }

  processConnection(target: HTMLLogicFlowConnectorElement) {
    const aConn = this.activeConnector.closest(
      'logic-flow-connector',
    ) as HTMLLogicFlowConnectorElement;
    const tConn = target.closest(
      'logic-flow-connector',
    ) as HTMLLogicFlowConnectorElement;

    // find parent nodes
    const aNode = aConn.closest('logic-flow-node') as HTMLLogicFlowNodeElement;
    const tNode = tConn.closest('logic-flow-node') as HTMLLogicFlowNodeElement;

    // validate connection
    if (!this.isValidConnection(aConn, tConn, aNode, tNode, target)) {
      this.activeConnection.remove();
      // remove from rects
      delete this.connectionRects[this.activeConnection.id];
      return;
    }

    this.updateConnectionEndpoints(aConn, tConn);
    this.finalizeConnection(aConn, tConn);

    // update rect
    const path = this.activeConnection.querySelector('path');
    const rect = path.getBoundingClientRect();
    this.connectionRects[this.activeConnection.id] = {
      left:
        (rect.x - this.viewportOffset.left) / this.camera.zoom -
        this.camera.pos.x,
      top:
        (rect.y - this.viewportOffset.top) / this.camera.zoom -
        this.camera.pos.y,
      width: rect.width / this.camera.zoom,
      height: rect.height / this.camera.zoom,
    };

    // use debug div to show connection
    // const debug = document.getElementById('debug');
    // const debugRect = this.connectionRects[this.activeConnection.id];
    // if (debug) {
    //   debug.style.left = `${debugRect.left}px`;
    //   debug.style.top = `${debugRect.top}px`;
    //   debug.style.width = `${debugRect.width}px`;
    //   debug.style.height = `${debugRect.height}px`;
    // }

    // update quadtree
    this.updateViewportQuadtree(this.activeConnection);
  }

  isValidConnection(
    aConn: HTMLLogicFlowConnectorElement,
    tConn: HTMLLogicFlowConnectorElement,
    aNode: HTMLLogicFlowNodeElement,
    tNode: HTMLLogicFlowNodeElement,
    targetConn: HTMLLogicFlowConnectorElement,
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
    active: HTMLLogicFlowConnectorElement,
    target: HTMLLogicFlowConnectorElement,
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
    active: HTMLLogicFlowConnectorElement,
    target: HTMLLogicFlowConnectorElement,
  ) {
    active.connectingConnector = target;
    active.connections.push(this.activeConnection);
    target.connectingConnector = active;
    target.connections.push(this.activeConnection);

    this.activeConnection.connectors.clear();
    this.activeConnection.connectors.add(active);
    this.activeConnection.connectors.add(target);
  }

  startDisconnectConnection(
    target: HTMLLogicFlowConnectionElement,
    loc: Coords,
    snappingDist: number,
    cursor = 'grabbing',
  ) {
    if (!target) return false;

    const connection = target.closest(
      'logic-flow-connection',
    ) as HTMLLogicFlowConnectionElement;
    if (!connection) return false;

    this.bringToFront(connection);

    const snappableConnector = this.connectorQuadtree.checkNearby(
      {
        x: loc.x - this.viewportOffset.left,
        y: loc.y - this.viewportOffset.top,
      },
      snappingDist * this.camera.zoom,
    );

    if (!snappableConnector) return false;

    ViewContext.setCursor(cursor);
    this.activeConnection = connection;

    const snapConnector = this.connectors.get(snappableConnector.id);
    this.activeConnector =
      snapConnector.connectingConnector as HTMLLogicFlowConnectorElement;

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
    connection: HTMLLogicFlowConnectionElement,
    connector: HTMLLogicFlowConnectorElement,
    snapConnector: HTMLLogicFlowConnectorElement,
  ) {
    connector.connections = connector.connections.filter(c => c !== connection);
    snapConnector.connections = snapConnector.connections.filter(
      c => c !== connection,
    );

    connector.connectingConnector = null;
    snapConnector.connectingConnector = null;
  }

  swapConnectionEndpoints(connection: HTMLLogicFlowConnectionElement) {
    const { start, end } = connection;
    connection.start = end;
    connection.end = start;
  }

  updateNodeConnectorsQuadtree(node: HTMLLogicFlowNodeElement) {
    const connectors = node.querySelectorAll(
      'logic-flow-connector',
    ) as NodeListOf<HTMLLogicFlowConnectorElement>;

    for (let i = 0; i < connectors.length; i++) {
      const connector = connectors[i];
      let rect = this.connectorRects[connector.id];
      if (!rect) {
        console.log('no rect');
        let connectorEl = connector.querySelector('.connector');

        const r = connectorEl.getBoundingClientRect();
        this.connectorRects[connector.id] = {
          left: r.x,
          top: r.y,
          width: r.width,
          height: r.height,
        };
        rect = this.connectorRects[connector.id];
      }

      this.connectorQuadtree.remove(connector.id);
      this.connectorQuadtree.insert({
        id: connector.id,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }

  updateViewportQuadtree(
    entity: HTMLLogicFlowNodeElement | HTMLLogicFlowConnectionElement,
  ) {
    if (entity.tagName === 'LOGIC-FLOW-NODE') {
      const rect = this.nodeRects[entity.id];

      this.viewportQuadtree.remove(entity.id);

      this.viewportQuadtree.insert({
        id: entity.id,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else if (entity.tagName === 'LOGIC-FLOW-CONNECTION') {
      const rect = this.connectionRects[entity.id];

      this.viewportQuadtree.remove(entity.id);

      this.viewportQuadtree.insert({
        id: entity.id,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }

  updateVisibleElements() {
    // Get visible nodes within the viewport quadtree
    let rect = this.viewportRect;
    rect = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };

    const visibleEntities = this.viewportQuadtree.query(
      rect,
      [],
      this.camera.pos,
      this.camera.zoom,
    );

    const newVisibleElements = visibleEntities.map((entity: any) => entity.id);
    // console.log('newVisibleElements', newVisibleElements);

    const allItems = new Set([
      ...this.prevVisibleElements,
      ...newVisibleElements,
    ]);

    // Update the previous visible elements
    this.prevVisibleElements = newVisibleElements;

    // Update elements that changed visibility
    for (const id of allItems) {
      const el = document.getElementById(id);
      if (el) {
        const entityComponent = el as
          | HTMLLogicFlowNodeElement
          | HTMLLogicFlowConnectionElement;
        const curstate = entityComponent.isVisible;
        const prevState = this.prevVisibleElements.includes(id);
        const newstate = newVisibleElements.includes(id);
        if (prevState === curstate && newstate === curstate) {
          continue;
        }

        entityComponent.isVisible = newVisibleElements.includes(id);
      }
    }
  }
}
