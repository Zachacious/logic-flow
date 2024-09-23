import {
  Component,
  Host,
  Prop,
  h,
  Element,
  State,
  Watch,
  forceUpdate,
} from '@stencil/core';
import { Coords } from '../../types/Coords';
import { ViewContext } from '../../types/ViewContext';
// import { debounce } from '../../utils/debounce';

@Component({
  tag: 'logic-flow-node',
  styleUrl: 'logic-flow-node.css',
  shadow: false,
})
export class LogicFlowNode {
  @Element() el: HTMLElement;

  @Prop() type: string = 'default';
  @Prop() title: string = 'Node';
  @Prop({ mutable: true }) position: Coords = { x: 0, y: 0 };
  @Prop({ mutable: true }) isVisible: boolean = true;

  @State() isDragging = false;

  style = {};

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

  // @Watch('data-visible')
  // onDataChange() {
  //   // console.log('data-trigger changed', this.el.dataset.visible);
  //   forceUpdate(this);
  //   console.log('force update', this.el.id);
  // }

  updateTransform() {
    this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
  }

  // componentWillRender() {
  //   if (!this.isVisible) return false;
  // }

  componentWillRender() {
    if (!this.isVisible) {
      this.style = { display: 'none' };
    } else {
      this.style = {};
    }
  }

  render() {
    console.log('render', this.isVisible);
    return (
      <Host class="logic-flow-node" style={this.style}>
        <div class="logic-flow-node-header">
          {this.title}
          <slot name="header"></slot>
        </div>
        <slot></slot>
        <div class="logic-flow-node-footer">
          <slot name="footer"></slot>
        </div>
      </Host>
    );
  }
}
