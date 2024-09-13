import { Component, Host, Prop, h, Element, State, Watch } from '@stencil/core';
import { Point } from '../../types/Point';
import { throttle } from '../../utils/throttle';
import { getEventLocation } from '../../utils/getEventLocation';
import { debounce } from '../../utils/debounce';
import { nanoid } from 'nanoid';
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

  private _uid: string = nanoid();

  _dragStart: Point = { x: 0, y: 0 };

  private _debouncedUpdateTransform = debounce(
    () => this.updateTransform(),
    10,
  );

  @Watch('position')
  onPositionChange() {
    // update transform
    this._debouncedUpdateTransform();
  }

  updateTransform() {
    this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
  }

  render() {
    return (
      <Host class="flowy-node" id={this._uid}>
        {/* <div class="flowy-node"> */}
        <div class="flowy-node-header">
          {this.title}
          <slot name="header"></slot>
        </div>
        <slot></slot>
        <div class="flowy-node-footer">
          <slot name="footer"></slot>
        </div>
        {/* </div> */}
      </Host>
    );
  }
}
