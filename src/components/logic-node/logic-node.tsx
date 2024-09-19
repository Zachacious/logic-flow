import { Component, Host, Prop, h, Element, State, Watch } from '@stencil/core';
import { Coords } from '../../types/Coords';
// import { debounce } from '../../utils/debounce';

@Component({
  tag: 'logic-node',
  styleUrl: 'logic-node.css',
  shadow: false,
})
export class LogicNode {
  @Element() el: HTMLElement;

  @Prop() type: string = 'default';
  @Prop() title: string = 'Node';
  @Prop({ mutable: true }) position: Coords = { x: 0, y: 0 };

  @State() isDragging = false;

  componentWillLoad() {
    //  set initial size
    this.updateTransform();

    this.position = { x: this.position.x, y: this.position.y };
  }

  @Watch('position')
  onPositionChange() {
    // update transform
    this.updateTransform();
  }

  updateTransform() {
    this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
  }

  render() {
    return (
      <Host class="flowy-node">
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
