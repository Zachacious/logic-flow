import { Component, Host, Prop, h, Element, State, Watch } from '@stencil/core';
import { Coords } from '../../types/Coords';

@Component({
  tag: 'logic-flow-node',
  styleUrl: 'logic-flow-node.css',
  shadow: false,
})
export class LogicFlowNode {
  @Element() el: HTMLElement;

  @Prop() type: string = 'default';
  // @Prop() name: string = 'Node';
  @Prop({ mutable: true }) position: Coords = { x: 0, y: 0 };
  @Prop({ mutable: true }) isVisible: boolean = true;

  @State() isDragging = false;

  style = {};

  componentWillLoad() {
    //  set initial size
    this.updateTransform();

    // this.position = { x: this.position.x, y: this.position.y };
    this.onPositionChange(this.position);
  }

  @Watch('position')
  onPositionChange(newValue: Coords | string) {
    if (typeof newValue === 'string') {
      this.position = JSON.parse(newValue);
    }
    // update transform
    this.updateTransform();
  }

  updateTransform() {
    this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
  }

  componentWillRender() {
    if (!this.isVisible) {
      this.style = { display: 'none' };
    } else {
      this.style = {};
    }
  }

  render() {
    // console.log('render', this.isVisible);
    return (
      <Host class="logic-flow-node" style={this.style} tabIndex="0">
        {/* <div class="logic-flow-node-header">
          {this.name}
          <slot name="header"></slot>
        </div> */}
        <slot></slot>
        {/* <div class="logic-flow-node-footer">
          <slot name="footer"></slot>
        </div> */}
      </Host>
    );
  }
}
