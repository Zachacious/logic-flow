import { Component, Prop, h, Element, Watch, Method } from '@stencil/core';
import { debounce } from '../../utils/debounce';
import { throttle } from '../../utils/throttle';
import { getEventLocation } from '../../utils/getEventLocation';
import { ViewContext } from '../../types/ViewContext';
import {
  renderCanvasDotGrid,
  renderCanvasGrid,
} from '../../utils/renderCanvasGrid';
import { Coords } from '../../types/Coords';

@Component({
  tag: 'logic-flow-viewport',
  styleUrl: 'logic-flow-viewport.css',
  shadow: false,
})
export class LogicFlowViewport {
  @Element() el: HTMLLogicFlowViewportElement;

  // @Prop() showGrid: boolean = true;
  // @Prop() showDotGrid: boolean = false;
  @Prop() showGrid: boolean = true;
  @Prop() gridType: 'line' | 'dot' = 'line';
  @Prop() gridSize: number = 20;
  @Prop() gridBgColor: string = '#f7f7f7';
  @Prop() gridLineColor: string = '#555555';
  @Prop() maxZoom: number = 3;
  @Prop() minZoom: number = 0.2;
  @Prop() zoomSpeed: number = 0.08;
  @Prop() snapToGrid: boolean = false;
  @Prop() connectorSnappingDistance: number = 37;
  @Prop() cursors: Record<string, string> = {
    default: 'auto',
    panning: 'grabbing',
    moving: 'grabbing',
  };

  ctx: ViewContext;

  resizeObserver: ResizeObserver;
  debouncedResize = debounce(() => this.onResize(), 16);
  debouncedUpdateScreen = debounce(() => this.updateScreen(), 1);
  debouncedUpdateViewportRect = debounce(
    () => this.ctx.updateViewportRect(),
    100,
  );
  throttledTouchMove = throttle(e => this.handleTouchMove(e), 1);
  forceContentReflowDebounced = debounce(() => this.forceContentReflow(), 30);

  elMouseDown = (e: MouseEvent | TouchEvent) => this.onPointerDown(e);
  elMouseUp = (e: MouseEvent | TouchEvent) => this.onPointerUp(e);
  elMouseMove = (e: MouseEvent | TouchEvent) => this.onPointerMove(e);

  elTouchStart = (e: TouchEvent) => this.handleTouchStart(e);
  elTouchMove = (e: TouchEvent) => this.throttledTouchMove(e);
  elTouchEnd = (e: MouseEvent | TouchEvent) => this.onPointerUp(e);

  elWheel = (e: WheelEvent) => this.handleWheel(e);

  elScroll = () => this.debouncedUpdateViewportRect();

  componentDidLoad() {
    this.ctx = new ViewContext(this.el);
    // this.ctx.camera = this.ctx.camera;

    this.ctx.viewportEl = this.el.querySelector(
      '.logic-flow-viewport',
    ) as HTMLDivElement;
    this.ctx.contentEl = this.el.querySelector(
      '.viewport-content',
    ) as HTMLDivElement;
    this.ctx.gridEl = this.el.querySelector(
      '.logic-flow-grid',
    ) as HTMLCanvasElement;
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

  @Method()
  async getCamera() {
    return this.ctx.camera;
  }

  @Method()
  async screenToWorldCoords(screenCoords: Coords) {
    // adjust screen coords to viewport offset
    const loc = {
      x: screenCoords.x - this.ctx.viewportOffset.left,
      y: screenCoords.y - this.ctx.viewportOffset.top,
    };

    return this.ctx.camera.toWorldCoords(loc);
  }

  @Watch('snapToGrid')
  onSnapToGridChange() {
    this.ctx.snapToGrid = this.snapToGrid;
  }

  @Watch('gridType')
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
    if (!this.showGrid || !this.ctx.needsRedraw) return;

    requestAnimationFrame(() => {
      if (this.gridType === 'line') {
        renderCanvasGrid(
          this.ctx.gridEl,
          this.ctx.viewportRect.width,
          this.ctx.viewportRect.height,
          this.gridSize,
          this.gridLineColor,
          this.gridBgColor,
          this.ctx.camera,
        );
      }

      if (this.gridType === 'dot') {
        renderCanvasDotGrid(
          this.ctx.gridEl,
          this.ctx.viewportRect.width,
          this.ctx.viewportRect.height,
          this.gridSize,
          this.gridLineColor,
          this.gridBgColor,
          this.ctx.camera,
        );
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

  onPointerDown(event: MouseEvent | TouchEvent) {
    const loc = getEventLocation(event);
    const worldCoords = this.ctx.camera.toWorldCoords(loc);
    const target = document.elementFromPoint(loc.x, loc.y) as HTMLElement;

    // if pointer outside viewport, return
    if (
      loc.x > this.ctx.viewportOffset.left + this.ctx.viewportRect.width ||
      loc.x < this.ctx.viewportOffset.left ||
      loc.y > this.ctx.viewportOffset.top + this.ctx.viewportRect.height ||
      loc.y < this.ctx.viewportOffset.top
    ) {
      return;
    }

    // if target is not a logic-flow element, return
    if (
      !target ||
      !target.closest(
        'logic-flow-node, logic-flow-connector, logic-flow-connection, logic-flow-viewport',
      )
    ) {
      return;
    }

    // if a connection clicked
    if (
      this.ctx.startDisconnectConnection(
        target as HTMLLogicFlowConnectionElement,
        loc,
        this.connectorSnappingDistance,
        this.cursors.moving,
      )
    )
      return;

    // if a connector clicked
    if (this.ctx.startNewConnection(target as HTMLLogicFlowConnectorElement))
      return;

    // if a node clicked
    if (this.ctx.startNodeDrag(target as HTMLLogicFlowNodeElement, worldCoords))
      return;

    // if nothing clicked, then start panning
    this.ctx.startPanning(worldCoords);
  }

  onPointerUp(event: MouseEvent | TouchEvent) {
    if (this.ctx.activeConnector && this.ctx.activeConnection) {
      this.onEndActiveConnection(event);
    } else if (this.ctx.activeNode && this.ctx.activeNodeDragging) {
      this.ctx.endNodeDrag();
    }

    this.ctx.resetPointerStates();
  }

  onEndActiveConnection(event: MouseEvent | TouchEvent) {
    const loc = getEventLocation(event);
    let target = event.target as HTMLElement;

    // For touch events, get the element at the touch point
    if (event instanceof TouchEvent) {
      target = document.elementFromPoint(loc.x, loc.y) as HTMLElement;
    }

    let targetConnector = this.ctx.getTargetConnector(
      target,
      loc,
      this.connectorSnappingDistance,
    );

    if (targetConnector) {
      this.ctx.processConnection(targetConnector);
    } else {
      this.ctx.activeConnection.remove();
    }

    // clear active states
    this.ctx.activeConnector = null;
    this.ctx.activeConnection = null;
  }

  onPointerMove(event: MouseEvent | TouchEvent) {
    const loc = getEventLocation(event);

    if (this.ctx.activeConnector && this.ctx.activeConnection) {
      this.ctx.moveActiveConnection(loc, this.connectorSnappingDistance);
    } else if (this.ctx.activeNode && this.ctx.activeNodeDragging) {
      this.ctx.moveNode(loc, this.gridSize);
    } else if (this.ctx.isPanning) {
      this.ctx.panCamera(loc);
      this.scheduleComponentUpdate();
    }
  }

  handleWheel(event: WheelEvent) {
    event.preventDefault();

    const canvasRect = this.ctx.viewportRect;
    const mouseX =
      event.clientX - canvasRect.left - this.ctx.viewportOffset.left;
    const mouseY = event.clientY - canvasRect.top - this.ctx.viewportOffset.top;

    // Calculate the zoom level change
    const zoomDelta = event.deltaY < 0 ? this.zoomSpeed : -this.zoomSpeed;
    const newZoom = Math.min(
      this.maxZoom,
      Math.max(this.minZoom, this.ctx.camera.zoom + zoomDelta),
    );

    // Calculate the scale factor
    const scaleFactor = newZoom / this.ctx.camera.zoom;

    // Adjust the pan position to keep the same point under the cursor
    const newPanX =
      mouseX -
      (mouseX - this.ctx.camera.pos.x * this.ctx.camera.zoom) * scaleFactor;

    const newPanY =
      mouseY -
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

  handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      // Single touch -> start panning
      this.onPointerDown(event);
    } else if (event.touches.length === 2) {
      // Multi-touch -> start pinch zoom
      this.ctx.initialPinchDistance = 0; // Reset initial pinch distance
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

    if (this.ctx.initialPinchDistance === 0) {
      // If it's the start of the pinch, initialize the pinch distance
      this.ctx.initialPinchDistance = distance;
    } else {
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

  adjustZoomOnPinch(
    scaleFactor: number,
    pinchCenterX: number,
    pinchCenterY: number,
  ) {
    // Calculate new zoom, ensuring it stays within min/max bounds
    const newZoom = Math.min(
      this.maxZoom,
      Math.max(this.minZoom, this.ctx.camera.zoom * scaleFactor),
    );

    // Find the pinch center position relative to the content's current position and zoom
    const pinchContentX =
      (pinchCenterX - this.ctx.camera.pos.x * this.ctx.camera.zoom) /
      this.ctx.camera.zoom;
    const pinchContentY =
      (pinchCenterY - this.ctx.camera.pos.y * this.ctx.camera.zoom) /
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
      <div class="logic-flow-viewport">
        <canvas
          class="logic-flow-grid"
          style={{ display: this.showGrid ? 'block' : 'none' }}
        ></canvas>
        <div class="viewport-content">
          <slot></slot>
        </div>
      </div>
      // /* </Host> */
    );
  }
}
