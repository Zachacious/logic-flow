import { Component, Host, Prop, h, Element, State, Watch } from '@stencil/core';
import { Point } from '../../types/Point';
import { throttle } from '../../utils/throttle';
import { events } from '../../events';

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

  private _dragStart: Point;

  private _throttledPointerMove = throttle(e => this.onPointerMove(e), 30);
  private _throttledTouchMove = throttle(e => this.handleTouchMove(e), 30);

  private _elMouseDown = (e: MouseEvent | TouchEvent) => this.onPointerDown(e);
  private _elMouseUp = () => this.onPointerUp();
  private _elMouseMove = (e: MouseEvent | TouchEvent) =>
    this._throttledPointerMove(e);

  private _elTouchStart = (e: TouchEvent) => this.handleTouchStart(e);
  private _elTouchMove = (e: TouchEvent) => this._throttledTouchMove(e);
  private _elTouchEnd = () => this.onPointerUp();

  componentDidLoad() {
    // this.updatePosition();

    window.addEventListener('mouseup', this._elMouseUp, { passive: true });
    window.addEventListener('mousemove', this._elMouseMove, { passive: true });

    this.el.addEventListener('mousedown', this._elMouseDown, { passive: true });
    // this.el.addEventListener('mouseup', this._elMouseUp, { passive: true });
    // this.el.addEventListener('mousemove', this._elMouseMove, { passive: true });

    this.el.addEventListener('touchstart', this._elTouchStart, {
      passive: true,
    });
    this.el.addEventListener('touchend', this._elTouchEnd, { passive: true });
    this.el.addEventListener('touchmove', this._elTouchMove, { passive: true });
  }

  @Watch('isDragging')
  onIsDraggingChange() {
    if (this.isDragging) {
      events.emit('nodeDragStart', this.el, this.position);
    } else {
      events.emit('nodeDragStopped', this.el);
    }
  }

  // @Watch('position')
  // onPositionChange() {
  //   this.updatePosition();
  // }

  // updatePosition() {
  //   this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
  // }

  // getEventLocation(event: MouseEvent | TouchEvent) {
  //   if (event instanceof TouchEvent) {
  //     if (event.touches && event.touches[0]) {
  //       return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  //     }
  //   } else {
  //     return { x: event.clientX, y: event.clientY };
  //   }
  // }

  // handle drag and drop positioning
  onPointerDown(e: MouseEvent | TouchEvent) {
    e.stopPropagation();
    this.isDragging = true;
    // this._dragStart = this.getEventLocation(e);
  }

  onPointerMove(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    e.stopPropagation();
    // const loc = this.getEventLocation(e);
    // const dx = loc.x - this._dragStart.x;
    // const dy = loc.y - this._dragStart.y;
    // this.position = { x: this.position.x + dx, y: this.position.y + dy };
  }

  onPointerUp() {
    this.isDragging = false;
    // update position with new transform
    const transform = this.el.style.transform;
    const matches = transform.match(/translate\((\d+)px, (\d+)px\)/);
    if (matches) {
      this.position = {
        x: parseInt(matches[1], 10),
        y: parseInt(matches[2], 10),
      };
    }
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
