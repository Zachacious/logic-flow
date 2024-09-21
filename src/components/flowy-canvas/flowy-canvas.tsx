import { Component, Host, Prop, h, Element } from '@stencil/core';
import { Coords } from '../../types/Coords';
import { debounce } from '../../utils/debounce';
import { throttle } from '../../utils/throttle';
import { getEventLocation } from '../../utils/getEventLocation';
import { Quadtree } from '../../types/Quadtree';
import { Camera } from '../../types/Camera';
import { ViewContext } from '../../types/ViewContext';
import {
  renderCanvasDotGrid,
  renderCanvasGrid,
} from '../../utils/renderCanvasGrid';

@Component({
  tag: 'flowy-canvas',
  styleUrl: 'flowy-canvas.css',
  shadow: false,
})
export class FlowyCanvas {
  @Element() el: HTMLFlowyCanvasElement;

  @Prop() showGrid: boolean = true;
  @Prop() showDotGrid: boolean = false;
  @Prop() gridSize: number = 20;
  @Prop() gridBgColor: string = '#f7f7f7';
  @Prop() gridLineColor: string = '#555555';
  @Prop() maxZoom: number = 3;
  @Prop() minZoom: number = 0.2;
  @Prop() zoomSpeed: number = 0.08;
  @Prop() snapToGrid: boolean = false;
  @Prop() connectorSnappingDistance: number = 37;

  ctx: ViewContext;
  camera: Camera;
  canvasEl: HTMLDivElement;
  contentEl: HTMLDivElement;
  gridEl: HTMLCanvasElement;
  needsRedraw: boolean = true;
  canvasRect: DOMRect;
  quadtree: Quadtree;

  initialPinchDistance: number = 0;
  isDragging: boolean = false;
  dragStart: Coords = { x: 0, y: 0 };

  activeNode: HTMLLogicNodeElement;
  activeNodeDragging: boolean = false;
  activeNodeDragStart: Coords = { x: 0, y: 0 };
  activeConnector: HTMLLogicConnectorElement;
  activeConnectorStartPos: Coords = { x: 0, y: 0 };
  activeConnection: HTMLLogicConnectionElement;

  resizeObserver: ResizeObserver;
  debouncedResize = debounce(() => this.onResize(), 16);
  debouncedUpdateScreen = debounce(() => this.updateScreen(), 1);
  throttledTouchMove = throttle(e => this.handleTouchMove(e), 1);
  forceContentReflowDebounced = debounce(() => this.forceContentReflow(), 30);

  elMouseDown = (e: MouseEvent | TouchEvent) => this.onPointerDown(e);
  elMouseUp = (e: MouseEvent | TouchEvent) => this.onPointerUp(e);
  elMouseMove = (e: MouseEvent | TouchEvent) => this.onPointerMove(e);

  elTouchStart = (e: TouchEvent) => this.handleTouchStart(e);
  elTouchMove = (e: TouchEvent) => this.throttledTouchMove(e);
  elTouchEnd = (e: MouseEvent | TouchEvent) => this.onPointerUp(e);

  elWheel = (e: WheelEvent) => this.handleWheel(e);

  componentDidLoad() {
    this.ctx = new ViewContext(this.el);
    this.camera = this.ctx.camera;

    this.canvasEl = this.el.querySelector('.flowy-canvas') as HTMLDivElement;
    this.contentEl = this.el.querySelector('.flowy-content') as HTMLDivElement;
    this.gridEl = this.el.querySelector('.flowy-grid') as HTMLCanvasElement;
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
    if ((!this.showGrid && !this.showDotGrid) || !this.needsRedraw) return;

    requestAnimationFrame(() => {
      if (this.showGrid) {
        renderCanvasGrid(
          this.gridEl,
          this.canvasRect.width,
          this.canvasRect.height,
          this.gridSize,
          this.gridLineColor,
          this.gridBgColor,
          this.camera,
        );
      }

      if (this.showDotGrid) {
        renderCanvasDotGrid(
          this.gridEl,
          this.canvasRect.width,
          this.canvasRect.height,
          this.gridSize,
          this.gridLineColor,
          this.gridBgColor,
          this.camera,
        );
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

  onPointerDown(event: MouseEvent | TouchEvent) {
    const loc = getEventLocation(event);
    const worldCoords = this.camera.toWorldCoords(loc);

    let target = event.target as HTMLElement;
    target = document.elementFromPoint(loc.x, loc.y) as HTMLElement;

    // if a connection clicked
    const connection = target.closest('logic-connection');
    if (connection) {
      const snappableConnector = this.quadtree.checkNearby(
        loc.x,
        loc.y,
        this.connectorSnappingDistance * this.camera.zoom,
      );
      if (snappableConnector) {
        // set mouse cursor to grabbing
        window.document.body.style.cursor = 'grabbing';

        // this.isReconnectAttempt = true;
        // if connector is close, then disconnect and setup as current dragging connection
        this.activeConnection = connection as HTMLLogicConnectionElement;

        const snapConn = this.ctx.connectors.get(snappableConnector.id);

        this.activeConnector =
          snapConn.connectingConnector as HTMLLogicConnectorElement;

        this.activeConnector.connections =
          this.activeConnector.connections.filter(
            conn => conn !== this.activeConnection,
          );

        snapConn.connections = snapConn.connections.filter(
          conn => conn !== this.activeConnection,
        );

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
    } else if (target.closest('.logic-connector .connector')) {
      // set cursor to cell
      window.document.body.style.cursor = 'grabbing';

      this.activeConnector = target.closest(
        'logic-connector .connector',
      ) as HTMLLogicConnectorElement;
      const parentConn = this.activeConnector.closest(
        'logic-connector',
      ) as HTMLLogicConnectorElement;
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
    } else if (target.closest('logic-node')) {
      // set cursor to move
      window.document.body.style.cursor = 'grabbing';

      this.activeNode = target.closest('logic-node') as HTMLLogicNodeElement;
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

  onPointerUp(event: MouseEvent | TouchEvent) {
    // event.stopPropagation();
    if (this.activeConnector && this.activeConnection) {
      const loc = getEventLocation(event);
      let target = event.target as HTMLElement;
      if (event instanceof TouchEvent) {
        target = document.elementFromPoint(loc.x, loc.y) as HTMLElement;
      }

      let targetConnector = target.closest(
        'logic-connector .connector',
      ) as HTMLLogicConnectorElement;

      const snappedConnector = this.quadtree.checkNearby(
        loc.x,
        loc.y,
        this.connectorSnappingDistance * this.camera.zoom,
      );
      if (snappedConnector) {
        targetConnector = this.ctx.connectors.get(snappedConnector.id);
      }

      if (targetConnector) {
        let aConn = this.activeConnector.closest(
          'logic-connector',
        ) as HTMLLogicConnectorElement;
        let tConn = targetConnector.closest(
          'logic-connector',
        ) as HTMLLogicConnectorElement;

        // find parent node of each
        const aNode = aConn.closest('logic-node') as HTMLLogicNodeElement;
        const tNode = tConn.closest('logic-node') as HTMLLogicNodeElement;

        // make sure not already connected to this connector
        if (
          this.activeConnector.connectingConnector === tConn ||
          tConn.connectingConnector === aConn
        ) {
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
        } else {
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
      } else {
        this.activeConnection.remove();
      }
      this.activeConnector = null;
      this.activeConnection = null;
    } else if (this.activeNode && this.activeNodeDragging) {
      this.activeNodeDragging = false;
      // update connector in quadtree
      const connectors = this.activeNode.querySelectorAll(
        'logic-connector',
      ) as NodeListOf<HTMLLogicConnectorElement>;

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

  onPointerMove(event: MouseEvent | TouchEvent) {
    const loc = getEventLocation(event);

    if (this.activeConnector && this.activeConnection) {
      const aConn = this.activeConnection;
      const worldCoords = this.camera.toWorldCoords(loc);
      // requestAnimationFrame(() => {
      const snappableConnector = this.quadtree.checkNearby(
        loc.x,
        loc.y,
        this.connectorSnappingDistance * this.camera.zoom,
        // this.camera.pos,
        // this.camera.zoom,
      );
      if (snappableConnector) {
        const rect = this.ctx.connectorRects[snappableConnector.id];
        const pos = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        aConn.end = pos;
      } else {
        const pos = worldCoords;
        aConn.end = pos;
      }
      // });
      return;
    } else if (this.activeNode && this.activeNodeDragging) {
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
      const connectors = aNode.querySelectorAll(
        'logic-connector',
      ) as NodeListOf<HTMLLogicConnectorElement>;

      for (let i = 0; i < connectors.length; i++) {
        const connector = connectors[i];

        const connId = connector.getAttribute('id');

        // update connections
        // update rect
        let rect = { ...this.ctx.connectorRects[connId] };
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
            } else {
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

  handleWheel(event: WheelEvent) {
    event.preventDefault();

    const canvasRect = this.canvasRect;
    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;

    // Calculate the zoom level change
    const zoomDelta = event.deltaY < 0 ? this.zoomSpeed : -this.zoomSpeed;
    const newZoom = Math.min(
      this.maxZoom,
      Math.max(this.minZoom, this.camera.zoom + zoomDelta),
    );

    // Calculate the scale factor
    const scaleFactor = newZoom / this.camera.zoom;

    // Adjust the pan position to keep the same point under the cursor
    const newPanX =
      mouseX - (mouseX - this.camera.pos.x * this.camera.zoom) * scaleFactor;
    const newPanY =
      mouseY - (mouseY - this.camera.pos.y * this.camera.zoom) * scaleFactor;

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

  handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      // Single touch -> start panning
      this.onPointerDown(event);
    } else if (event.touches.length === 2) {
      // Multi-touch -> start pinch zoom
      this.initialPinchDistance = 0; // Reset initial pinch distance
      this.handlePinch(event); // Start pinch gesture
    }
  }

  handleTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      // Single touch -> panning
      this.onPointerMove(event);
    } else if (event.touches.length === 2) {
      // Multi-touch -> pinch zooming
      this.handlePinch(event);
    }
  }

  handlePinch(event: TouchEvent) {
    if (event.touches.length !== 2) return;

    // handle panning while pinching
    this.onPointerMove(event);

    event.preventDefault(); // Prevent default behavior like scrolling

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];

    // Calculate the distance between the two touch points (pinch)
    const distance = Math.sqrt(
      (touch1.clientX - touch2.clientX) ** 2 +
        (touch1.clientY - touch2.clientY) ** 2,
    );

    if (this.initialPinchDistance === 0) {
      // If it's the start of the pinch, initialize the pinch distance
      this.initialPinchDistance = distance;
    } else {
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

  adjustZoomOnPinch(
    scaleFactor: number,
    pinchCenterX: number,
    pinchCenterY: number,
  ) {
    // Calculate new zoom, ensuring it stays within min/max bounds
    const newZoom = Math.min(
      this.maxZoom,
      Math.max(this.minZoom, this.camera.zoom * scaleFactor),
    );

    // Find the pinch center position relative to the content's current position and zoom
    const pinchContentX =
      (pinchCenterX - this.camera.pos.x * this.camera.zoom) / this.camera.zoom;
    const pinchContentY =
      (pinchCenterY - this.camera.pos.y * this.camera.zoom) / this.camera.zoom;

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
    return (
      <Host>
        <div class="flowy-canvas">
          <canvas class="flowy-grid"></canvas>
          <div class="flowy-content">
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
