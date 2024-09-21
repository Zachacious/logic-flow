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

const renderCanvasGrid = (canvas, width, height, gridSize, color, bgColor, camera) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }
    let step = gridSize * camera.zoom;
    // if the step is too small because of zoom, increase it by a factor of 10
    if (step < 10) {
        step *= 2;
    }
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    //clear
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    const offsetX = (-camera.pos.x % gridSize) * camera.zoom;
    const offsetY = (-camera.pos.y % gridSize) * camera.zoom;
    ctx.beginPath();
    for (let x = -offsetX; x < width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }
    for (let y = -offsetY; y < height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();
};
const renderCanvasDotGrid = (canvas, width, height, gridSize, color, bgColor, camera) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }
    let step = gridSize * camera.zoom;
    // if the step is too small because of zoom, increase it by a factor of 10
    if (step < 10) {
        step *= 2;
    }
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    //clear
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    const offsetX = (-camera.pos.x % gridSize) * camera.zoom;
    const offsetY = (-camera.pos.y % gridSize) * camera.zoom;
    ctx.beginPath();
    // for (let x = -offsetX; x < width; x += step) {
    //   for (let y = -offsetY; y < height; y += step) {
    //     ctx.moveTo(x, y);
    //     ctx.arc(x, y, 1, 0, 2 * Math.PI);
    //   }
    // }
    // more performant version - no nested loop
    for (let x = -offsetX; x < width; x += step) {
        for (let y = -offsetY; y < height; y += step) {
            ctx.fillRect(x - 2, y - 2, 2, 2);
        }
    }
    ctx.stroke();
};

const flowyCanvasCss = ":host{display:block}";

const FlowyCanvas = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.needsRedraw = true;
        this.initialPinchDistance = 0;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.activeNodeDragging = false;
        this.activeNodeDragStart = { x: 0, y: 0 };
        this.activeConnectorStartPos = { x: 0, y: 0 };
        this.debouncedResize = debounce(() => this.onResize(), 16);
        this.debouncedUpdateScreen = debounce(() => this.updateScreen(), 1);
        this.throttledTouchMove = throttle(e => this.handleTouchMove(e), 1);
        this.forceContentReflowDebounced = debounce(() => this.forceContentReflow(), 30);
        this.elMouseDown = (e) => this.onPointerDown(e);
        this.elMouseUp = (e) => this.onPointerUp(e);
        this.elMouseMove = (e) => this.onPointerMove(e);
        this.elTouchStart = (e) => this.handleTouchStart(e);
        this.elTouchMove = (e) => this.throttledTouchMove(e);
        this.elTouchEnd = (e) => this.onPointerUp(e);
        this.elWheel = (e) => this.handleWheel(e);
        this.showGrid = true;
        this.showDotGrid = false;
        this.gridSize = 20;
        this.gridBgColor = '#f7f7f7';
        this.gridLineColor = '#555555';
        this.maxZoom = 3;
        this.minZoom = 0.2;
        this.zoomSpeed = 0.08;
        this.snapToGrid = false;
        this.connectorSnappingDistance = 37;
    }
    componentDidLoad() {
        this.ctx = new ViewContext(this.el);
        this.camera = this.ctx.camera;
        this.canvasEl = this.el.querySelector('.flowy-canvas');
        this.contentEl = this.el.querySelector('.flowy-content');
        this.gridEl = this.el.querySelector('.flowy-grid');
        this.canvasRect = this.canvasEl.getBoundingClientRect();
        this.initialPinchDistance = 0;
        const canvasEl = this.canvasEl;
        // setup event listeners
        window.addEventListener('mousedown', this.elMouseDown, {
            passive: true,
        });
        canvasEl.addEventListener('mouseup', this.elMouseUp, { passive: true });
        canvasEl.addEventListener('mousemove', this.elMouseMove, {
            passive: true,
        });
        canvasEl.addEventListener('touchstart', this.elTouchStart, {
            passive: true,
        });
        canvasEl.addEventListener('touchmove', this.elTouchMove, {
            passive: true,
        });
        canvasEl.addEventListener('touchend', this.elTouchEnd, { passive: true });
        canvasEl.addEventListener('wheel', this.elWheel, { passive: false });
        //create quadtree
        const boundary = {
            x: 0,
            y: 0,
            width: this.canvasRect.width,
            height: this.canvasRect.height,
        };
        this.quadtree = new Quadtree(boundary, 4, this.camera);
        this.ctx.quadtree = this.quadtree;
        // Handle resize events
        this.resizeObserver = new ResizeObserver(() => this.debouncedResize());
        this.resizeObserver.observe(this.canvasEl);
        this.renderGrid();
    }
    disconnectedCallback() {
        // Clean up resize observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        // Clean up event listeners
        const canvasEl = this.canvasEl;
        window.removeEventListener('mousedown', this.elMouseDown);
        canvasEl.removeEventListener('mouseup', this.elMouseUp);
        canvasEl.removeEventListener('mousemove', this.elMouseMove);
        canvasEl.removeEventListener('touchstart', this.elTouchStart);
        canvasEl.removeEventListener('touchmove', this.elTouchMove);
        canvasEl.removeEventListener('touchend', this.elTouchEnd);
        canvasEl.removeEventListener('wheel', this.elWheel);
        this.ctx.destroy();
    }
    scheduleComponentUpdate() {
        this.needsRedraw = true;
        this.debouncedUpdateScreen();
    }
    onResize() {
        this.needsRedraw = true;
        this.canvasRect = this.canvasEl.getBoundingClientRect();
        this.renderGrid();
        // update quadtree boundary
        const boundary = {
            x: 0,
            y: 0,
            width: this.canvasRect.width,
            height: this.canvasRect.height,
        };
        this.quadtree.boundary = boundary;
    }
    renderGrid() {
        if ((!this.showGrid && !this.showDotGrid) || !this.needsRedraw)
            return;
        requestAnimationFrame(() => {
            if (this.showGrid) {
                renderCanvasGrid(this.gridEl, this.canvasRect.width, this.canvasRect.height, this.gridSize, this.gridLineColor, this.gridBgColor, this.camera);
            }
            if (this.showDotGrid) {
                renderCanvasDotGrid(this.gridEl, this.canvasRect.width, this.canvasRect.height, this.gridSize, this.gridLineColor, this.gridBgColor, this.camera);
            }
        });
        this.needsRedraw = false;
    }
    updateScreen() {
        requestAnimationFrame(() => {
            const contentEl = this.contentEl;
            // Apply transformations to the content, aligning with the grid
            contentEl.style.transform = `perspective(1px) scale(${this.camera.zoom}) translate(${this.camera.pos.x}px, ${this.camera.pos.y}px)`;
            this.renderGrid();
        });
    }
    onPointerDown(event) {
        const loc = getEventLocation(event);
        const worldCoords = this.camera.toWorldCoords(loc);
        let target = event.target;
        target = document.elementFromPoint(loc.x, loc.y);
        // if a connection clicked
        const connection = target.closest('logic-connection');
        if (connection) {
            const snappableConnector = this.quadtree.checkNearby(loc.x, loc.y, this.connectorSnappingDistance * this.camera.zoom);
            if (snappableConnector) {
                // set mouse cursor to grabbing
                window.document.body.style.cursor = 'grabbing';
                // this.isReconnectAttempt = true;
                // if connector is close, then disconnect and setup as current dragging connection
                this.activeConnection = connection;
                const snapConn = this.ctx.connectors.get(snappableConnector.id);
                this.activeConnector =
                    snapConn.connectingConnector;
                this.activeConnector.connections =
                    this.activeConnector.connections.filter(conn => conn !== this.activeConnection);
                snapConn.connections = snapConn.connections.filter(conn => conn !== this.activeConnection);
                // if selected output connector, swap start and end
                if (this.activeConnector.type === 'input') {
                    // const temp = connData.start;
                    // connData.start = connData.end;
                    // connData.end = temp;
                    // swap positions
                    const tempPos = this.activeConnection.start;
                    this.activeConnection.start = this.activeConnection.end;
                    this.activeConnection.end = tempPos;
                    // swap type
                    this.activeConnection.type = 'input';
                }
                // set connectingconnector to null
                // connData.start.connectingConnector = null;
                // connData.end.connectingConnector = null;
                this.activeConnector.connectingConnector = null;
                snapConn.connectingConnector = null;
                return;
            }
        }
        else if (target.closest('.logic-connector .connector')) {
            // set cursor to cell
            window.document.body.style.cursor = 'grabbing';
            this.activeConnector = target.closest('logic-connector .connector');
            const parentConn = this.activeConnector.closest('logic-connector');
            const aConnId = parentConn.id;
            const rect = this.ctx.connectorRects[aConnId];
            // account for node position and find center of connector
            this.activeConnectorStartPos = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };
            // create a new connection element
            const connection = document.createElement('logic-connection');
            connection.start = this.activeConnectorStartPos;
            connection.end = this.activeConnectorStartPos;
            // set input or output based on activeconnector parent
            connection.type = parentConn.type;
            this.contentEl.appendChild(connection);
            this.activeConnection = connection;
            // Associate the connection with the connector
            return;
        }
        else if (target.closest('logic-node')) {
            // set cursor to move
            window.document.body.style.cursor = 'grabbing';
            this.activeNode = target.closest('logic-node');
            // bring active node to front by moving element to the end of the parent
            const pos = this.activeNode.position;
            this.activeNodeDragStart = {
                x: worldCoords.x - pos.x,
                y: worldCoords.y - pos.y,
            };
            this.activeNodeDragging = true;
            return;
        }
        // if nothing clicked, then start panning
        // set cursor to grabbing
        window.document.body.style.cursor = 'grabbing';
        this.isDragging = true;
        this.dragStart = worldCoords;
    }
    onPointerUp(event) {
        // event.stopPropagation();
        if (this.activeConnector && this.activeConnection) {
            const loc = getEventLocation(event);
            let target = event.target;
            if (event instanceof TouchEvent) {
                target = document.elementFromPoint(loc.x, loc.y);
            }
            let targetConnector = target.closest('logic-connector .connector');
            const snappedConnector = this.quadtree.checkNearby(loc.x, loc.y, this.connectorSnappingDistance * this.camera.zoom);
            if (snappedConnector) {
                targetConnector = this.ctx.connectors.get(snappedConnector.id);
            }
            if (targetConnector) {
                let aConn = this.activeConnector.closest('logic-connector');
                let tConn = targetConnector.closest('logic-connector');
                // find parent node of each
                const aNode = aConn.closest('logic-node');
                const tNode = tConn.closest('logic-node');
                // make sure not already connected to this connector
                if (this.activeConnector.connectingConnector === tConn ||
                    tConn.connectingConnector === aConn) {
                    console.log('already connected');
                    this.activeConnection.remove();
                    this.activeConnector = null;
                    this.activeConnection = null;
                    return;
                }
                // make sure not connecting to itself
                else if (aNode === tNode || this.activeConnector === targetConnector) {
                    console.log('connecting to itself');
                    this.activeConnection.remove();
                    this.activeConnector = null;
                    this.activeConnection = null;
                    return;
                }
                // make sure only input to output or output to input
                else if (aConn.type === tConn.type) {
                    console.log('connecting same type');
                    this.activeConnection.remove();
                    this.activeConnector = null;
                    this.activeConnection = null;
                    return;
                }
                // const targRect = targetConnector.getBoundingClientRect();
                const targRect = this.ctx.connectorRects[tConn.getAttribute('id')];
                // like above but if went from input to output, then start is the target and end is the active
                // treat as though drawn from target to active
                if (aConn.type === 'input') {
                    this.activeConnection.start = {
                        x: targRect.left + targRect.width / 2,
                        y: targRect.top + targRect.height / 2,
                    };
                    this.activeConnection.end = this.activeConnectorStartPos;
                    this.activeConnection.type = 'output';
                    // set connection to rect
                    const rect = this.ctx.connectorRects[aConn.id];
                    this.activeConnection.end = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                    };
                }
                else {
                    this.activeConnection.end = {
                        x: targRect.left + targRect.width / 2,
                        y: targRect.top + targRect.height / 2,
                    };
                }
                // get parent logic-connector from activeConnector and targetConnector
                aConn.connectingConnector = tConn;
                aConn.connections.push(this.activeConnection);
                tConn.connectingConnector = aConn;
                tConn.connections.push(this.activeConnection);
            }
            else {
                this.activeConnection.remove();
            }
            this.activeConnector = null;
            this.activeConnection = null;
        }
        else if (this.activeNode && this.activeNodeDragging) {
            this.activeNodeDragging = false;
            // update connector in quadtree
            const connectors = this.activeNode.querySelectorAll('logic-connector');
            for (let i = 0; i < connectors.length; i++) {
                const connector = connectors[i];
                const connectorId = connector.getAttribute('id');
                const rect = this.ctx.connectorRects[connectorId];
                this.quadtree.remove(connectorId);
                this.quadtree.insert({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    id: connectorId,
                });
            }
            this.activeNode = null;
        }
        this.isDragging = false;
        this.initialPinchDistance = 0;
        window.document.body.style.cursor = 'auto';
    }
    onPointerMove(event) {
        const loc = getEventLocation(event);
        if (this.activeConnector && this.activeConnection) {
            const aConn = this.activeConnection;
            const worldCoords = this.camera.toWorldCoords(loc);
            // requestAnimationFrame(() => {
            const snappableConnector = this.quadtree.checkNearby(loc.x, loc.y, this.connectorSnappingDistance * this.camera.zoom);
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
            // });
            return;
        }
        else if (this.activeNode && this.activeNodeDragging) {
            const aNode = this.activeNode;
            const worldCoords = this.camera.toWorldCoords(loc);
            const aNodeOldPos = aNode.position;
            let newX = worldCoords.x - this.activeNodeDragStart.x;
            let newY = worldCoords.y - this.activeNodeDragStart.y;
            // snap to grid
            if (this.snapToGrid) {
                const gridSize = this.gridSize;
                newX = Math.round(newX / gridSize) * gridSize;
                newY = Math.round(newY / gridSize) * gridSize;
            }
            const delta = {
                x: newX - aNodeOldPos.x,
                y: newY - aNodeOldPos.y,
            };
            // update connections
            const connectors = aNode.querySelectorAll('logic-connector');
            for (let i = 0; i < connectors.length; i++) {
                const connector = connectors[i];
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
        if (this.isDragging) {
            // this.lastPan = this.camera.pos;
            const loc = getEventLocation(event);
            this.camera.pos = {
                x: loc.x / this.camera.zoom - this.dragStart.x,
                y: loc.y / this.camera.zoom - this.dragStart.y,
            };
            this.scheduleComponentUpdate();
        }
    }
    handleWheel(event) {
        event.preventDefault();
        const canvasRect = this.canvasRect;
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
        // this.lastZoom = this.camera.zoom;
        this.camera.zoom = newZoom;
        // if zooming in, force a reflow to prevent blurry text
        if (zoomDelta > 0) {
            this.forceContentReflowDebounced();
        }
        // this.needsRedraw = true;
        this.scheduleComponentUpdate();
    }
    handleTouchStart(event) {
        if (event.touches.length === 1) {
            // Single touch -> start panning
            this.onPointerDown(event);
        }
        else if (event.touches.length === 2) {
            // Multi-touch -> start pinch zoom
            this.initialPinchDistance = 0; // Reset initial pinch distance
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
        if (this.initialPinchDistance === 0) {
            // If it's the start of the pinch, initialize the pinch distance
            this.initialPinchDistance = distance;
        }
        else {
            // Calculate the scale factor based on the distance change
            const scaleFactor = distance / this.initialPinchDistance;
            // Calculate the midpoint between the two fingers (the pinch center)
            const pinchCenterX = (touch1.clientX + touch2.clientX) / 2;
            const pinchCenterY = (touch1.clientY + touch2.clientY) / 2;
            // Apply zoom and keep the pinch center fixed
            this.adjustZoomOnPinch(scaleFactor, pinchCenterX, pinchCenterY);
            // Update the initial pinch distance for the next move
            this.initialPinchDistance = distance;
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
        this.debouncedUpdateScreen();
    }
    forceContentReflow() {
        // force repaint the content
        const cdisplay = this.contentEl.style.display;
        this.contentEl.style.display = 'none';
        this.contentEl.offsetHeight; // trigger reflow
        this.contentEl.style.display = cdisplay;
    }
    render() {
        return (h(Host, { key: 'd20497011dcd1a3792b59584630f23b5967801e1' }, h("div", { key: 'd412d60bc4ea6466e8ca73c8b0be4c5855ee5e9b', class: "flowy-canvas" }, h("canvas", { key: '28d37eb00242a03ebd45a8e7076d8ca153d127f5', class: "flowy-grid" }), h("div", { key: '5407d7495978874770d2950e1af6d1db995f8c04', class: "flowy-content" }, h("slot", { key: '5907814fd76ecca9ae01386d07a9ec3ed633ed92' })))));
    }
    get el() { return getElement(this); }
};
FlowyCanvas.style = flowyCanvasCss;

export { FlowyCanvas as flowy_canvas };

//# sourceMappingURL=flowy-canvas.entry.js.map