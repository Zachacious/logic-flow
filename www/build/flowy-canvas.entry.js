import { r as registerInstance, h, a as Host, g as getElement } from './index-d2e5e60a.js';
import { d as debounce } from './debounce-25523ff8.js';

const throttle = (fn, delay) => {
    let lastFunc;
    let lastRan;
    return (...args) => {
        if (!lastRan) {
            fn(...args);
            lastRan = Date.now();
        }
        else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= delay) {
                    fn(...args);
                    lastRan = Date.now();
                }
            }, delay - (Date.now() - lastRan));
        }
    };
};

const getEventLocation = (e) => {
    if (e instanceof MouseEvent) {
        return { x: e.clientX, y: e.clientY };
    }
    else if (e instanceof TouchEvent && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    else if (e instanceof TouchEvent && e.changedTouches.length > 0) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    return { x: 0, y: 0 };
};

class Quadtree {
    constructor(boundary, capacity, camera) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
        this.northeast = null;
        this.northwest = null;
        this.southeast = null;
        this.southwest = null;
        this.camera = camera;
    }
    subdivide() {
        const { x, y, width, height } = this.boundary;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        this.northeast = new Quadtree({ x: x + halfWidth, y: y, width: halfWidth, height: halfHeight }, this.capacity, this.camera);
        this.northwest = new Quadtree({ x: x, y: y, width: halfWidth, height: halfHeight }, this.capacity, this.camera);
        this.southeast = new Quadtree({
            x: x + halfWidth,
            y: y + halfHeight,
            width: halfWidth,
            height: halfHeight,
        }, this.capacity, this.camera);
        this.southwest = new Quadtree({ x: x, y: y + halfHeight, width: halfWidth, height: halfHeight }, this.capacity, this.camera);
        this.divided = true;
    }
    insert(point) {
        if (!this.contains(point))
            return false;
        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }
        else {
            if (!this.divided)
                this.subdivide();
            return (this.northeast.insert(point) ||
                this.northwest.insert(point) ||
                this.southeast.insert(point) ||
                this.southwest.insert(point));
        }
    }
    insertItems(points) {
        for (let point of points) {
            this.insert(point);
        }
    }
    remove(id) {
        const removeFromNode = (node) => {
            if (node === null)
                return false;
            // Remove points from the node
            node.points = node.points.filter(point => point.id !== id);
            // Recursively remove from child nodes
            const removed = removeFromNode(node.northwest) ||
                removeFromNode(node.northeast) ||
                removeFromNode(node.southwest) ||
                removeFromNode(node.southeast);
            // If no points in the node and no children have points, remove the node
            if (node.points.length === 0 && !node.divided) {
                node.northwest =
                    node.northeast =
                        node.southwest =
                            node.southeast =
                                null;
            }
            return removed;
        };
        return removeFromNode(this);
    }
    removeItems(ids) {
        for (let id of ids) {
            this.remove(id);
        }
    }
    contains(point) {
        const { x, y, width, height } = this.boundary;
        return (point.x >= x &&
            point.x < x + width &&
            point.y >= y &&
            point.y < y + height);
    }
    query(range, found = [], pan, zoom) {
        if (!this.intersects(range))
            return found;
        for (let point of this.points) {
            if (this.inRange(point, range, pan, zoom)) {
                found.push(point);
            }
        }
        if (this.divided) {
            this.northwest.query(range, found, pan, zoom);
            this.northeast.query(range, found, pan, zoom);
            this.southwest.query(range, found, pan, zoom);
            this.southeast.query(range, found, pan, zoom);
        }
        return found;
    }
    inRange(point, range, pan, zoom) {
        // Adjust the point position relative to pan and zoom
        const adjPoint = {
            x: (point.x + pan.x) * zoom,
            y: (point.y + pan.y) * zoom,
        };
        // Check if the adjusted point is within the adjusted range
        return (adjPoint.x >= range.x &&
            adjPoint.x < range.x + range.width &&
            adjPoint.y >= range.y &&
            adjPoint.y < range.y + range.height);
    }
    intersects(range) {
        const { x, y, width, height } = this.boundary;
        return !(range.x > x + width ||
            range.x + range.width < x ||
            range.y > y + height ||
            range.y + range.height < y);
    }
    checkNearby(x, y, range) {
        const bounds = {
            x: x - range / 2,
            y: y - range / 2,
            width: range,
            height: range,
        };
        const nearby = this.query(bounds, [], this.camera.pos, this.camera.zoom);
        if (nearby.length > 0) {
            const nearest = nearby[0];
            return nearest;
        }
        return null;
    }
}

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

class Camera {
    constructor() {
        this.uid = nanoid();
        this.pos = { x: 0, y: 0 };
        this.zoom = 1;
    }
    toScreenCoords(worldCoords) {
        return {
            x: (worldCoords.x - this.pos.x) * this.zoom,
            y: (worldCoords.y - this.pos.y) * this.zoom,
        };
    }
    toWorldCoords(screenCoords) {
        return {
            x: screenCoords.x / this.zoom - this.pos.x,
            y: screenCoords.y / this.zoom - this.pos.y,
        };
    }
}

class ViewContext {
    constructor(viewport) {
        this.nodes = new Map();
        this.connectors = new Map();
        this.connections = new Map();
        this.connectorRects = {};
        this.camera = new Camera();
        this.registerNode = (node) => {
            const id = nanoid();
            node.id = id;
            this.nodes.set(id, node);
            return id;
        };
        this.unregisterNode = (id) => {
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
        };
        this.registerConnector = (connector) => {
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
        };
        this.unregisterConnector = (id) => {
            this.connectors.delete(id);
            delete this.connectorRects[id];
        };
        this.registerConnection = (connection) => {
            const id = nanoid();
            connection.id = id;
            this.connections.set(id, connection);
            return id;
        };
        this.unregisterConnection = (id) => {
            // remove from dom
            const el = document.getElementById(id);
            if (el) {
                el.remove();
            }
            this.connections.delete(id);
        };
        // mutation observer callback
        // when elements are added or removed from the dom
        // we need to register or unregister them if they are nodes, connectors or connections
        this.viewportMutation = (mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node instanceof HTMLElement) {
                            if (node.tagName === 'LOGIC-NODE') {
                                const logicNode = node;
                                this.registerNode(logicNode);
                            }
                            else if (node.tagName === 'LOGIC-CONNECTOR') {
                                const logicConnector = node;
                                this.registerConnector(logicConnector);
                            }
                            else if (node.tagName === 'LOGIC-CONNECTION') {
                                const logicConnection = node;
                                this.registerConnection(logicConnection);
                            }
                        }
                    }
                    for (let i = 0; i < mutation.removedNodes.length; i++) {
                        const node = mutation.removedNodes[i];
                        if (node instanceof HTMLElement) {
                            if (node.tagName === 'LOGIC-NODE') {
                                const logicNode = node;
                                this.unregisterNode(logicNode.getAttribute('id'));
                            }
                            else if (node.tagName === 'LOGIC-CONNECTOR') {
                                const logicConnector = node;
                                this.unregisterConnector(logicConnector.getAttribute('id'));
                            }
                            else if (node.tagName === 'LOGIC-CONNECTION') {
                                const logicConnection = node;
                                this.unregisterConnection(logicConnection.getAttribute('id'));
                            }
                        }
                    }
                }
            });
        };
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
}
ViewContext.instances = new Map();
ViewContext.seekAndDestroy = (type, id) => {
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
};
ViewContext.initializeViewport = (viewport) => {
    // need to register all nodes, connectors and connections
    // that are already in the dom
    const id = viewport.id;
    const instance = ViewContext.instances.get(id);
    const contentEl = viewport.querySelector('.flowy-content');
    const children = contentEl.children;
    const traverse = (el) => {
        if (el.tagName === 'LOGIC-NODE') {
            const logicNode = el;
            instance.registerNode(logicNode);
        }
        else if (el.tagName === 'LOGIC-CONNECTOR') {
            const logicConnector = el;
            instance.registerConnector(logicConnector);
        }
        else if (el.tagName === 'LOGIC-CONNECTION') {
            const logicConnection = el;
            instance.registerConnection(logicConnection);
        }
        const children = el.children;
        for (let i = 0; i < children.length; i++) {
            traverse(children[i]);
        }
    };
    for (let i = 0; i < children.length; i++) {
        traverse(children[i]);
    }
};

const flowyCanvasCss = ":host{display:block}";

const FlowyCanvas = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._initialPinchDistance = 0;
        this._isDragging = false;
        this._dragStart = { x: 0, y: 0 };
        this._activeNodeDragging = false;
        this._activeNodeDragStart = { x: 0, y: 0 };
        this._activeConnectorStartPos = { x: 0, y: 0 };
        this._needsRedraw = true;
        this._connectorSnapDistance = 25;
        this._debouncedResize = debounce(() => this.onResize(), 16);
        this._debouncedUpdateScreen = debounce(() => this.updateScreen(), 1);
        // private _throttledPointerMove = throttle(e => this.onPointerMove(e), 1);
        this._throttledTouchMove = throttle(e => this.handleTouchMove(e), 1);
        this._forceContentReflowDebounced = debounce(() => this.forceContentReflow(), 30);
        this._elMouseDown = (e) => this.onPointerDown(e);
        this._elMouseUp = (e) => this.onPointerUp(e);
        this._elMouseMove = (e) => this.onPointerMove(e);
        this._elTouchStart = (e) => this.handleTouchStart(e);
        this._elTouchMove = (e) => this._throttledTouchMove(e);
        this._elTouchEnd = (e) => this.onPointerUp(e);
        this._elWheel = (e) => this.handleWheel(e);
        this.renderGrid = true;
        this.gridSize = 20;
        this.gridBgColor = '#f7f7f7';
        this.gridLineColor = '#555555';
        this.maxZoom = 3;
        this.minZoom = 0.2;
        this.zoomSpeed = 0.08;
    }
    componentDidLoad() {
        this.ctx = new ViewContext(this.el);
        this._canvasEl = this.el.querySelector('.flowy-canvas');
        this._contentEl = this.el.querySelector('.flowy-content');
        this._gridEl = this.el.querySelector('.flowy-grid');
        this._canvasRect = this._canvasEl.getBoundingClientRect();
        this.camera = this.ctx.camera;
        const canvasEl = this._canvasEl;
        this.renderGridLines();
        this._initialPinchDistance = 0;
        // setup event listeners
        window.addEventListener('mousedown', this._elMouseDown, {
            passive: true,
        });
        canvasEl.addEventListener('mouseup', this._elMouseUp, { passive: true });
        canvasEl.addEventListener('mousemove', this._elMouseMove, {
            passive: true,
        });
        canvasEl.addEventListener('touchstart', this._elTouchStart, {
            passive: true,
        });
        canvasEl.addEventListener('touchmove', this._elTouchMove, {
            passive: true,
        });
        canvasEl.addEventListener('touchend', this._elTouchEnd, { passive: true });
        canvasEl.addEventListener('wheel', this._elWheel, { passive: false });
        //create quadtree
        const boundary = {
            x: 0,
            y: 0,
            width: this._canvasRect.width,
            height: this._canvasRect.height,
        };
        this._quadtree = new Quadtree(boundary, 4, this.camera);
        this.ctx.quadtree = this._quadtree;
        // Handle resize events
        this._resizeObserver = new ResizeObserver(() => this._debouncedResize());
        this._resizeObserver.observe(this._canvasEl);
    }
    disconnectedCallback() {
        // Clean up resize observer
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
        // Clean up event listeners
        const canvasEl = this._canvasEl;
        window.removeEventListener('mousedown', this._elMouseDown);
        canvasEl.removeEventListener('mouseup', this._elMouseUp);
        canvasEl.removeEventListener('mousemove', this._elMouseMove);
        canvasEl.removeEventListener('touchstart', this._elTouchStart);
        canvasEl.removeEventListener('touchmove', this._elTouchMove);
        canvasEl.removeEventListener('touchend', this._elTouchEnd);
        canvasEl.removeEventListener('wheel', this._elWheel);
        // global().unregisterViewport(this._uid);
        this.ctx.destroy();
    }
    scheduleComponentUpdate() {
        this._needsRedraw = true;
        this._debouncedUpdateScreen();
    }
    onResize() {
        this._needsRedraw = true;
        this._canvasRect = this._canvasEl.getBoundingClientRect();
        this.renderGridLines();
        // update quadtree boundary
        const boundary = {
            x: 0,
            y: 0,
            width: this._canvasRect.width,
            height: this._canvasRect.height,
        };
        this._quadtree.boundary = boundary;
    }
    renderGridLines() {
        if (!this.renderGrid || !this._needsRedraw)
            return;
        requestAnimationFrame(() => {
            const canvasEl = this._gridEl;
            const ctx = canvasEl.getContext('2d');
            const width = this._canvasRect.width;
            const height = this._canvasRect.height;
            const step = this.gridSize * this.camera.zoom;
            const dpr = window.devicePixelRatio || 1;
            canvasEl.width = width * dpr;
            canvasEl.height = height * dpr;
            ctx.scale(dpr, dpr);
            ctx.strokeStyle = this.gridLineColor;
            ctx.lineWidth = 1;
            // clear
            ctx.fillStyle = this.gridBgColor;
            ctx.fillRect(0, 0, width, height);
            const panOffsetX = (-this.camera.pos.x % this.gridSize) * this.camera.zoom;
            const panOffsetY = (-this.camera.pos.y % this.gridSize) * this.camera.zoom;
            ctx.beginPath();
            // Draw vertical grid lines (x axis)
            for (let x = -panOffsetX; x <= width; x += step) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            // Draw horizontal grid lines (y axis)
            for (let y = -panOffsetY; y <= height; y += step) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();
        });
        this._needsRedraw = false;
    }
    updateScreen() {
        requestAnimationFrame(() => {
            const contentEl = this._contentEl;
            // Apply transformations to the content, aligning with the grid
            contentEl.style.transform = `perspective(1px) scale(${this.camera.zoom}) translate(${this.camera.pos.x}px, ${this.camera.pos.y}px)`;
            this.renderGridLines();
        });
    }
    onPointerDown(event) {
        const loc = getEventLocation(event);
        const worldCoords = this.camera.toWorldCoords(loc);
        let target = event.target;
        target = document.elementFromPoint(loc.x, loc.y);
        if (target.closest('.logic-connector .connector')) {
            this._activeConnector = target.closest('logic-connector .connector');
            const parentConn = this._activeConnector.closest('logic-connector');
            const aConnId = parentConn.id;
            const rect = this.ctx.connectorRects[aConnId];
            // account for node position and find center of connector
            this._activeConnectorStartPos = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };
            // create a new connection element
            const connection = document.createElement('logic-connection');
            connection.start = this._activeConnectorStartPos;
            connection.end = this._activeConnectorStartPos;
            // set input or output based on activeconnector parent
            connection.type = parentConn.type;
            this._contentEl.appendChild(connection);
            this._activeConnection = connection;
            // Associate the connection with the connector
            return;
        }
        else if (target.closest('logic-node')) {
            this._activeNode = target.closest('logic-node');
            // bring active node to front by moving element to the end of the parent
            const pos = this._activeNode.position;
            this._activeNodeDragStart = {
                x: worldCoords.x - pos.x,
                y: worldCoords.y - pos.y,
            };
            this._activeNodeDragging = true;
            return;
        }
        this._isDragging = true;
        this._dragStart = worldCoords;
    }
    onPointerUp(event) {
        // event.stopPropagation();
        if (this._activeConnector && this._activeConnection) {
            const loc = getEventLocation(event);
            let target = event.target;
            if (event instanceof TouchEvent) {
                target = document.elementFromPoint(loc.x, loc.y);
            }
            let targetConnector = target.closest('logic-connector .connector');
            const snappedConnector = this._quadtree.checkNearby(loc.x, loc.y, this._connectorSnapDistance * this.camera.zoom);
            if (snappedConnector) {
                targetConnector = this.ctx.connectors.get(snappedConnector.id);
            }
            if (targetConnector) {
                let aConn = this._activeConnector.closest('logic-connector');
                let tConn = targetConnector.closest('logic-connector');
                // find parent node of each
                const aNode = aConn.closest('logic-node');
                const tNode = tConn.closest('logic-node');
                // make sure not already connected to this connector
                if (this._activeConnector.connectingConnector === tConn ||
                    tConn.connectingConnector === aConn) {
                    console.log('already connected');
                    this._activeConnection.remove();
                    this._activeConnector = null;
                    this._activeConnection = null;
                    return;
                }
                // make sure not connecting to itself
                else if (aNode === tNode || this._activeConnector === targetConnector) {
                    console.log('connecting to itself');
                    this._activeConnection.remove();
                    this._activeConnector = null;
                    this._activeConnection = null;
                    return;
                }
                // make sure only input to output or output to input
                else if (aConn.type === tConn.type) {
                    console.log('connecting same type');
                    this._activeConnection.remove();
                    this._activeConnector = null;
                    this._activeConnection = null;
                    return;
                }
                // const targRect = targetConnector.getBoundingClientRect();
                const targRect = this.ctx.connectorRects[tConn.getAttribute('id')];
                // like above but if went from input to output, then start is the target and end is the active
                // treat as though drawn from target to active
                if (aConn.type === 'input') {
                    this._activeConnection.start = {
                        x: targRect.left + targRect.width / 2,
                        y: targRect.top + targRect.height / 2,
                    };
                    this._activeConnection.end = this._activeConnectorStartPos;
                    this._activeConnection.type = 'output';
                }
                else {
                    this._activeConnection.end = {
                        x: targRect.left + targRect.width / 2,
                        y: targRect.top + targRect.height / 2,
                    };
                }
                // get parent logic-connector from activeConnector and targetConnector
                aConn.connectingConnector = tConn;
                aConn.connections.push(this._activeConnection);
                tConn.connectingConnector = aConn;
                tConn.connections.push(this._activeConnection);
            }
            else {
                this._activeConnection.remove();
            }
            this._activeConnector = null;
            this._activeConnection = null;
        }
        else if (this._activeNode && this._activeNodeDragging) {
            this._activeNodeDragging = false;
            // update connector in quadtree
            const connectors = this._activeNode.querySelectorAll('logic-connector');
            for (let i = 0; i < connectors.length; i++) {
                const connector = connectors[i];
                const connectorId = connector.getAttribute('id');
                const rect = this.ctx.connectorRects[connectorId];
                this._quadtree.remove(connectorId);
                this._quadtree.insert({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    id: connectorId,
                });
            }
            this._activeNode = null;
        }
        this._isDragging = false;
        this._initialPinchDistance = 0;
    }
    onPointerMove(event) {
        const loc = getEventLocation(event);
        if (this._activeConnector && this._activeConnection) {
            const aConn = this._activeConnection;
            const worldCoords = this.camera.toWorldCoords(loc);
            requestAnimationFrame(() => {
                const snappableConnector = this._quadtree.checkNearby(loc.x, loc.y, this._connectorSnapDistance * this.camera.zoom);
                if (snappableConnector) {
                    const rect = this.ctx.connectorRects[snappableConnector.id];
                    const pos = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                    };
                    aConn.end = pos;
                }
                else {
                    const pos = worldCoords;
                    aConn.end = pos;
                }
            });
            return;
        }
        else if (this._activeNode && this._activeNodeDragging) {
            const aNode = this._activeNode;
            const worldCoords = this.camera.toWorldCoords(loc);
            const aNodeOldPos = aNode.position;
            const newX = worldCoords.x - this._activeNodeDragStart.x;
            const newY = worldCoords.y - this._activeNodeDragStart.y;
            // update connections
            const connectors = aNode.querySelectorAll('logic-connector');
            for (let i = 0; i < connectors.length; i++) {
                const connector = connectors[i];
                const delta = {
                    x: newX - aNodeOldPos.x,
                    y: newY - aNodeOldPos.y,
                };
                const connId = connector.getAttribute('id');
                // update connections
                // update rect
                let rect = Object.assign({}, this.ctx.connectorRects[connId]);
                rect = {
                    left: rect.left + delta.x,
                    top: rect.top + delta.y,
                    width: rect.width,
                    height: rect.height,
                };
                this.ctx.connectorRects[connId] = rect;
                if (connector.connections.length) {
                    const pos = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                    };
                    for (let i = 0; i < connector.connections.length; i++) {
                        const connection = connector.connections[i];
                        if (connector.type === 'input') {
                            connection.end = pos;
                        }
                        else {
                            connection.start = pos;
                        }
                    }
                }
            }
            aNode.position = { x: newX, y: newY };
            // });
            return;
        }
        if (this._isDragging) {
            // this._lastPan = this.camera.pos;
            const loc = getEventLocation(event);
            this.camera.pos = {
                x: loc.x / this.camera.zoom - this._dragStart.x,
                y: loc.y / this.camera.zoom - this._dragStart.y,
            };
            this.scheduleComponentUpdate();
        }
    }
    handleWheel(event) {
        event.preventDefault();
        const canvasRect = this._canvasRect;
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;
        // Calculate the zoom level change
        const zoomDelta = event.deltaY < 0 ? this.zoomSpeed : -this.zoomSpeed;
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.camera.zoom + zoomDelta));
        // Calculate the scale factor
        const scaleFactor = newZoom / this.camera.zoom;
        // Adjust the pan position to keep the same point under the cursor
        const newPanX = mouseX - (mouseX - this.camera.pos.x * this.camera.zoom) * scaleFactor;
        const newPanY = mouseY - (mouseY - this.camera.pos.y * this.camera.zoom) * scaleFactor;
        // Update pan and zoom
        this.camera.pos = { x: newPanX / newZoom, y: newPanY / newZoom };
        // this._lastZoom = this.camera.zoom;
        this.camera.zoom = newZoom;
        // if zooming in, force a reflow to prevent blurry text
        if (zoomDelta > 0) {
            this._forceContentReflowDebounced();
        }
        // this._needsRedraw = true;
        this.scheduleComponentUpdate();
    }
    handleTouchStart(event) {
        if (event.touches.length === 1) {
            // Single touch -> start panning
            this.onPointerDown(event);
        }
        else if (event.touches.length === 2) {
            // Multi-touch -> start pinch zoom
            this._initialPinchDistance = 0; // Reset initial pinch distance
            this.handlePinch(event); // Start pinch gesture
        }
    }
    handleTouchMove(event) {
        if (event.touches.length === 1) {
            // Single touch -> panning
            this.onPointerMove(event);
        }
        else if (event.touches.length === 2) {
            // Multi-touch -> pinch zooming
            this.handlePinch(event);
        }
    }
    handlePinch(event) {
        if (event.touches.length !== 2)
            return;
        // handle panning while pinching
        this.onPointerMove(event);
        event.preventDefault(); // Prevent default behavior like scrolling
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        // Calculate the distance between the two touch points (pinch)
        const distance = Math.sqrt((touch1.clientX - touch2.clientX) ** 2 +
            (touch1.clientY - touch2.clientY) ** 2);
        if (this._initialPinchDistance === 0) {
            // If it's the start of the pinch, initialize the pinch distance
            this._initialPinchDistance = distance;
        }
        else {
            // Calculate the scale factor based on the distance change
            const scaleFactor = distance / this._initialPinchDistance;
            // Calculate the midpoint between the two fingers (the pinch center)
            const pinchCenterX = (touch1.clientX + touch2.clientX) / 2;
            const pinchCenterY = (touch1.clientY + touch2.clientY) / 2;
            // Apply zoom and keep the pinch center fixed
            this.adjustZoomOnPinch(scaleFactor, pinchCenterX, pinchCenterY);
            // Update the initial pinch distance for the next move
            this._initialPinchDistance = distance;
        }
    }
    adjustZoomOnPinch(scaleFactor, pinchCenterX, pinchCenterY) {
        // Calculate new zoom, ensuring it stays within min/max bounds
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.camera.zoom * scaleFactor));
        // Find the pinch center position relative to the content's current position and zoom
        const pinchContentX = (pinchCenterX - this.camera.pos.x * this.camera.zoom) / this.camera.zoom;
        const pinchContentY = (pinchCenterY - this.camera.pos.y * this.camera.zoom) / this.camera.zoom;
        // Adjust pan so the pinch center stays fixed after zooming
        this.camera.pos = {
            x: pinchCenterX / newZoom - pinchContentX,
            y: pinchCenterY / newZoom - pinchContentY,
        };
        // Apply the new zoom level
        this.camera.zoom = newZoom;
        // Trigger a screen redraw
        this._debouncedUpdateScreen();
    }
    forceContentReflow() {
        // force repaint the content
        const cdisplay = this._contentEl.style.display;
        this._contentEl.style.display = 'none';
        this._contentEl.offsetHeight; // trigger reflow
        this._contentEl.style.display = cdisplay;
    }
    render() {
        return (h(Host, { key: 'd3e47ba4998f76284bdd260d828430cc45617aa2' }, h("div", { key: '70a5cde047e30b63dbf22d6357a94cce05047a73', class: "flowy-canvas" }, h("canvas", { key: '4df1813fab27397e45d60443a9af867106df4c36', class: "flowy-grid" }), h("div", { key: '86692c0a738fcf02d114d38ffbc9e626119fb4f8', class: "flowy-content" }, h("slot", { key: '3618bbbc5a50bebcff7fde22c97a80705d3fb5ee' })))));
    }
    get el() { return getElement(this); }
};
FlowyCanvas.style = flowyCanvasCss;

export { FlowyCanvas as flowy_canvas };

//# sourceMappingURL=flowy-canvas.entry.js.map