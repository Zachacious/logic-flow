import { Component, Host, Prop, h, Element, State, Watch } from '@stencil/core';
import { Point } from '../../types/Point';
import { throttle } from '../../utils/throttle';
import { getEventLocation } from '../../utils/getEventLocation';
import { debounce } from '../../utils/debounce';
// import { events } from '../../events';

@Component({
  tag: 'logic-node',
  styleUrl: 'logic-node.css',
  shadow: false,
})
export class LogicNode {
  @Element() el: HTMLElement;

  @Prop() type: string = 'default';
  @Prop() title: string = 'Node';
  @Prop({ mutable: true }) position: Point = { x: 0, y: 0 };

  @State() isDragging = false;

  private _canvasZoom = 1;
  private _canvasPan = { x: 0, y: 0 };

  private _dragStart: Point = { x: 0, y: 0 };

  private _throttledPointerMove = throttle(e => this.onPointerMove(e), 10);
  private _throttledTouchMove = throttle(e => this.handleTouchMove(e), 10);

  private _elMouseDown = (e: MouseEvent | TouchEvent) => this.onPointerDown(e);
  private _elMouseUp = () => this.onPointerUp();
  private _elMouseMove = (e: MouseEvent | TouchEvent) =>
    this._throttledPointerMove(e);

  private _elTouchStart = (e: TouchEvent) => this.handleTouchStart(e);
  private _elTouchMove = (e: TouchEvent) => this._throttledTouchMove(e);
  private _elTouchEnd = () => this.onPointerUp();

  private _debouncedUpdateTransform = debounce(
    () => this.updateTransform(),
    10,
  );

  componentDidLoad() {
    window.addEventListener('mouseup', this._elMouseUp, { passive: true });
    window.addEventListener('mousemove', this._elMouseMove, { passive: false });

    this.el.addEventListener('mousedown', this._elMouseDown, {
      passive: false,
    });
    this.el.addEventListener('touchstart', this._elTouchStart, {
      passive: false,
    });
    this.el.addEventListener('touchend', this._elTouchEnd, { passive: true });
    this.el.addEventListener('touchmove', this._elTouchMove, {
      passive: false,
    });
  }

  disconnectedCallback() {
    window.removeEventListener('mouseup', this._elMouseUp);
    window.removeEventListener('mousemove', this._elMouseMove);

    this.el.removeEventListener('mousedown', this._elMouseDown);
    this.el.removeEventListener('touchstart', this._elTouchStart);
    this.el.removeEventListener('touchend', this._elTouchEnd);
    this.el.removeEventListener('touchmove', this._elTouchMove);
  }

  @Watch('position')
  onPositionChange() {
    // update transform
    this._debouncedUpdateTransform();
    // this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
  }

  updateTransform() {
    this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
  }

  // handle drag and drop positioning
  onPointerDown(e: MouseEvent | TouchEvent) {
    e.stopPropagation();
    this.isDragging = true;

    const loc = getEventLocation(e);
    // Get the current position of the node
    const nodeRect = this.el.getBoundingClientRect();

    // Get canvas bounding rect for pan/zoom calculations
    const contentEl = this.el.closest('.flowy-content') as HTMLElement;
    if (!contentEl) return;

    // Store the current canvas zoom level
    const zoomMatches = contentEl.style.transform.match(
      /scale\((\d+(?:\.\d+)?)\)/,
    );
    this._canvasZoom = zoomMatches ? parseFloat(zoomMatches[1]) : 1;

    // Store the current canvas pan position
    const panMatches = contentEl.style.transform.match(
      /translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/,
    );

    this._canvasPan = {
      x: panMatches ? parseInt(panMatches[1], 10) : 0,
      y: panMatches ? parseInt(panMatches[2], 10) : 0,
    };

    this._dragStart = {
      x: (loc.x - nodeRect.left) / this._canvasZoom,
      y: (loc.y - nodeRect.top) / this._canvasZoom,
    };
  }

  onPointerMove(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    e.stopPropagation();

    requestAnimationFrame(() => {
      const loc = getEventLocation(e);
      const newX =
        loc.x / this._canvasZoom - this._dragStart.x - this._canvasPan.x;
      const newY =
        loc.y / this._canvasZoom - this._dragStart.y - this._canvasPan.y;

      this.position = { x: newX, y: newY };
    });
  }

  onPointerUp() {
    this.isDragging = false;
  }

  handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    this.onPointerDown(e);
  }

  handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    this.onPointerMove(e);
  }

  render() {
    return (
      <Host class="flowy-node">
        {/* <div class="flowy-node"> */}
        <div class="flowy-node-header">
          {this.title}
          <slot name="header"></slot>
        </div>
        <slot></slot>
        <div class="flowy-node-footer"></div>
        {/* </div> */}
      </Host>
    );
  }
}
