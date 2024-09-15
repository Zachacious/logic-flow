import { Component, Host, Prop, Watch, h } from '@stencil/core';
import { Point } from '../../types/Point';
import { global } from '../../global';

@Component({
  tag: 'logic-connection',
  styleUrl: 'logic-connection.css',
  shadow: false,
})
export class LogicConnection {
  @Prop() start: Point = { x: 0, y: 0 };
  @Prop() end: Point = { x: 0, y: 0 };
  @Prop() type: 'input' | 'output' = 'input';

  path: string;
  private _uid: string = global().registerConnection(this);

  @Watch('start')
  @Watch('end')
  @Watch('type')
  updatePath() {
    // requestAnimationFrame(() => {
    const delta = {
      x: this.end.x - this.start.x,
      y: this.end.y - this.start.y,
    };
    const distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);

    const controlOffset = Math.min(200, distance * 0.5);

    // curve should be different depending on the direction
    // if point comes out from left - curve should go to the right
    if (this.type === 'output') {
      this.path = `M ${this.start.x},${this.start.y}
          C ${this.start.x + controlOffset},${this.start.y}
            ${this.end.x - controlOffset},${this.end.y}
            ${this.end.x},${this.end.y}`;
    }
    // if point comes out from right - curve should go to the left
    else {
      // so we need to swap control points
      this.path = `M ${this.start.x},${this.start.y}
          C ${this.start.x - controlOffset},${this.start.y}
            ${this.end.x + controlOffset},${this.end.y}
            ${this.end.x},${this.end.y}`;
    }
    // });
  }
  render() {
    return (
      <Host class="logic-connection" id={this._uid}>
        <svg class="connection">
          <path class="connection-line" d={this.path}></path>
        </svg>
      </Host>
    );
  }
}
