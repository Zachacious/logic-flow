import { Component, Host, Prop, h } from '@stencil/core';
import { Point } from '../../types/Point';

@Component({
  tag: 'logic-connection',
  styleUrl: 'logic-connection.css',
  shadow: false,
})
export class LogicConnection {
  @Prop() start: Point = { x: 0, y: 0 };
  @Prop() end: Point = { x: 0, y: 0 };
  render() {
    const delta = {
      x: this.end.x - this.start.x,
      y: this.end.y - this.start.y,
    };
    const distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);

    const angle = Math.atan2(delta.y, delta.x);
    const controlOffset = Math.min(100, distance * 0.3);

    // draw smooth bezier curve
    const d = `M ${this.start.x},${this.start.y}
          C ${this.start.x + controlOffset},${this.start.y}
            ${this.end.x - controlOffset},${this.end.y}
            ${this.end.x},${this.end.y}`;

    return (
      <Host class="logic-connection">
        <svg class="connection">
          <path class="connection-line" d={d}></path>
        </svg>
      </Host>
    );
  }
}
