import { r as registerInstance, h, g as getElement } from './index-4b3244cf.js';

const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

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

class Quadtree {
    constructor(boundary, capacity, camera) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.objects = [];
        this.divided = false;
        this.northeast = null;
        this.northwest = null;
        this.southeast = null;
        this.southwest = null;
        this.camera = camera;
    }
    subdivide() {
        const { left, top, width, height } = this.boundary;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        this.northeast = new Quadtree({ left: left + halfWidth, top, width: halfWidth, height: halfHeight }, this.capacity, this.camera);
        this.northwest = new Quadtree({ left, top, width: halfWidth, height: halfHeight }, this.capacity, this.camera);
        this.southeast = new Quadtree({
            left: left + halfWidth,
            top: top + halfHeight,
            width: halfWidth,
            height: halfHeight,
        }, this.capacity, this.camera);
        this.southwest = new Quadtree({ left, top: top + halfHeight, width: halfWidth, height: halfHeight }, this.capacity, this.camera);
        this.divided = true;
    }
    insert(object) {
        // if (!this.contains(object)) console.log('Object out of bounds');
        // if (!this.contains(object)) return false;
        if (this.objects.length < this.capacity) {
            this.objects.push(object);
            return true;
        }
        else {
            if (!this.divided)
                this.subdivide();
            return (this.northeast.insert(object) ||
                this.northwest.insert(object) ||
                this.southeast.insert(object) ||
                this.southwest.insert(object));
        }
    }
    remove(id) {
        const removeFromNode = (node) => {
            if (!node)
                return false;
            const originalLength = node.objects.length;
            node.objects = node.objects.filter(obj => obj.id !== id);
            // If any objects were removed, return true
            if (originalLength !== node.objects.length)
                return true;
            // Recursively remove from child nodes if subdivided
            if (node.divided) {
                return (removeFromNode(node.northwest) ||
                    removeFromNode(node.northeast) ||
                    removeFromNode(node.southwest) ||
                    removeFromNode(node.southeast));
            }
            return false;
        };
        return removeFromNode(this);
    }
    contains(object) {
        if ('x' in object && 'y' in object) {
            // It's a point
            return this.containsPoint(object);
        }
        else {
            // It's a rect
            return this.containsRect(object);
        }
    }
    containsPoint(point) {
        const { left, top, width, height } = this.boundary;
        return (point.x >= left &&
            point.x < left + width &&
            point.y >= top &&
            point.y < top + height);
    }
    containsRect(rect) {
        const { left, top, width, height } = this.boundary;
        return (rect.left >= left &&
            rect.left + rect.width <= left + width &&
            rect.top >= top &&
            rect.top + rect.height <= top + height);
    }
    query(range, found = [], pan, zoom) {
        if (!this.intersects(range))
            return found;
        this.objects.forEach(obj => {
            if (this.inRange(obj, range, pan, zoom)) {
                found.push(obj);
            }
        });
        if (this.divided) {
            this.northwest.query(range, found, pan, zoom);
            this.northeast.query(range, found, pan, zoom);
            this.southwest.query(range, found, pan, zoom);
            this.southeast.query(range, found, pan, zoom);
        }
        return found;
    }
    inRange(object, range, pan, zoom) {
        if ('x' in object && 'y' in object) {
            // It's a point
            return this.pointInRange(object, range, pan, zoom);
        }
        else {
            // It's a rect
            return this.rectInRange(object, range, pan, zoom);
        }
    }
    pointInRange(point, range, pan, zoom) {
        // Adjust point position relative to pan and zoom
        const adjX = (point.x + pan.x) * zoom;
        const adjY = (point.y + pan.y) * zoom;
        // const screenX = adjX / zoom - pan.x;
        // const screenY = adjY / zoom - pan.y;
        // // show debug
        // const debugDiv = document.getElementById('debug');
        // debugDiv.style.left = `${screenX}px`;
        // debugDiv.style.top = `${screenY}px`;
        // debugDiv.style.width = '10px';
        // debugDiv.style.height = '10px';
        // // show debug range
        // const screenRange = {
        //   left: range.left / zoom - pan.x,
        //   top: range.top / zoom - pan.y,
        //   width: range.width / zoom,
        //   height: range.height / zoom,
        // };
        // const debugDiv2 = document.getElementById('debug2');
        // debugDiv2.style.left = `${screenRange.left}px`;
        // debugDiv2.style.top = `${screenRange.top}px`;
        // debugDiv2.style.width = `${screenRange.width}px`;
        // debugDiv2.style.height = `${screenRange.height}px`;
        return (adjX >= range.left &&
            adjX < range.left + range.width &&
            adjY >= range.top &&
            adjY < range.top + range.height);
    }
    rectInRange(rect, range, pan, zoom) {
        // Adjust rect position relative to pan and zoom
        const adjLeft = (rect.left + pan.x) * zoom;
        const adjTop = (rect.top + pan.y) * zoom;
        const adjRight = adjLeft + rect.width * zoom;
        const adjBottom = adjTop + rect.height * zoom;
        // const screenW = (adjRight - adjLeft) / this.camera.zoom;
        // const screenH = (adjBottom - adjTop) / this.camera.zoom;
        // const screenX = adjLeft / this.camera.zoom - pan.x;
        // const screenY = adjTop / this.camera.zoom - pan.y;
        // const debugDiv2 = document.getElementById('debug2');
        // debugDiv2.style.width = `${screenW}px`;
        // debugDiv2.style.height = `${screenH}px`;
        // debugDiv2.style.left = `${screenX}px`;
        // debugDiv2.style.top = `${screenY}px`;
        // const screenRange = {
        //   left: range.left / zoom - pan.x,
        //   top: range.top / zoom - pan.y,
        //   width: range.width / zoom,
        //   height: range.height / zoom,
        // };
        // const debugDiv = document.getElementById('debug');
        // debugDiv.style.width = `${screenRange.width}px`;
        // debugDiv.style.height = `${screenRange.height}px`;
        // debugDiv.style.left = `${screenRange.left}px`;
        // debugDiv.style.top = `${screenRange.top}px`;
        return !(adjRight < range.left ||
            adjLeft > range.left + range.width ||
            adjBottom < range.top ||
            adjTop > range.top + range.height);
    }
    intersects(range) {
        const { left, top, width, height } = this.boundary;
        return !(range.left > left + width ||
            range.left + range.width < left ||
            range.top > top + height ||
            range.top + range.height < top);
    }
    checkNearby(coords, range) {
        const bounds = {
            left: coords.x - range / 2,
            top: coords.y - range / 2,
            width: range,
            height: range,
        };
        const nearby = this.query(bounds, [], this.camera.pos, this.camera.zoom);
        return nearby.length > 0 ? nearby[0] : null;
    }
}

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
        this.connectorSnapDistance = 10;
        this.connections = new Map();
        this.connectorRects = {};
        this.connectionRects = {};
        this.nodeRects = {};
        this.camera = new Camera();
        this.visibleElements = [];
        this.prevVisibleElements = [];
        this.needsRedraw = true;
        this.initialPinchDistance = 0;
        this.isPanning = false;
        this.snapToGrid = false;
        this.dragStart = { x: 0, y: 0 };
        this.activeNodeDragging = false;
        this.activeNodeDragStart = { x: 0, y: 0 };
        this.activeConnectorStartPos = { x: 0, y: 0 };
        this.viewportOffset = { top: 0, left: 0 };
        this.bringingToFront = false;
        this.debouncedUpdateVisibleElements = throttle(() => this.updateVisibleElements(), 100);
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
        this.observer = new MutationObserver((m) => this.viewportMutation(m));
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
    static seekAndDestroy(type, id) {
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
    registerNode(node) {
        const id = nanoid();
        node.id = id;
        this.nodes.set(id, node);
        // set data attribute for the context id
        node.setAttribute('data-viewport', this.uid);
        // update rect
        const rect = node.getBoundingClientRect();
        this.nodeRects[id] = {
            left: node.position.x,
            top: node.position.y,
            width: rect.width,
            height: rect.height,
        };
        // add to quadtree
        this.updateViewportQuadtree(node);
        // wait for next frame to update connectors rects until the connectors have registered
        requestAnimationFrame(() => {
            this.updateNodeConnectorsQuadtree(node);
        });
        return id;
    }
    unregisterNode(id) {
        // remove all connections and connectors associated with the node
        // get connectors
        const node = this.nodes.get(id);
        if (node) {
            // TODO: not sure if this is necessary with mutation observer
            // const connectors = node.querySelectorAll('logic-flow-connector');
            // connectors.forEach((connector: HTMLLogicFlowConnectorElement) => {
            //   const cid = connector.id;
            //   // remove connections
            //   connector.connections.forEach(
            //     (connection: HTMLLogicFlowConnectionElement) => {
            //       const id = connection.id;
            //       if (id) this.unregisterConnection(id);
            //     },
            //   );
            //   // remove connector
            //   this.unregisterConnector(cid);
            // });
            // remove from quadtree
            this.viewportQuadtree.remove(id);
            node.setAttribute('data-viewport', '');
            // remove from nodes
            this.nodes.delete(id);
        }
    }
    registerConnector(connector) {
        console.log('registering connector');
        const id = nanoid();
        connector.id = id;
        this.connectors.set(id, connector);
        const connectorEl = connector.querySelector('.connector');
        const rect = connectorEl.getBoundingClientRect();
        this.connectorRects[id] = {
            left: rect.x - this.viewportOffset.left,
            top: rect.y - this.viewportOffset.top,
            width: rect.width,
            height: rect.height,
        };
        return id;
    }
    unregisterConnector(id) {
        this.connectors.delete(id);
        this.connectorQuadtree.remove(id);
        delete this.connectorRects[id];
    }
    registerConnection(connection) {
        const id = nanoid();
        connection.id = id;
        this.connections.set(id, connection);
        // set data attribute for the context id
        connection.setAttribute('data-viewport', this.uid);
        return id;
    }
    unregisterConnection(id) {
        const connection = this.connections.get(id);
        connection.setAttribute('data-viewport', '');
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
    viewportMutation(mutations) {
        if (!mutations.length)
            return;
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
                            const logicNode = node;
                            this.registerNode(logicNode);
                        }
                        else if (node.tagName === 'LOGIC-FLOW-CONNECTOR') {
                            const logicConnector = node;
                            this.registerConnector(logicConnector);
                        }
                        else if (node.tagName === 'LOGIC-FLOW-CONNECTION') {
                            const logicConnection = node;
                            this.registerConnection(logicConnection);
                        }
                    }
                }
                for (let i = 0; i < mutation.removedNodes.length; i++) {
                    const node = mutation.removedNodes[i];
                    if (node instanceof HTMLElement) {
                        if (node.tagName === 'LOGIC-FLOW-NODE') {
                            const logicNode = node;
                            this.unregisterNode(logicNode.getAttribute('id'));
                        }
                        else if (node.tagName === 'LOGIC-FLOW-CONNECTOR') {
                            const logicConnector = node;
                            this.unregisterConnector(logicConnector.getAttribute('id'));
                        }
                        else if (node.tagName === 'LOGIC-FLOW-CONNECTION') {
                            const logicConnection = node;
                            this.unregisterConnection(logicConnection.getAttribute('id'));
                        }
                    }
                }
            }
        });
    }
    static initializeViewport(viewport) {
        // need to register all nodes, connectors and connections
        // that are already in the dom
        const id = viewport.id;
        const instance = ViewContext.instances.get(id);
        const contentEl = viewport.querySelector('.viewport-content');
        const children = contentEl.children;
        const traverse = (el) => {
            if (el.tagName === 'LOGIC-FLOW-NODE') {
                const logicNode = el;
                instance.registerNode(logicNode);
            }
            else if (el.tagName === 'LOGIC-FLOW-CONNECTOR') {
                const logicConnector = el;
                instance.registerConnector(logicConnector);
            }
            else if (el.tagName === 'LOGIC-FLOW-CONNECTION') {
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
    }
    bringToFront(node) {
        var _a;
        this.bringingToFront = true;
        (_a = node.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(node);
    }
    static setCursor(cursor) {
        document.body.style.cursor = cursor;
    }
    static resetCursor() {
        document.body.style.cursor = 'default';
    }
    getRectCenter(rect) {
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };
    }
    startPanning(worldCoords, cursor = 'grabbing') {
        ViewContext.setCursor(cursor);
        this.isPanning = true;
        this.dragStart = worldCoords;
    }
    panCamera(loc) {
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
    startNodeDrag(target, worldCoords, cursor = 'grabbing') {
        if (!target)
            return false;
        const node = target.closest('logic-flow-node');
        if (!node)
            return false;
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
    updateNodeConnectorPos(aNode, delta) {
        const connectors = aNode.querySelectorAll('logic-flow-connector');
        for (let i = 0; i < connectors.length; i++) {
            const connector = connectors[i];
            const rect = Object.assign({}, this.connectorRects[connector.id]);
            rect.left += delta.x;
            rect.top += delta.y;
            this.connectorRects[connector.id] = rect;
            this.updateNodeConnectorConnectionsPos(connector, rect);
        }
    }
    updateNodeConnectorConnectionsPos(connector, rect) {
        if (connector.connections.length) {
            const pos = this.getRectCenter(rect);
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
    calcSnapToGrid(pos, gridSize) {
        return {
            x: Math.round(pos.x / gridSize) * gridSize,
            y: Math.round(pos.y / gridSize) * gridSize,
        };
    }
    calcNodePos(worldCoords) {
        const pos = {
            x: worldCoords.x - this.activeNodeDragStart.x,
            y: worldCoords.y - this.activeNodeDragStart.y,
        };
        if (!this.snapToGrid)
            return pos;
        return this.calcSnapToGrid(pos, this.connectorSnapDistance);
    }
    moveNode(loc, gridSize) {
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
        // update node position and it's connections
        this.updateNodeConnectorPos(aNode, delta); // ???
        aNode.position = newPos;
    }
    endNodeDrag() {
        this.activeNodeDragging = false;
        this.updateNodeConnectorsQuadtree(this.activeNode);
        // update connections rects
        const connections = this.activeNode.querySelectorAll('logic-flow-connection');
        for (let i = 0; i < connections.length; i++) {
            const connection = connections[i];
            const path = connection.querySelector('path');
            const rect = path.getBoundingClientRect();
            this.connectionRects[connection.id] = {
                left: rect.x - this.viewportOffset.left,
                top: rect.y - this.viewportOffset.top,
                width: rect.width,
                height: rect.height,
            };
            this.updateViewportQuadtree(connection);
        }
        this.updateViewportQuadtree(this.activeNode);
        this.activeNode = null;
    }
    createNewConnection(startPos, type) {
        const connection = document.createElement('logic-flow-connection');
        connection.start = startPos;
        connection.end = startPos;
        connection.type = type;
        this.activeConnection = connection;
        this.contentEl.appendChild(connection);
    }
    moveActiveConnection(loc, snappingDist) {
        const aConn = this.activeConnection;
        // const scrollOffset = {
        //   x: window.scrollX,
        //   y: window.screenY,
        // };
        // console.log(
        //   'scrollOffset',
        //   window.screenY,
        //   window.scrollY,
        //   this.viewportEl.offsetTop,
        // );
        const worldCoords = this.camera.toWorldCoords({
            x: loc.x - this.viewportOffset.left,
            y: loc.y - this.viewportOffset.top,
        });
        const snappableConnector = this.connectorQuadtree.checkNearby({
            x: loc.x - this.viewportOffset.left,
            y: loc.y - this.viewportOffset.top,
        }, snappingDist * this.camera.zoom);
        if (snappableConnector) {
            const rect = this.connectorRects[snappableConnector.id];
            aConn.end = this.getRectCenter(rect);
        }
        else {
            aConn.end = worldCoords;
        }
    }
    getTargetConnector(target, loc, snappingDist) {
        let targetConnector = target.closest('logic-flow-connector .connector');
        // const scrollOffset = {
        //   x: window.scrollX,
        //   y: window.scrollY,
        // };
        const snappedConnector = this.connectorQuadtree.checkNearby({
            x: loc.x - this.viewportOffset.left,
            y: loc.y - this.viewportOffset.top,
        }, snappingDist * this.camera.zoom);
        if (snappedConnector) {
            targetConnector = this.connectors.get(snappedConnector.id);
        }
        return targetConnector;
    }
    startNewConnection(target, cursor = 'grabbing') {
        if (!target)
            return false;
        const connEl = target.closest('logic-flow-connector .connector');
        if (!connEl)
            return false;
        ViewContext.setCursor(cursor);
        this.activeConnector = connEl;
        const parentConn = connEl.closest('logic-flow-connector');
        const rect = this.connectorRects[parentConn.id];
        const center = this.getRectCenter(rect);
        this.createNewConnection(center, parentConn.type);
        return true;
    }
    processConnection(target) {
        const aConn = this.activeConnector.closest('logic-flow-connector');
        const tConn = target.closest('logic-flow-connector');
        // find parent nodes
        const aNode = aConn.closest('logic-flow-node');
        const tNode = tConn.closest('logic-flow-node');
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
            left: rect.x - this.viewportOffset.left,
            top: rect.y - this.viewportOffset.top,
            width: rect.width,
            height: rect.height,
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
    isValidConnection(aConn, tConn, aNode, tNode, targetConn) {
        // avoid connecting to self or already connected
        if (this.activeConnector.connectingConnector === tConn ||
            tConn.connectingConnector === aConn) {
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
    updateConnectionEndpoints(active, target) {
        const targRect = this.connectorRects[target.id];
        if (active.type === 'input') {
            // swap start and end connections
            this.activeConnection.start = this.getRectCenter(targRect);
            this.activeConnection.end = this.activeConnectorStartPos;
            this.activeConnection.type = 'output';
            const rect = this.connectorRects[active.id];
            this.activeConnection.end = this.getRectCenter(rect);
        }
        else {
            this.activeConnection.end = this.getRectCenter(targRect);
        }
    }
    finalizeConnection(active, target) {
        active.connectingConnector = target;
        active.connections.push(this.activeConnection);
        target.connectingConnector = active;
        target.connections.push(this.activeConnection);
    }
    startDisconnectConnection(target, loc, snappingDist, cursor = 'grabbing') {
        if (!target)
            return false;
        const connection = target.closest('logic-flow-connection');
        if (!connection)
            return false;
        this.bringToFront(connection);
        // const scrollOffset = {
        //   x: window.scrollX,
        //   y: window.scrollY,
        // };
        const snappableConnector = this.connectorQuadtree.checkNearby({
            x: loc.x - this.viewportOffset.left,
            y: loc.y - this.viewportOffset.top,
        }, snappingDist * this.camera.zoom);
        if (!snappableConnector)
            return false;
        ViewContext.setCursor(cursor);
        this.activeConnection = connection;
        const snapConnector = this.connectors.get(snappableConnector.id);
        this.activeConnector =
            snapConnector.connectingConnector;
        this.disconnectConnector(this.activeConnection, this.activeConnector, snapConnector);
        // handle type specific logic
        if (this.activeConnector.type === 'input') {
            this.swapConnectionEndpoints(this.activeConnection);
            this.activeConnection.type = 'input';
        }
        return true;
    }
    disconnectConnector(connection, connector, snapConnector) {
        connector.connections = connector.connections.filter(c => c !== connection);
        snapConnector.connections = snapConnector.connections.filter(c => c !== connection);
        connector.connectingConnector = null;
        snapConnector.connectingConnector = null;
    }
    swapConnectionEndpoints(connection) {
        const { start, end } = connection;
        connection.start = end;
        connection.end = start;
    }
    updateNodeConnectorsQuadtree(node) {
        const connectors = node.querySelectorAll('logic-flow-connector');
        for (let i = 0; i < connectors.length; i++) {
            const connector = connectors[i];
            let rect = this.connectorRects[connector.id];
            if (!rect) {
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
    updateViewportQuadtree(entity) {
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
        }
        else if (entity.tagName === 'LOGIC-FLOW-CONNECTION') {
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
        const visibleEntities = this.viewportQuadtree.query(rect, [], this.camera.pos, this.camera.zoom);
        const newVisibleElements = visibleEntities.map((entity) => entity.id);
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
                const entityComponent = el;
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
ViewContext.instances = new Map();

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
    // const dpr = window.devicePixelRatio || 1;
    // canvas.width = width * dpr;
    // canvas.height = height * dpr;
    // ctx.scale(dpr, dpr);
    // canvas.width = width;
    // canvas.height = height;
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
    // const dpr = window.devicePixelRatio || 1;
    // canvas.width = width * dpr;
    // canvas.height = height * dpr;
    // ctx.scale(dpr, dpr);
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
    ctx.fillStyle = color;
    for (let x = -offsetX; x < width; x += step) {
        for (let y = -offsetY; y < height; y += step) {
            //  ctx.moveTo(x, y);
            //  ctx.arc(x, y, 1, 0, 2 * Math.PI);
            // use fill rect
            ctx.fillRect(x - 1, y - 1, 2, 2);
        }
    }
    ctx.stroke();
};

const logicFlowViewportCss = ":host{display:block}";

const LogicFlowViewport = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.debouncedResize = debounce(() => this.onResize(), 16);
        this.debouncedUpdateScreen = debounce(() => this.updateScreen(), 1);
        this.debouncedUpdateViewportRect = debounce(() => this.ctx.updateViewportRect(), 100);
        this.throttledTouchMove = throttle(e => this.handleTouchMove(e), 1);
        this.forceContentReflowDebounced = debounce(() => this.forceContentReflow(), 30);
        this.elMouseDown = (e) => this.onPointerDown(e);
        this.elMouseUp = (e) => this.onPointerUp(e);
        this.elMouseMove = (e) => this.onPointerMove(e);
        this.elTouchStart = (e) => this.handleTouchStart(e);
        this.elTouchMove = (e) => this.throttledTouchMove(e);
        this.elTouchEnd = (e) => this.onPointerUp(e);
        this.elWheel = (e) => this.handleWheel(e);
        this.elScroll = () => this.debouncedUpdateViewportRect();
        this.showGrid = true;
        this.gridType = 'line';
        this.gridSize = 20;
        this.gridBgColor = '#f7f7f7';
        this.gridLineColor = '#555555';
        this.maxZoom = 3;
        this.minZoom = 0.2;
        this.zoomSpeed = 0.08;
        this.snapToGrid = false;
        this.connectorSnappingDistance = 37;
        this.cursors = {
            default: 'auto',
            panning: 'grabbing',
            moving: 'grabbing',
        };
    }
    componentDidLoad() {
        this.ctx = new ViewContext(this.el);
        // this.ctx.camera = this.ctx.camera;
        this.ctx.viewportEl = this.el.querySelector('.logic-flow-viewport');
        this.ctx.contentEl = this.el.querySelector('.viewport-content');
        this.ctx.gridEl = this.el.querySelector('.logic-flow-grid');
        // this.ctx.viewportRect = this.ctx.viewportEl.getBoundingClientRect();
        this.ctx.initialPinchDistance = 0;
        this.ctx.snapToGrid = this.snapToGrid;
        this.ctx.connectorSnapDistance = this.connectorSnappingDistance;
        const viewportEl = this.ctx.viewportEl;
        // setup event listeners
        window.addEventListener('mousedown', this.elMouseDown, {
            passive: true,
        });
        viewportEl.addEventListener('mouseup', this.elMouseUp, { passive: true });
        viewportEl.addEventListener('mousemove', this.elMouseMove, {
            passive: true,
        });
        viewportEl.addEventListener('touchstart', this.elTouchStart, {
            passive: false,
        });
        viewportEl.addEventListener('touchmove', this.elTouchMove, {
            passive: false,
        });
        viewportEl.addEventListener('touchend', this.elTouchEnd, { passive: true });
        viewportEl.addEventListener('wheel', this.elWheel, { passive: false });
        window.addEventListener('scroll', this.elScroll, { passive: true });
        // Handle resize events
        this.resizeObserver = new ResizeObserver(() => this.debouncedResize());
        this.resizeObserver.observe(this.ctx.viewportEl);
        this.renderGrid();
    }
    disconnectedCallback() {
        // Clean up resize observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        // Clean up event listeners
        const canvasEl = this.ctx.viewportEl;
        window.removeEventListener('mousedown', this.elMouseDown);
        canvasEl.removeEventListener('mouseup', this.elMouseUp);
        canvasEl.removeEventListener('mousemove', this.elMouseMove);
        canvasEl.removeEventListener('touchstart', this.elTouchStart);
        canvasEl.removeEventListener('touchmove', this.elTouchMove);
        canvasEl.removeEventListener('touchend', this.elTouchEnd);
        canvasEl.removeEventListener('wheel', this.elWheel);
        window.removeEventListener('scroll', this.elScroll);
        this.ctx.destroy();
    }
    async getCamera() {
        return this.ctx.camera;
    }
    async screenToWorldCoords(screenCoords) {
        // adjust screen coords to viewport offset
        const loc = {
            x: screenCoords.x - this.ctx.viewportOffset.left,
            y: screenCoords.y - this.ctx.viewportOffset.top,
        };
        return this.ctx.camera.toWorldCoords(loc);
    }
    onSnapToGridChange() {
        this.ctx.snapToGrid = this.snapToGrid;
    }
    onGridTypeChange() {
        this.ctx.needsRedraw = true;
        this.renderGrid();
    }
    scheduleComponentUpdate() {
        this.ctx.needsRedraw = true;
        this.ctx.debouncedUpdateVisibleElements();
        this.debouncedUpdateScreen();
    }
    onResize() {
        // console.log('onResize');
        this.ctx.needsRedraw = true;
        this.ctx.viewportRect = this.ctx.viewportEl.getBoundingClientRect();
        this.ctx.gridEl.width = this.ctx.viewportRect.width;
        this.ctx.gridEl.height = this.ctx.viewportRect.height;
        this.ctx.viewportOffset = {
            top: this.ctx.viewportRect.top,
            left: this.ctx.viewportRect.left,
        };
        // update quadtree boundary
        const boundary = {
            left: this.ctx.viewportRect.left - this.ctx.viewportRect.left,
            top: this.ctx.viewportRect.top - this.ctx.viewportRect.top,
            width: this.ctx.viewportRect.width,
            height: this.ctx.viewportRect.height,
        };
        // get set viewport rect
        this.ctx.viewportRect = boundary;
        this.ctx.connectorQuadtree.boundary = this.ctx.viewportRect;
        this.ctx.viewportQuadtree.boundary = this.ctx.viewportRect;
        this.renderGrid();
    }
    renderGrid() {
        if (!this.showGrid || !this.ctx.needsRedraw)
            return;
        requestAnimationFrame(() => {
            if (this.gridType === 'line') {
                renderCanvasGrid(this.ctx.gridEl, this.ctx.viewportRect.width, this.ctx.viewportRect.height, this.gridSize, this.gridLineColor, this.gridBgColor, this.ctx.camera);
            }
            if (this.gridType === 'dot') {
                renderCanvasDotGrid(this.ctx.gridEl, this.ctx.viewportRect.width, this.ctx.viewportRect.height, this.gridSize, this.gridLineColor, this.gridBgColor, this.ctx.camera);
            }
        });
        this.ctx.needsRedraw = false;
    }
    updateScreen() {
        requestAnimationFrame(() => {
            const contentEl = this.ctx.contentEl;
            // Apply transformations to the content, aligning with the grid
            contentEl.style.transform = `perspective(1px) scale(${this.ctx.camera.zoom}) translate(${this.ctx.camera.pos.x}px, ${this.ctx.camera.pos.y}px)`;
            this.renderGrid();
        });
    }
    onPointerDown(event) {
        const loc = getEventLocation(event);
        const worldCoords = this.ctx.camera.toWorldCoords(loc);
        const target = document.elementFromPoint(loc.x, loc.y);
        // if pointer outside viewport, return
        if (loc.x > this.ctx.viewportOffset.left + this.ctx.viewportRect.width ||
            loc.x < this.ctx.viewportOffset.left ||
            loc.y > this.ctx.viewportOffset.top + this.ctx.viewportRect.height ||
            loc.y < this.ctx.viewportOffset.top) {
            return;
        }
        // if target is not a logic-flow element, return
        if (!target ||
            !target.closest('logic-flow-node, logic-flow-connector, logic-flow-connection, logic-flow-viewport')) {
            return;
        }
        // if a connection clicked
        if (this.ctx.startDisconnectConnection(target, loc, this.connectorSnappingDistance, this.cursors.moving))
            return;
        // if a connector clicked
        if (this.ctx.startNewConnection(target))
            return;
        // if a node clicked
        if (this.ctx.startNodeDrag(target, worldCoords))
            return;
        // if nothing clicked, then start panning
        this.ctx.startPanning(worldCoords);
    }
    onPointerUp(event) {
        if (this.ctx.activeConnector && this.ctx.activeConnection) {
            this.onEndActiveConnection(event);
        }
        else if (this.ctx.activeNode && this.ctx.activeNodeDragging) {
            this.ctx.endNodeDrag();
        }
        this.ctx.resetPointerStates();
    }
    onEndActiveConnection(event) {
        const loc = getEventLocation(event);
        let target = event.target;
        // For touch events, get the element at the touch point
        if (event instanceof TouchEvent) {
            target = document.elementFromPoint(loc.x, loc.y);
        }
        let targetConnector = this.ctx.getTargetConnector(target, loc, this.connectorSnappingDistance);
        if (targetConnector) {
            this.ctx.processConnection(targetConnector);
        }
        else {
            this.ctx.activeConnection.remove();
        }
        // clear active states
        this.ctx.activeConnector = null;
        this.ctx.activeConnection = null;
    }
    onPointerMove(event) {
        const loc = getEventLocation(event);
        if (this.ctx.activeConnector && this.ctx.activeConnection) {
            this.ctx.moveActiveConnection(loc, this.connectorSnappingDistance);
        }
        else if (this.ctx.activeNode && this.ctx.activeNodeDragging) {
            this.ctx.moveNode(loc, this.gridSize);
        }
        else if (this.ctx.isPanning) {
            this.ctx.panCamera(loc);
            this.scheduleComponentUpdate();
        }
    }
    handleWheel(event) {
        event.preventDefault();
        const canvasRect = this.ctx.viewportRect;
        const mouseX = event.clientX - canvasRect.left - this.ctx.viewportOffset.left;
        const mouseY = event.clientY - canvasRect.top - this.ctx.viewportOffset.top;
        // Calculate the zoom level change
        const zoomDelta = event.deltaY < 0 ? this.zoomSpeed : -this.zoomSpeed;
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.ctx.camera.zoom + zoomDelta));
        // Calculate the scale factor
        const scaleFactor = newZoom / this.ctx.camera.zoom;
        // Adjust the pan position to keep the same point under the cursor
        const newPanX = mouseX -
            (mouseX - this.ctx.camera.pos.x * this.ctx.camera.zoom) * scaleFactor;
        const newPanY = mouseY -
            (mouseY - this.ctx.camera.pos.y * this.ctx.camera.zoom) * scaleFactor;
        // Update pan and zoom
        this.ctx.camera.pos = { x: newPanX / newZoom, y: newPanY / newZoom };
        // this.lastZoom = this.ctx.camera.zoom;
        this.ctx.camera.zoom = newZoom;
        // if zooming in, force a reflow to prevent blurry text
        if (zoomDelta > 0) {
            this.forceContentReflowDebounced();
        }
        // this.ctx.needsRedraw = true;
        this.scheduleComponentUpdate();
    }
    handleTouchStart(event) {
        if (event.touches.length === 1) {
            // Single touch -> start panning
            this.onPointerDown(event);
        }
        else if (event.touches.length === 2) {
            // Multi-touch -> start pinch zoom
            this.ctx.initialPinchDistance = 0; // Reset initial pinch distance
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
        if (this.ctx.initialPinchDistance === 0) {
            // If it's the start of the pinch, initialize the pinch distance
            this.ctx.initialPinchDistance = distance;
        }
        else {
            // Calculate the scale factor based on the distance change
            const scaleFactor = distance / this.ctx.initialPinchDistance;
            // Calculate the midpoint between the two fingers (the pinch center)
            const pinchCenterX = (touch1.clientX + touch2.clientX) / 2;
            const pinchCenterY = (touch1.clientY + touch2.clientY) / 2;
            // Apply zoom and keep the pinch center fixed
            this.adjustZoomOnPinch(scaleFactor, pinchCenterX, pinchCenterY);
            // Update the initial pinch distance for the next move
            this.ctx.initialPinchDistance = distance;
        }
    }
    adjustZoomOnPinch(scaleFactor, pinchCenterX, pinchCenterY) {
        // Calculate new zoom, ensuring it stays within min/max bounds
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.ctx.camera.zoom * scaleFactor));
        // Find the pinch center position relative to the content's current position and zoom
        const pinchContentX = (pinchCenterX - this.ctx.camera.pos.x * this.ctx.camera.zoom) /
            this.ctx.camera.zoom;
        const pinchContentY = (pinchCenterY - this.ctx.camera.pos.y * this.ctx.camera.zoom) /
            this.ctx.camera.zoom;
        // Adjust pan so the pinch center stays fixed after zooming
        this.ctx.camera.pos = {
            x: pinchCenterX / newZoom - pinchContentX,
            y: pinchCenterY / newZoom - pinchContentY,
        };
        // Apply the new zoom level
        this.ctx.camera.zoom = newZoom;
        // Trigger a screen redraw
        this.debouncedUpdateScreen();
    }
    forceContentReflow() {
        // force repaint the content
        const cdisplay = this.ctx.contentEl.style.display;
        this.ctx.contentEl.style.display = 'none';
        this.ctx.contentEl.offsetHeight; // trigger reflow
        this.ctx.contentEl.style.display = cdisplay;
    }
    render() {
        return (
        // <Host>
        h("div", { key: '12c39698a771ed009a6cf2fc26a785265b616b8f', class: "logic-flow-viewport" }, h("canvas", { key: '5239d4b977beadccb71ef4db3bafbbcae1f370ca', class: "logic-flow-grid", style: { display: this.showGrid ? 'block' : 'none' } }), h("div", { key: '24a80000a51133eea98f7d8b000aeef2ff10460c', class: "viewport-content" }, h("slot", { key: '636a27bf76cea5d1df87713f0c22fe2fcc0f3f61' })))
        // /* </Host> */
        );
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "snapToGrid": ["onSnapToGridChange"],
        "gridType": ["onGridTypeChange"]
    }; }
};
LogicFlowViewport.style = logicFlowViewportCss;

export { LogicFlowViewport as logic_flow_viewport };

//# sourceMappingURL=logic-flow-viewport.entry.js.map