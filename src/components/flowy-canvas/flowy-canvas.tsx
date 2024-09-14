import { Component, Host, Prop, h, Element, State, Watch } from '@stencil/core';
import { Point } from '../../types/Point';
import { debounce } from '../../utils/debounce';
import { throttle } from '../../utils/throttle';
import { getEventLocation } from '../../utils/getEventLocation';
import { nanoid } from 'nanoid';
import { LogicNode } from '../logic-node/logic-node';

@Component({
  tag: 'flowy-canvas',
  styleUrl: 'flowy-canvas.css',
  shadow: false,
})
export class FlowyCanvas {
  @Element() el: HTMLElement;

  @Prop() renderGrid: boolean = true;
  @Prop() gridSize: number = 20;
  @Prop() gridBgColor: string = '#f3f3f3';
  @Prop() gridLineColor: string = '#555555';
  @Prop() maxZoom: number = 3;
  @Prop() minZoom: number = 0.2;
  @Prop() zoomSpeed: number = 0.08;

  @State() zoom: number = 1;
  @State() pan: Point = { x: 0, y: 0 };

  private _uid: string = nanoid();
  private _initialPinchDistance: number = 0;
  private _isDragging: boolean = false;
  private _dragStart: Point = { x: 0, y: 0 };

  private _activeNode: HTMLLogicNodeElement;
  private _activeNodeDragging: boolean = false;
  private _activeNodeDragStart: Point = { x: 0, y: 0 };
  private _activeConnector: HTMLLogicConnectorElement;
  private _activeConnectorStartPos: Point = { x: 0, y: 0 };
  private _activeConnection: HTMLLogicConnectionElement;

  private _canvasEl: HTMLDivElement;
  private _contentEl: HTMLDivElement;
  private _gridEl: HTMLCanvasElement;
  private _needsRedraw: boolean = true;
  private _canvasRect: DOMRect;

  private _resizeObserver: ResizeObserver;
  private _debouncedResize = debounce(() => this.onResize(), 50);
  private _debouncedUpdateScreen = debounce(() => this.updateScreen(), 5);
  private _throttledPointerMove = throttle(e => this.onPointerMove(e), 30);
  private _throttledTouchMove = throttle(e => this.handleTouchMove(e), 30);

  private _elMouseDown = (e: MouseEvent | TouchEvent) => this.onPointerDown(e);
  private _elMouseUp = (e: MouseEvent | TouchEvent) => this.onPointerUp(e);
  private _elMouseMove = (e: MouseEvent | TouchEvent) =>
    this._throttledPointerMove(e);

  private _elTouchStart = (e: TouchEvent) => this.handleTouchStart(e);
  private _elTouchMove = (e: TouchEvent) => this._throttledTouchMove(e);
  private _elTouchEnd = (e: MouseEvent | TouchEvent) => this.onPointerUp(e);

  private _elWheel = (e: WheelEvent) => this.handleWheel(e);

  componentDidLoad() {
    this._canvasEl = this.el.querySelector('.flowy-canvas') as HTMLDivElement;
    this._contentEl = this.el.querySelector('.flowy-content') as HTMLDivElement;
    this._gridEl = this.el.querySelector('.flowy-grid') as HTMLCanvasElement;

    this._canvasRect = this._canvasEl.getBoundingClientRect();

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
      passive: false,
    });
    canvasEl.addEventListener('touchmove', this._elTouchMove, {
      passive: true,
    });
    canvasEl.addEventListener('touchend', this._elTouchEnd, { passive: true });

    canvasEl.addEventListener('wheel', this._elWheel, { passive: false });

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
  }

  @Watch('zoom')
  zoomChanged() {
    this._needsRedraw = true;
    // this.updateScreen();
    this._debouncedUpdateScreen();
  }

  @Watch('pan')
  panChanged() {
    this._needsRedraw = true;
    // this.updateScreen();
    this._debouncedUpdateScreen();
  }

  onResize() {
    this._needsRedraw = true;
    this._canvasRect = this._canvasEl.getBoundingClientRect();
    this.renderGridLines();
  }

  renderGridLines() {
    if (!this.renderGrid || !this._needsRedraw) return;

    const canvasEl = this._gridEl;
    const ctx = canvasEl.getContext('2d');
    const width = this._canvasRect.width;
    const height = this._canvasRect.height;
    const step = this.gridSize * this.zoom;

    const dpr = window.devicePixelRatio || 1;
    canvasEl.width = width * dpr;
    canvasEl.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = this.gridLineColor;
    ctx.lineWidth = 1;

    // clear
    ctx.fillStyle = this.gridBgColor;
    ctx.fillRect(0, 0, width, height);

    const panOffsetX = (-this.pan.x % this.gridSize) * this.zoom;
    const panOffsetY = (-this.pan.y % this.gridSize) * this.zoom;

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

    this._needsRedraw = false;
  }

  updateScreen() {
    // this.renderGridLines();
    const contentEl = this._contentEl;
    // Apply transformations to the content, aligning with the grid
    contentEl.style.transform = `perspective(1px) scale(${this.zoom}) translate(${this.pan.x}px, ${this.pan.y}px)`;
    requestAnimationFrame(() => this.renderGridLines());
  }

  // get location from event data for mouse or touch
  getEventLocation(event: MouseEvent | TouchEvent) {
    if (event instanceof TouchEvent) {
      if (event.touches && event.touches[0]) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
    } else {
      return { x: event.clientX, y: event.clientY };
    }
  }

  onPointerDown(event: MouseEvent | TouchEvent) {
    const loc = getEventLocation(event);

    const target = event.target as HTMLElement;

    if (target.closest('.logic-connector .connector')) {
      this._activeConnector = target.closest(
        'logic-connector .connector',
      ) as HTMLLogicConnectorElement;
      // this._activeConnector.isDrawing = true;
      const rect = this._activeConnector.getBoundingClientRect();
      // const node = this._activeConnector.closest('logic-node') as HTMLLogicNodeElement;
      // const nodeRect = node.getBoundingClientRect();
      // account for node position and find center of connector
      this._activeConnectorStartPos = {
        x: (rect.left + rect.width / 2) / this.zoom - this.pan.x,
        y: (rect.top + rect.height / 2) / this.zoom - this.pan.y,
      };
      // console.log('connector start pos', this._activeConnectorStartPos);

      // create a new connection element
      const connection = document.createElement('logic-connection');
      connection.start = this._activeConnectorStartPos;
      connection.end = this._activeConnectorStartPos;
      this._contentEl.appendChild(connection);
      this._activeConnection = connection;
      // Associate the connection with the connector
      // this._activeConnector.connection = connection;
      return;
    } else if (target.closest('logic-node')) {
      this._activeNode = target.closest('logic-node') as HTMLLogicNodeElement;
      // bring active node to front by moving element to the end of the parent
      // this._activeNode.parentNode.appendChild(this._activeNode);
      const rect = this._activeNode.getBoundingClientRect();
      this._activeNodeDragStart = {
        x: (loc.x - rect.left) / this.zoom,
        y: (loc.y - rect.top) / this.zoom,
      };
      this._activeNodeDragging = true;

      return;
    }

    this._isDragging = true;

    this._dragStart = {
      x: loc.x / this.zoom - this.pan.x,
      y: loc.y / this.zoom - this.pan.y,
    };
  }

  onPointerUp(event: MouseEvent | TouchEvent) {
    this._isDragging = false;
    this._initialPinchDistance = 0;
    // this._lastZoom = this.zoom;
    this._activeNode = null;
    this._activeNodeDragging = false;
    if (this._activeConnector && this._activeConnection) {
      const target = event.target as HTMLElement;
      const targetConnector = target.closest(
        'logic-connector .connector',
      ) as HTMLLogicConnectorElement;

      if (targetConnector) {
        // make sure not already connected to this connector
        if (this._activeConnector.connectingConnector === targetConnector) {
          this._activeConnection.remove();
          this._activeConnector = null;
          this._activeConnection = null;
          return;
        }

        const activeParent = this._activeConnector.closest(
          'logic-connector',
        ) as HTMLLogicConnectorElement;
        const targetParent = targetConnector.closest(
          'logic-connector',
        ) as HTMLLogicConnectorElement;
        // make sure only input to output or output to input
        if (activeParent.type === targetParent.type) {
          this._activeConnection.remove();
          this._activeConnector = null;
          this._activeConnection = null;
          return;
        }

        this._activeConnection.end = {
          x:
            (targetConnector.getBoundingClientRect().left +
              targetConnector.getBoundingClientRect().width / 2) /
              this.zoom -
            this.pan.x,
          y:
            (targetConnector.getBoundingClientRect().top +
              targetConnector.getBoundingClientRect().height / 2) /
              this.zoom -
            this.pan.y,
        };

        // get parent logic-connector from activeConnector and targetConnector
        const aConn = this._activeConnector.closest(
          'logic-connector',
        ) as HTMLLogicConnectorElement;
        const tConn = targetConnector.closest(
          'logic-connector',
        ) as HTMLLogicConnectorElement;
        aConn.connectingConnector = tConn;
        aConn.connection = this._activeConnection;
        tConn.connectingConnector = aConn;
        tConn.connection = this._activeConnection;
      } else {
        this._activeConnection.remove();
      }
      this._activeConnector = null;
      this._activeConnection = null;
    }
  }

  onPointerMove(event: MouseEvent | TouchEvent) {
    if (this._activeConnector) {
      requestAnimationFrame(() => {
        const loc = getEventLocation(event);
        const pos = {
          x: loc.x / this.zoom - this.pan.x,
          y: loc.y / this.zoom - this.pan.y,
        };
        this._activeConnection.end = pos;
      });
      return;
    } else if (this._activeNode && this._activeNodeDragging) {
      const loc = getEventLocation(event);
      const newX = loc.x / this.zoom - this._activeNodeDragStart.x - this.pan.x;
      const newY = loc.y / this.zoom - this._activeNodeDragStart.y - this.pan.y;

      this._activeNode.position = { x: newX, y: newY };

      // update connections
      const connectors = this._activeNode.querySelectorAll(
        'logic-connector',
      ) as NodeListOf<HTMLLogicConnectorElement>;

      connectors.forEach(connector => {
        if (connector.connection) {
          const connectorHub = connector.querySelector('.connector');
          const rect = connectorHub.getBoundingClientRect();
          const pos = {
            x: (rect.left + rect.width / 2) / this.zoom - this.pan.x,
            y: (rect.top + rect.height / 2) / this.zoom - this.pan.y,
          };

          // set pos based on side of connector being dragged
          // TODO: get this part right
          if (connector.type === 'input') {
            connector.connection.end = pos;
          } else {
            connector.connection.start = pos;
          }
        }
      });

      return;
    }

    if (this._isDragging) {
      // this._lastPan = this.pan;
      const loc = getEventLocation(event);
      this.pan = {
        x: loc.x / this.zoom - this._dragStart.x,
        y: loc.y / this.zoom - this._dragStart.y,
      };
    }
  }

  handleWheel(event: WheelEvent) {
    event.preventDefault();

    const canvasRect = this._canvasRect;
    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;

    // Calculate the zoom level change
    const zoomDelta = event.deltaY < 0 ? this.zoomSpeed : -this.zoomSpeed;
    const newZoom = Math.min(
      this.maxZoom,
      Math.max(this.minZoom, this.zoom + zoomDelta),
    );

    // Calculate the scale factor
    const scaleFactor = newZoom / this.zoom;

    // Adjust the pan position to keep the same point under the cursor
    const newPanX = mouseX - (mouseX - this.pan.x * this.zoom) * scaleFactor;
    const newPanY = mouseY - (mouseY - this.pan.y * this.zoom) * scaleFactor;

    // Update pan and zoom
    this.pan = { x: newPanX / newZoom, y: newPanY / newZoom };
    // this._lastZoom = this.zoom;
    this.zoom = newZoom;
    this._needsRedraw = true;
  }

  handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      // Single touch -> start panning
      this.onPointerDown(event);
    } else if (event.touches.length === 2) {
      // Multi-touch -> start pinch zoom
      this._initialPinchDistance = 0; // Reset initial pinch distance
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

    if (this._initialPinchDistance === 0) {
      // If it's the start of the pinch, initialize the pinch distance
      this._initialPinchDistance = distance;
    } else {
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

  adjustZoomOnPinch(
    scaleFactor: number,
    pinchCenterX: number,
    pinchCenterY: number,
  ) {
    // Calculate new zoom, ensuring it stays within min/max bounds
    const newZoom = Math.min(
      this.maxZoom,
      Math.max(this.minZoom, this.zoom * scaleFactor),
    );

    // Find the pinch center position relative to the content's current position and zoom
    const pinchContentX = (pinchCenterX - this.pan.x * this.zoom) / this.zoom;
    const pinchContentY = (pinchCenterY - this.pan.y * this.zoom) / this.zoom;

    // Adjust pan so the pinch center stays fixed after zooming
    this.pan = {
      x: pinchCenterX / newZoom - pinchContentX,
      y: pinchCenterY / newZoom - pinchContentY,
    };

    // Apply the new zoom level
    this.zoom = newZoom;

    // Trigger a screen redraw
    this._debouncedUpdateScreen();
  }

  render() {
    return (
      <Host id={this._uid}>
        {/* <div class="flowy-virtual-area"> */}
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
