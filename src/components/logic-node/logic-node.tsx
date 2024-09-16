import {
  Component,
  Host,
  Prop,
  h,
  Element,
  State,
  Watch,
  Method,
} from '@stencil/core';
import { Point } from '../../types/Point';
import { Size } from '../../types/Size';
import { global } from '../../global';

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
  @Prop({ mutable: true }) size: Size = { width: 0, height: 0 };

  @State() isDragging = false;

  private _uid: string = global().registerNode(this);

  @Method()
  async getUid() {
    return this._uid;
  }

  @Method()
  async destroy() {
    global().unregisterNode(this._uid);
  }

  componentWillLoad() {
    //  set initial size
    this.updateTransform();
    const rect = this.el.getBoundingClientRect();
    this.size = { width: rect.width, height: rect.height };
    this.position = { x: this.position.x, y: this.position.y };
  }

  disconnectedCallback() {
    global().unregisterNode(this._uid);
  }

  @Watch('position')
  onPositionChange() {
    // update transform
    this.updateTransform();
    // this._debouncedUpdateTransform();
  }

  updateTransform() {
    // requestAnimationFrame(() => {
    this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
    // });
  }

  render() {
    return (
      <Host class="flowy-node" id={this._uid}>
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
