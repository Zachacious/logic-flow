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
  private _capRadius = 5;

  componentWillLoad() {
    // calculate cap width based on connector size
    // grab a .connector element from the dom
    const connector = document.querySelector('.connector');
    if (connector) {
      // get size from css
      const style = getComputedStyle(connector);
      this._capRadius = parseInt(style.width) / 2;
    }
  }

  @Watch('start')
  @Watch('end')
  @Watch('type')
  updatePath() {
    const delta = {
      x: this.end.x - this.start.x,
      y: this.end.y - this.start.y,
    };
    const distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);
    const controlOffset = Math.min(100, distance * 0.35);

    // Calculate start and end points for the path
    const startInset = {
      x: this.start.x + this._capRadius,
      y: this.start.y,
    };
    const endInset = {
      x: this.end.x - this._capRadius,
      y: this.end.y,
    };

    // Generate the path based on type
    if (this.type === 'output') {
      this.path = `M ${startInset.x},${startInset.y}
          C ${startInset.x + controlOffset},${startInset.y}
            ${endInset.x - controlOffset},${endInset.y}
            ${endInset.x},${endInset.y}`;
    } else {
      this.path = `M ${startInset.x},${startInset.y}
          C ${startInset.x - controlOffset},${startInset.y}
            ${endInset.x + controlOffset},${endInset.y}
            ${endInset.x},${endInset.y}`;
    }
  }

  render() {
    return (
      <Host class="logic-connection" id={this._uid}>
        <svg class="connection">
          <path class="connection-line" d={this.path}></path>
          {/* Start cap */}
          <circle
            cx={this.start.x}
            cy={this.start.y}
            r="1px"
            class="connection-cap start-cap"
          />
          {/* End cap */}
          <circle
            cx={this.end.x}
            cy={this.end.y}
            r="1px"
            class="connection-cap end-cap"
          />
        </svg>
      </Host>
    );
  }
}
